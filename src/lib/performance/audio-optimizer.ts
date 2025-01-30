import { voiceLogger } from '../logging/voice-logger';

export class AudioOptimizer {
  // Reduzir tamanho do arquivo de áudio
  static async compressAudio(audioBlob: Blob, quality: number = 0.5): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const audioContext = new AudioContext();
      const startTime = performance.now();

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          const offlineContext = new OfflineAudioContext(
            audioBuffer.numberOfChannels,
            audioBuffer.length,
            audioBuffer.sampleRate
          );

          const source = offlineContext.createBufferSource();
          source.buffer = audioBuffer;

          const compressor = offlineContext.createDynamicsCompressor();
          compressor.threshold.value = -50;
          compressor.knee.value = 40;
          compressor.ratio.value = 12;
          compressor.attack.value = 0;
          compressor.release.value = 0.25;

          source.connect(compressor);
          compressor.connect(offlineContext.destination);

          source.start();
          const renderedBuffer = await offlineContext.startRendering();

          const audioElement = new Audio();
          audioElement.src = URL.createObjectURL(this.bufferToWave(renderedBuffer, quality));

          const endTime = performance.now();
          
          voiceLogger.log({
            type: 'recording',
            success: true,
            details: `Audio comprimido em ${endTime - startTime}ms`,
            duration: endTime - startTime
          });

          resolve(this.bufferToWave(renderedBuffer, quality));
        } catch (error) {
          voiceLogger.log({
            type: 'recording',
            success: false,
            details: 'Erro na compressão de áudio'
          });
          reject(error);
        }
      };

      reader.readAsArrayBuffer(audioBlob);
    });
  }

  // Converter AudioBuffer para Blob
  private static bufferToWave(audioBuffer: AudioBuffer, quality: number): Blob {
    const numOfChan = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];
    let sample;
    let offset = 0;
    let pos = 0;

    // Escrever cabeçalho WAV
    setUint32(0x46464952);                         // "RIFF"
    setUint32(length - 8);                         // Tamanho do arquivo
    setUint32(0x45564157);                         // "WAVE"

    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // Tamanho do chunk
    setUint16(1);                                  // Formato PCM
    setUint16(numOfChan);                          // Número de canais
    setUint32(audioBuffer.sampleRate);             // Taxa de amostragem
    setUint32(audioBuffer.sampleRate * 2 * numOfChan); // Taxa de bytes
    setUint16(numOfChan * 2);                      // Alinhamento de bloco
    setUint16(16);                                 // Bits por amostra

    setUint32(0x61746164);                         // "data" chunk
    setUint32(length - pos - 4);                   // Tamanho dos dados

    // Escrever dados de áudio
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      channels.push(audioBuffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    // Criar Blob com qualidade ajustável
    return new Blob([buffer], { type: 'audio/wav' });

    function setUint16(data: number) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data: number) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  }

  // Cache de transcrições
  private static transcriptionCache = new Map<string, string>();

  static cacheTranscription(audioHash: string, transcription: string) {
    this.transcriptionCache.set(audioHash, transcription);
  }

  static getCachedTranscription(audioHash: string): string | undefined {
    return this.transcriptionCache.get(audioHash);
  }

  static clearTranscriptionCache() {
    this.transcriptionCache.clear();
  }
}

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testVoiceEndpoints() {
  const baseURL = 'http://localhost:3000/api/voice';

  try {
    // Teste de treinamento
    console.log('Testando endpoint de treinamento...');
    const trainResponse = await axios.post(`${baseURL}/train`, {
      prompt_type: 'custom',
      prompt_text: 'Assistente de suporte técnico para testes'
    });
    console.log('Treinamento:', trainResponse.data);

    // Teste de chamada
    console.log('Testando endpoint de chamada...');
    const callResponse = await axios.post(`${baseURL}/call`, {
      phone_number: '+55 (11) 99999-9999',
      prompt: 'Chamada de teste automatizado'
    });
    console.log('Chamada:', callResponse.data);

    // Teste de transcrição
    console.log('Testando endpoint de transcrição...');
    const form = new FormData();
    form.append('file', Buffer.from('Áudio de teste'), { filename: 'test-audio.wav' });

    const transcribeResponse = await axios.post(`${baseURL}/transcribe`, form, {
      headers: form.getHeaders()
    });
    console.log('Transcrição:', transcribeResponse.data);

    // Teste de síntese de voz
    console.log('Testando endpoint de síntese...');
    const synthesizeResponse = await axios.post(`${baseURL}/synthesize`, {
      text: 'Olá, este é um teste de síntese de voz',
      voice: 'female',
      language: 'pt-BR'
    });
    console.log('Síntese:', synthesizeResponse.data);

  } catch (error) {
    console.error('Erro nos testes de endpoint:', error.response ? error.response.data : error.message);
  }
}

testVoiceEndpoints();

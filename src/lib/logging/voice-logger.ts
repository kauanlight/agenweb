import { v4 as uuidv4 } from 'uuid';

export interface VoiceLogEntry {
  id?: string;
  type: string;
  success: boolean;
  details?: string;
  timestamp?: number;
}

class VoiceLogger {
  private static instance: VoiceLogger;
  private logs: VoiceLogEntry[] = [];

  private constructor() {}

  public static getInstance(): VoiceLogger {
    if (!VoiceLogger.instance) {
      VoiceLogger.instance = new VoiceLogger();
    }
    return VoiceLogger.instance;
  }

  log(entry: VoiceLogEntry): void {
    const logEntry: VoiceLogEntry = {
      ...entry,
      id: uuidv4(),
      timestamp: Date.now()
    };

    // Registrar log de acordo com o status
    if (logEntry.success) {
      console.log(logEntry);
    } else {
      console.error(logEntry);
    }

    // Manter apenas os 100 logs mais recentes
    this.logs.push(logEntry);
    if (this.logs.length > 100) {
      this.logs.shift();
    }
  }

  getLogs(): VoiceLogEntry[] {
    return [...this.logs];
  }

  getLogStatistics() {
    const totalLogs = this.logs.length;
    const successLogs = this.logs.filter(log => log.success).length;
    
    return {
      totalLogs,
      successLogs,
      successRate: (successLogs / totalLogs) * 100 || 0
    };
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const voiceLogger = VoiceLogger.getInstance();

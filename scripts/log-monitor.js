const fs = require('fs');
const path = require('path');

function monitorLogs() {
  const logFile = path.join(__dirname, '../.next/server/logs/voice-assistant.log');
  
  console.log('Iniciando monitoramento de logs...');

  const watcher = fs.watch(logFile, (eventType, filename) => {
    if (eventType === 'change') {
      fs.readFile(logFile, 'utf8', (err, data) => {
        if (err) {
          console.error('Erro ao ler arquivo de log:', err);
          return;
        }
        
        const newLogs = data.split('\n').filter(line => line.trim() !== '');
        newLogs.forEach(log => {
          console.log('NOVO LOG:', log);
        });
      });
    }
  });

  process.on('SIGINT', () => {
    watcher.close();
    console.log('Monitoramento de logs encerrado.');
    process.exit();
  });
}

monitorLogs();

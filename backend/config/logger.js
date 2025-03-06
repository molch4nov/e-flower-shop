const pino = require('pino');
const fs = require('fs');
const path = require('path');

// Создаем директорию для логов, если её нет
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Функция для получения имени файла лога с датой
function getLogFileName() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = Math.floor(now.getHours() / 3) * 3; // Округление до 3-часовых блоков
  const hourStr = String(hour).padStart(2, '0');
  
  return path.join(logsDir, `${year}-${month}-${day}_${hourStr}h.log`);
}

// Создаем поток для записи логов
const logStream = pino.destination({
  dest: getLogFileName(),
  sync: false, // Асинхронная запись для лучшей производительности
  // Проверка каждые 5 минут, нужно ли обновить файл лога
  mkdir: true,
  interval: 5 * 60 * 1000, 
});

// Каждые 3 часа проверяем, нужно ли обновить имя файла
setInterval(() => {
  const newFilename = getLogFileName();
  if (logStream.filename !== newFilename) {
    logStream.reopen({ dest: newFilename });
  }
}, 10 * 60 * 1000); // Проверяем каждые 10 минут

// Проверяем правильность пути при закрытии приложения
process.on('exit', () => {
  logStream.flushSync();
});

// Создаем логгер
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  base: undefined, // Не включать pid и hostname в каждую запись
}, logStream);

// Функция для получения логгера для конкретного модуля
function getLogger(moduleName) {
  return logger.child({ module: moduleName });
}

module.exports = getLogger; 
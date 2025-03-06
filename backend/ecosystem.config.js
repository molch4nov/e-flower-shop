module.exports = {
  apps: [
    {
      name: 'api-server',
      script: './server.js',
      instances: 'max', // Использовать все доступные CPU ядра
      exec_mode: 'cluster', // Запуск в режиме кластера
      watch: false, // Отключить автоматическую перезагрузку при изменении файлов
      max_memory_restart: '500M', // Перезагрузка при достижении 500MB памяти
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Настройки логов PM2 (отдельно от нашего логгера)
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      // Обновление логов при ротации
      log_type: 'json',
      time: true
    }
  ]
}; 
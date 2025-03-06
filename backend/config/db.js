const { Pool } = require('pg');
const logger = require('./logger')('database');

// Создаем пул соединений
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT
});

// Проверка соединения (только для не-тестового окружения)
if (process.env.NODE_ENV !== 'test') {
  pool.connect((err, client, release) => {
    if (err) {
      return logger.error({ err }, 'Ошибка подключения к PostgreSQL');
    }
    logger.info('Подключение к PostgreSQL успешно установлено');
    release();
  });
}

// Обработка завершения работы приложения
process.on('SIGINT', async () => {
  logger.info('Закрытие соединений с PostgreSQL...');
  await pool.end();
  logger.info('Соединения с PostgreSQL закрыты');
  process.exit(0);
});

// Функция для выполнения SQL-запросов
async function query(text, params) {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV !== 'production') {
      logger.debug({
        query: text,
        params,
        duration,
        rows: res.rowCount
      }, 'Выполнен запрос');
    }
    
    return res;
  } catch (err) {
    logger.error({
      err,
      query: text,
      params
    }, 'Ошибка выполнения запроса');
    throw err;
  }
}

// Функция для получения клиента из пула для транзакций
async function getClient() {
  const client = await pool.connect();
  const originalQuery = client.query.bind(client);
  
  // Переопределяем метод query для логирования в транзакциях
  client.query = async (text, params) => {
    try {
      const start = Date.now();
      const res = await originalQuery(text, params);
      const duration = Date.now() - start;
      
      if (process.env.NODE_ENV !== 'production') {
        logger.debug({
          query: text,
          params,
          duration,
          rows: res.rowCount
        }, 'Выполнен транзакционный запрос');
      }
      
      return res;
    } catch (err) {
      logger.error({
        err,
        query: text,
        params
      }, 'Ошибка выполнения транзакционного запроса');
      throw err;
    }
  };
  
  return client;
}

// Функция очистки соединений для тестов
async function closePool() {
  if (pool) {
    await pool.end();
    logger.info('Пул соединений с БД закрыт');
  }
}

module.exports = {
  query,
  getClient,
  closePool,
  pool // Экспортируем пул для непосредственного доступа
}; 
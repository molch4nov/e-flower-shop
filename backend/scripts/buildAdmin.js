const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Пути
const adminDir = path.join(__dirname, '../admin');
const adminBuildDir = path.join(adminDir, 'build');
const publicDir = path.join(__dirname, '../public/admin');

// Проверка наличия директории admin
if (!fs.existsSync(adminDir)) {
  console.error('Директория admin не найдена!');
  process.exit(1);
}

try {
  console.log('Установка зависимостей для админ-панели...');
  execSync('npm install', { cwd: adminDir, stdio: 'inherit' });
  
  console.log('Сборка админ-панели...');
  execSync('npm run build -- --debug', { cwd: adminDir, stdio: 'inherit' });
  
  // Создание директории public/admin
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Очистка директории public/admin
  fs.readdirSync(publicDir).forEach(file => {
    const filePath = path.join(publicDir, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(filePath);
    }
  });
  
  // Копирование результатов сборки
  console.log('Копирование результатов сборки в public/admin...');
  fs.cpSync(adminBuildDir, publicDir, { recursive: true });
  
  console.log('Админ-панель успешно собрана и скопирована в public/admin!');
} catch (error) {
  console.error('Ошибка при сборке админ-панели:', error);
  process.exit(1);
} 
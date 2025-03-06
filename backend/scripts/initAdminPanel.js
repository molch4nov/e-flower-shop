const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Пути
const rootDir = path.join(__dirname, '..');
const adminDir = path.join(rootDir, 'admin');

try {
  // Проверяем, существует ли уже директория admin
  if (fs.existsSync(adminDir)) {
    console.log('Директория admin уже существует. Пропускаем инициализацию...');
  } else {
    console.log('Создание директории для админ-панели...');
    fs.mkdirSync(adminDir, { recursive: true });
    fs.mkdirSync(path.join(adminDir, 'src'), { recursive: true });
    
    // Установка дополнительных зависимостей
    console.log('Установка дополнительных пакетов...');
    execSync(
      'npm init -y && npm install @headlessui/react @heroicons/react axios react react-dom react-router-dom react-toastify && npm install -D vite @vitejs/plugin-react tailwindcss autoprefixer postcss',
      { cwd: adminDir, stdio: 'inherit' }
    );
    
    // Инициализация Tailwind CSS
    console.log('Настройка Tailwind CSS...');
    execSync('npx tailwindcss init -p', { cwd: adminDir, stdio: 'inherit' });
    
    // Создаем необходимую структуру директорий
    const dirs = [
      'src/components',
      'src/pages',
      'src/pages/categories',
      'src/pages/reviews',
      'src/pages/files',
      'src/pages/flowers',
      'src/pages/products',
      'src/services',
      'src/hooks',
      'src/utils'
    ];
    
    dirs.forEach(dir => {
      const fullPath = path.join(adminDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });
  }
  
  console.log('Инициализация admin-панели завершена.');
  console.log('Теперь вы можете добавить все необходимые файлы и запустить сборку с помощью:');
  console.log('npm run build-admin');
} catch (error) {
  console.error('Ошибка при настройке admin-панели:', error);
  process.exit(1);
} 
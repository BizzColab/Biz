import fs from 'fs';
import { parse } from '@babel/parser';

const code = fs.readFileSync('c:/Users/lenovo/Desktop/Capstone Project/Biz/frontend/src/modules/DashboardModule/index.jsx', 'utf8');

try {
  parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  console.log('JSX is valid');
} catch (e) {
  console.error('JSX Invalid:', e.message);
  console.error('At line:', e.loc.line, 'column:', e.loc.column);
}

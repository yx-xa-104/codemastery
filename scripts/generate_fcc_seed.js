const fs = require('fs');
const path = require('path');

// Lesson data: [slug, title, type, duration, lang, starterCode]
const courses = [
  { id: 1, modules: [
    { id: 1, lessons: [
      ['html-structure', 'Cấu trúc HTML & Semantic Elements', 'article', 15],
      ['html-forms-media', 'Forms, Tables & Multimedia', 'article', 15],
      ['html-practice', 'Thực hành: Trang web đầu tiên', 'code_exercise', 20, 'html', '<!DOCTYPE html>\n<html>\n<head><title>My Page</title></head>\n<body>\n  <!-- Tạo một trang web với heading, paragraph và list -->\n</body>\n</html>'],
    ]},
    { id: 2, lessons: [
      ['css-selectors', 'CSS Selectors, Colors & Typography', 'article', 15],
      ['css-box-model', 'Box Model & Positioning', 'article', 15],
      ['css-practice', 'Thực hành: Styling trang web', 'code_exercise', 20, 'css', 'body {\n  /* Thêm font-family, màu nền và padding */\n}\nh1 {\n  /* Style cho tiêu đề */\n}'],
    ]},
    { id: 3, lessons: [
      ['visual-design', 'Applied Visual Design', 'article', 15],
      ['css-animation', 'CSS Animation & Transitions', 'article', 15],
      ['accessibility', 'Web Accessibility (a11y)', 'article', 15],
    ]},
    { id: 4, lessons: [
      ['flexbox', 'CSS Flexbox Layout', 'article', 20],
      ['grid', 'CSS Grid Layout', 'article', 20],
      ['responsive-practice', 'Thực hành: Responsive Layout', 'code_exercise', 25, 'css', '.container {\n  /* Tạo responsive grid layout */\n}'],
    ]},
  ]},
  { id: 2, modules: [
    { id: 5, lessons: [
      ['js-variables', 'Biến, Kiểu dữ liệu & Operators', 'article', 15],
      ['js-conditions', 'Điều kiện & Vòng lặp', 'article', 15],
      ['js-basic-practice', 'Thực hành: Logic cơ bản', 'code_exercise', 20, 'javascript', 'function isEven(num) {\n  // Trả về true nếu num là số chẵn\n}'],
    ]},
    { id: 6, lessons: [
      ['es6-basics', 'let/const, Arrow Functions & Template Literals', 'article', 15],
      ['es6-destructuring', 'Destructuring, Spread & Rest', 'article', 15],
      ['es6-async', 'Promises & Async/Await', 'article', 20],
    ]},
    { id: 7, lessons: [
      ['js-arrays', 'Arrays & Array Methods', 'article', 15],
      ['js-objects', 'Objects & JSON', 'article', 15],
      ['js-map-set', 'Map, Set & Iterators', 'article', 15],
    ]},
    { id: 8, lessons: [
      ['algo-string', 'Thuật toán xử lý chuỗi', 'article', 15],
      ['algo-sort', 'Sắp xếp & Tìm kiếm', 'article', 15],
      ['algo-practice', 'Thực hành: Giải thuật toán', 'code_exercise', 25, 'javascript', 'function reverseString(str) {\n  // Đảo ngược chuỗi str\n}'],
    ]},
    { id: 9, lessons: [
      ['fp-concepts', 'Khái niệm Functional Programming', 'article', 15],
      ['fp-hof', 'Higher-Order Functions', 'article', 15],
      ['fp-practice', 'Thực hành: Composition & Currying', 'code_exercise', 20, 'javascript', 'const double = x => x * 2;\nconst add1 = x => x + 1;\n// Tạo hàm compose(f, g) trả về f(g(x))'],
    ]},
  ]},
  { id: 3, modules: [
    { id: 'a', lessons: [
      ['bootstrap-grid', 'Bootstrap Grid & Components', 'article', 15],
      ['jquery-dom', 'jQuery DOM Manipulation', 'article', 15],
      ['jquery-events', 'jQuery Events & AJAX', 'article', 15],
    ]},
    { id: 'b', lessons: [
      ['sass-basics', 'Sass Variables, Nesting & Mixins', 'article', 15],
      ['sass-advanced', 'Functions, Operators & Partials', 'article', 15],
      ['sass-practice', 'Thực hành: Sass Project', 'code_exercise', 20, 'scss', '$primary: #3498db;\n// Tạo mixin cho responsive breakpoints'],
    ]},
    { id: 'c', lessons: [
      ['react-components', 'Components, JSX & Props', 'article', 20],
      ['react-state', 'State & Lifecycle Hooks', 'article', 20],
      ['react-practice', 'Thực hành: React App', 'code_exercise', 25, 'jsx', 'function Counter() {\n  // Tạo component đếm số với useState\n}'],
    ]},
    { id: 'd', lessons: [
      ['redux-basics', 'Store, Actions & Reducers', 'article', 20],
      ['redux-react', 'React-Redux Integration', 'article', 20],
      ['redux-practice', 'Thực hành: Redux App', 'code_exercise', 25, 'jsx', '// Tạo Redux store cho ứng dụng Todo List'],
    ]},
  ]},
  { id: 4, modules: [
    { id: 'e', lessons: [
      ['py-basics', 'Biến, Kiểu dữ liệu & I/O', 'article', 15],
      ['py-conditions', 'Điều kiện & Vòng lặp', 'article', 15],
      ['py-functions', 'Hàm & Lambda', 'code_exercise', 20, 'python', 'def factorial(n):\n    # Tính giai thừa của n\n    pass'],
    ]},
    { id: 'f', lessons: [
      ['py-lists', 'Lists & Tuples', 'article', 15],
      ['py-dicts', 'Dictionaries & Sets', 'article', 15],
      ['py-comprehensions', 'Comprehensions & Generators', 'code_exercise', 20, 'python', '# Tạo list comprehension lọc số chẵn từ 1-100\neven_numbers = []'],
    ]},
    { id: '10', lessons: [
      ['py-classes', 'Classes & Objects', 'article', 15],
      ['py-inheritance', 'Inheritance & Polymorphism', 'article', 15],
      ['py-oop-practice', 'Thực hành: OOP Project', 'code_exercise', 25, 'python', 'class Animal:\n    # Tạo class Animal với name, sound\n    pass'],
    ]},
    { id: '11', lessons: [
      ['py-fileio', 'File I/O & Error Handling', 'article', 15],
      ['py-regex', 'Regular Expressions', 'article', 15],
      ['py-modules', 'Modules & Packages', 'article', 15],
    ]},
  ]},
  { id: 5, modules: [
    { id: '12', lessons: [
      ['bash-intro', 'Terminal & Lệnh cơ bản', 'article', 15],
      ['bash-filesystem', 'File System & Permissions', 'article', 15],
      ['bash-scripting', 'Bash Scripting cơ bản', 'article', 15],
    ]},
    { id: '13', lessons: [
      ['sql-crud', 'CREATE, INSERT & SELECT', 'article', 20],
      ['sql-joins', 'WHERE, JOIN & Aggregation', 'article', 20],
      ['sql-practice', 'Thực hành: SQL Queries', 'code_exercise', 25, 'sql', 'SELECT * FROM students\nWHERE -- Lọc sinh viên có điểm >= 8\n-- Sắp xếp theo tên'],
    ]},
    { id: '14', lessons: [
      ['pg-types', 'Data Types & Constraints', 'article', 15],
      ['pg-advanced', 'Indexes, Triggers & Functions', 'article', 15],
      ['pg-design', 'Database Design & Normalization', 'article', 20],
    ]},
  ]},
  { id: 6, modules: [
    { id: '15', lessons: [
      ['node-intro', 'Giới thiệu Node.js & npm', 'article', 15],
      ['node-modules', 'Modules & File System', 'article', 15],
      ['node-practice', 'Thực hành: Node.js CLI App', 'code_exercise', 20, 'javascript', 'const fs = require("fs");\n// Đọc file và đếm số dòng'],
    ]},
    { id: '16', lessons: [
      ['express-routing', 'Routing & Middleware', 'article', 20],
      ['express-req-res', 'Request, Response & Static Files', 'article', 15],
      ['express-practice', 'Thực hành: Express Server', 'code_exercise', 25, 'javascript', 'const express = require("express");\nconst app = express();\n// Tạo route GET /api/hello'],
    ]},
    { id: '17', lessons: [
      ['mongo-crud', 'NoSQL & MongoDB CRUD', 'article', 20],
      ['mongoose-schema', 'Mongoose Schema & Models', 'article', 20],
      ['mongo-practice', 'Thực hành: MongoDB API', 'code_exercise', 25, 'javascript', 'const mongoose = require("mongoose");\n// Tạo schema cho User với name, email'],
    ]},
    { id: '18', lessons: [
      ['api-design', 'RESTful API Design', 'article', 20],
      ['api-auth', 'Authentication & Security', 'article', 20],
      ['api-practice', 'Thực hành: Full API Project', 'code_exercise', 30, 'javascript', '// Tạo CRUD API cho collection "books"\n// GET, POST, PUT, DELETE /api/books'],
    ]},
  ]},
];

let sql = '';
let lessonNum = 0;
const moduleMap = {};
let moduleIdx = 1;

// Build module ID map
for (const c of courses) {
  for (const m of c.modules) {
    const hex = moduleIdx <= 9 ? `${moduleIdx}` : moduleIdx.toString(16);
    moduleMap[`${c.id}-${m.id}`] = `fcc2000${hex.padStart(1,'0')}-0000-4000-a000-000000000001`;
    moduleIdx++;
  }
}

sql += `\n-- ============================================================================\n`;
sql += `-- LESSONS (72 bài học)\n`;
sql += `-- ============================================================================\n`;

for (const c of courses) {
  sql += `\n-- Course ${c.id} lessons\n`;
  for (const m of c.modules) {
    const modId = moduleMap[`${c.id}-${m.id}`];
    for (let li = 0; li < m.lessons.length; li++) {
      const l = m.lessons[li];
      lessonNum++;
      const lHex = lessonNum.toString(16).padStart(4, '0');
      const lessonId = `fcc3${lHex}-0000-4000-a000-000000000001`;
      const [slug, title, type, dur, lang, starter] = l;
      const isFree = li === 0 ? 'true' : 'false';
      
      if (type === 'code_exercise' && starter) {
        sql += `INSERT INTO lessons (id, module_id, title, slug, lesson_type, duration_minutes, sort_order, is_free_preview, programming_language, starter_code) VALUES\n`;
        sql += `  ('${lessonId}', '${modId}', '${title}', '${slug}', '${type}', ${dur}, ${li+1}, ${isFree}, '${lang || ''}', '${(starter||'').replace(/'/g,"''")}');\n`;
      } else {
        sql += `INSERT INTO lessons (id, module_id, title, slug, lesson_type, duration_minutes, sort_order, is_free_preview) VALUES\n`;
        sql += `  ('${lessonId}', '${modId}', '${title}', '${slug}', '${type}', ${dur}, ${li+1}, ${isFree});\n`;
      }
    }
  }
}

// Append to existing file
const seedPath = path.join(__dirname, '..', 'supabase', 'seed_freecodecamp.sql');
fs.appendFileSync(seedPath, sql);
console.log(`✅ Appended ${lessonNum} lessons to ${seedPath}`);

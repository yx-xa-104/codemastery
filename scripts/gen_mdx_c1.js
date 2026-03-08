const fs=require('fs'),p=require('path');
const contentDir=p.join(__dirname,'..','content');
const L=[
// [folder, file, title, desc, diff, lang, body]
// === RESPONSIVE WEB DESIGN ===
['responsive-web-design','01-html-structure','Cấu trúc HTML & Semantic Elements','Học cách tổ chức trang web với HTML5 semantic','beginner','html',
`# Cấu trúc HTML & Semantic Elements

HTML (HyperText Markup Language) là ngôn ngữ đánh dấu dùng để xây dựng cấu trúc trang web.

## Cấu trúc cơ bản

\`\`\`html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trang của tôi</title>
</head>
<body>
  <header>
    <nav>Menu điều hướng</nav>
  </header>
  <main>
    <article>
      <h1>Tiêu đề chính</h1>
      <p>Nội dung bài viết</p>
    </article>
    <aside>Thanh bên</aside>
  </main>
  <footer>Chân trang</footer>
</body>
</html>
\`\`\`

## Semantic Elements

| Tag | Ý nghĩa |
|-----|---------|
| \`<header>\` | Phần đầu trang hoặc section |
| \`<nav>\` | Vùng điều hướng |
| \`<main>\` | Nội dung chính (duy nhất 1 trên trang) |
| \`<article>\` | Nội dung độc lập |
| \`<section>\` | Nhóm nội dung theo chủ đề |
| \`<aside>\` | Nội dung phụ (sidebar) |
| \`<footer>\` | Chân trang |

## Tại sao dùng Semantic?

- **SEO**: Công cụ tìm kiếm hiểu cấu trúc trang tốt hơn
- **Accessibility**: Trình đọc màn hình điều hướng dễ dàng hơn
- **Bảo trì**: Code dễ đọc và duy trì hơn dùng \`<div>\` lồng nhau

## Điểm chính
- Luôn bắt đầu với \`<!DOCTYPE html>\`
- Dùng \`<meta viewport>\` cho responsive
- Ưu tiên semantic tags thay vì \`<div>\``],

['responsive-web-design','02-html-forms-media','Forms, Tables & Multimedia','Tạo biểu mẫu, bảng dữ liệu và nhúng media','beginner','html',
`# Forms, Tables & Multimedia

## Forms — Biểu mẫu

\`\`\`html
<form action="/submit" method="POST">
  <label for="name">Họ tên:</label>
  <input type="text" id="name" name="name" required>

  <label for="email">Email:</label>
  <input type="email" id="email" name="email">

  <label for="age">Tuổi:</label>
  <input type="number" id="age" min="1" max="120">

  <select name="course">
    <option value="html">HTML</option>
    <option value="css">CSS</option>
  </select>

  <textarea name="message" rows="4"></textarea>
  <button type="submit">Gửi</button>
</form>
\`\`\`

## Tables — Bảng dữ liệu

\`\`\`html
<table>
  <thead>
    <tr><th>Tên</th><th>Điểm</th></tr>
  </thead>
  <tbody>
    <tr><td>An</td><td>9.5</td></tr>
    <tr><td>Bình</td><td>8.0</td></tr>
  </tbody>
</table>
\`\`\`

## Multimedia

\`\`\`html
<img src="photo.jpg" alt="Mô tả ảnh" width="400">
<video controls width="600">
  <source src="video.mp4" type="video/mp4">
</video>
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
</audio>
\`\`\`

## Điểm chính
- Dùng \`label\` với \`for\` để liên kết input
- Thuộc tính \`required\`, \`min\`, \`max\` để validation
- Luôn thêm \`alt\` cho \`<img>\``],

['responsive-web-design','03-html-practice','Thực hành: Trang web đầu tiên','Bài tập tạo trang web hoàn chỉnh với HTML5','beginner','html',
`# Thực hành: Trang Web Đầu Tiên

## Yêu cầu
Tạo một trang portfolio cá nhân sử dụng HTML5 semantic elements.

## Bài tập

\`\`\`html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio - Tên của bạn</title>
</head>
<body>
  <header>
    <h1>Tên của bạn</h1>
    <nav>
      <a href="#about">Giới thiệu</a>
      <a href="#projects">Dự án</a>
      <a href="#contact">Liên hệ</a>
    </nav>
  </header>

  <main>
    <section id="about">
      <h2>Giới thiệu</h2>
      <p>Mô tả bản thân bạn ở đây.</p>
    </section>

    <section id="projects">
      <h2>Dự án</h2>
      <article>
        <h3>Dự án 1</h3>
        <p>Mô tả dự án</p>
      </article>
    </section>

    <section id="contact">
      <h2>Liên hệ</h2>
      <form>
        <label for="msg">Tin nhắn:</label>
        <textarea id="msg" required></textarea>
        <button type="submit">Gửi</button>
      </form>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 - Tên của bạn</p>
  </footer>
</body>
</html>
\`\`\`

## Thử thách thêm
1. Thêm bảng kỹ năng với rating
2. Thêm ảnh đại diện với \`alt\` text
3. Thêm links đến mạng xã hội`],

['responsive-web-design','04-css-selectors','CSS Selectors, Colors & Typography','Chọn phần tử, màu sắc và font chữ trong CSS','beginner','css',
`# CSS Selectors, Colors & Typography

## Selectors — Bộ chọn

\`\`\`css
/* Element selector */
p { color: #333; }

/* Class selector */
.highlight { background: yellow; }

/* ID selector */
#header { font-size: 2rem; }

/* Descendant */
nav a { text-decoration: none; }

/* Pseudo-class */
a:hover { color: #e74c3c; }
button:focus { outline: 2px solid blue; }

/* Pseudo-element */
p::first-line { font-weight: bold; }

/* Attribute selector */
input[type="email"] { border: 1px solid #3498db; }
\`\`\`

## Colors — Màu sắc

\`\`\`css
.box {
  color: #2c3e50;            /* Hex */
  background: rgb(52,152,219); /* RGB */
  border-color: hsl(210,80%,50%); /* HSL — dễ điều chỉnh nhất */
  opacity: 0.9;
}
\`\`\`

## Typography — Kiểu chữ

\`\`\`css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

h1 { font-size: 2.5rem; font-weight: 700; }
h2 { font-size: 2rem; font-weight: 600; }
\`\`\`

## Độ ưu tiên (Specificity)
\`!important\` > inline style > \`#id\` > \`.class\` > \`element\``],

['responsive-web-design','05-css-box-model','Box Model & Positioning','Mô hình hộp và cách định vị phần tử','beginner','css',
`# Box Model & Positioning

## Box Model — Mô hình hộp

Mỗi phần tử HTML là một hộp gồm 4 lớp:

\`\`\`
┌─────────────── margin ───────────────┐
│ ┌──────────── border ──────────────┐ │
│ │ ┌────────── padding ──────────┐  │ │
│ │ │       content              │  │ │
│ │ └────────────────────────────┘  │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
\`\`\`

\`\`\`css
.card {
  width: 300px;
  padding: 20px;
  border: 1px solid #ddd;
  margin: 16px auto;
  box-sizing: border-box; /* width bao gồm padding + border */
}
\`\`\`

## Positioning — Định vị

| Giá trị | Mô tả |
|---------|-------|
| \`static\` | Mặc định, theo luồng bình thường |
| \`relative\` | Dịch chuyển so với vị trí gốc |
| \`absolute\` | Định vị so với parent relative gần nhất |
| \`fixed\` | Cố định trên viewport |
| \`sticky\` | Kết hợp relative + fixed |

\`\`\`css
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
}

.modal {
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}
\`\`\``],

['responsive-web-design','06-css-practice','Thực hành: Styling trang web','Bài tập CSS cho trang portfolio','beginner','css',
`# Thực hành: Styling Trang Web

## Bài tập
Thêm CSS cho trang portfolio HTML từ bài trước.

\`\`\`css
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  color: #333;
}

header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 2rem;
  text-align: center;
}

nav a {
  color: white;
  text-decoration: none;
  margin: 0 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}
nav a:hover { background: rgba(255,255,255,0.2); }

main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

section { margin-bottom: 3rem; }

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

footer {
  background: #2c3e50;
  color: white;
  text-align: center;
  padding: 1rem;
}
\`\`\``],

['responsive-web-design','07-visual-design','Applied Visual Design','Nguyên tắc thiết kế trực quan','beginner','css',
`# Applied Visual Design

## Nguyên tắc thiết kế

### 1. Contrast — Tương phản
Tạo sự khác biệt rõ ràng giữa các phần tử.
\`\`\`css
.cta-button {
  background: #e74c3c;
  color: white;
  font-size: 1.2rem;
  padding: 12px 32px;
}
\`\`\`

### 2. Hierarchy — Thứ bậc
Hướng dẫn mắt người đọc theo thứ tự quan trọng.
\`\`\`css
h1 { font-size: 2.5rem; color: #1a1a2e; }
h2 { font-size: 1.8rem; color: #16213e; }
p  { font-size: 1rem; color: #555; }
\`\`\`

### 3. Whitespace — Khoảng trống
\`\`\`css
section { padding: 4rem 2rem; }
.card + .card { margin-top: 2rem; }
\`\`\`

### 4. Color Theory
- **Complementary**: Hai màu đối diện trên bánh xe màu
- **Analogous**: Các màu liền kề, hài hòa
- **Triadic**: Ba màu cách đều, sống động

## Shadows & Depth
\`\`\`css
.card {
  box-shadow: 0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.1);
}
.card:hover {
  box-shadow: 0 10px 25px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}
\`\`\``],

['responsive-web-design','08-css-animation','CSS Animation & Transitions','Tạo hiệu ứng chuyển động với CSS','beginner','css',
`# CSS Animation & Transitions

## Transitions — Chuyển tiếp

\`\`\`css
.button {
  background: #3498db;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  transition: all 0.3s ease;
}
.button:hover {
  background: #2980b9;
  transform: scale(1.05);
}
\`\`\`

## Keyframe Animations

\`\`\`css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.badge { animation: pulse 2s ease infinite; }
\`\`\`

## Timing Functions
| Giá trị | Hiệu ứng |
|---------|----------|
| \`ease\` | Chậm-nhanh-chậm (mặc định) |
| \`ease-in\` | Bắt đầu chậm |
| \`ease-out\` | Kết thúc chậm |
| \`linear\` | Tốc độ đều |
| \`cubic-bezier()\` | Tùy chỉnh |`],

['responsive-web-design','09-accessibility','Web Accessibility (a11y)','Thiết kế web dễ tiếp cận cho mọi người','beginner','html',
`# Web Accessibility (a11y)

Accessibility đảm bảo mọi người đều có thể sử dụng website, bao gồm người khuyết tật.

## ARIA Attributes

\`\`\`html
<button aria-label="Đóng menu" aria-expanded="false">✕</button>

<div role="alert">Lưu thành công!</div>

<nav aria-label="Menu chính">
  <a href="/" aria-current="page">Trang chủ</a>
  <a href="/about">Giới thiệu</a>
</nav>
\`\`\`

## Nguyên tắc chính

1. **Perceivable**: Thêm \`alt\` cho ảnh, caption cho video
2. **Operable**: Điều hướng bằng keyboard (Tab, Enter, Escape)
3. **Understandable**: Ngôn ngữ rõ ràng, lỗi dễ hiểu
4. **Robust**: Hoạt động trên nhiều thiết bị và trình duyệt

## Checklist nhanh
\`\`\`html
<!-- ✅ Tốt -->
<img src="cat.jpg" alt="Mèo cam đang ngủ trên sofa">
<button>Gửi đơn đăng ký</button>

<!-- ❌ Tránh -->
<img src="cat.jpg">
<div onclick="submit()">Gửi</div>
\`\`\`

## Contrast ratio
- Text bình thường: tối thiểu **4.5:1**
- Text lớn (≥18px bold): tối thiểu **3:1**`],

['responsive-web-design','10-flexbox','CSS Flexbox Layout','Bố cục linh hoạt với Flexbox','beginner','css',
`# CSS Flexbox Layout

Flexbox là mô hình bố cục một chiều, giúp sắp xếp phần tử theo hàng hoặc cột.

## Container Properties

\`\`\`css
.flex-container {
  display: flex;
  flex-direction: row;      /* row | column | row-reverse | column-reverse */
  justify-content: center;  /* flex-start | flex-end | center | space-between | space-around | space-evenly */
  align-items: center;      /* flex-start | flex-end | center | stretch | baseline */
  flex-wrap: wrap;           /* nowrap | wrap | wrap-reverse */
  gap: 1rem;
}
\`\`\`

## Item Properties

\`\`\`css
.flex-item {
  flex: 1;              /* flex-grow: 1, flex-shrink: 1, flex-basis: 0% */
  align-self: flex-end; /* Ghi đè align-items cho item cụ thể */
  order: 2;             /* Thay đổi thứ tự hiển thị */
}
\`\`\`

## Ví dụ: Navbar

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}
.navbar .logo { flex-shrink: 0; }
.navbar .links { display: flex; gap: 1.5rem; }
\`\`\`

## Ví dụ: Card Grid

\`\`\`css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.card { flex: 1 1 300px; /* Tối thiểu 300px, co giãn đều */ }
\`\`\``],

['responsive-web-design','11-grid','CSS Grid Layout','Hệ thống lưới hai chiều với CSS Grid','beginner','css',
`# CSS Grid Layout

Grid là mô hình bố cục hai chiều, mạnh mẽ hơn Flexbox cho layout phức tạp.

## Cơ bản

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 cột bằng nhau */
  grid-template-rows: auto;
  gap: 1rem;
}
\`\`\`

## Template Areas

\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 250px 1fr 1fr;
  min-height: 100vh;
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
\`\`\`

## Responsive Grid

\`\`\`css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
\`\`\`

## Flexbox vs Grid
| Tiêu chí | Flexbox | Grid |
|----------|---------|------|
| Chiều | 1 chiều | 2 chiều |
| Dùng cho | Components | Page layout |
| Kiểm soát | Nội dung quyết định | Layout quyết định |`],

['responsive-web-design','12-responsive-practice','Thực hành: Responsive Layout','Bài tập xây dựng layout responsive','beginner','css',
`# Thực hành: Responsive Layout

## Bài tập
Xây dựng layout responsive với Media Queries, Flexbox và Grid.

\`\`\`css
/* Mobile first approach */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Card grid - responsive */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .page-layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
  }
}

/* Responsive typography */
html { font-size: 14px; }
@media (min-width: 768px) { html { font-size: 16px; } }
@media (min-width: 1200px) { html { font-size: 18px; } }

/* Modern: clamp() */
h1 { font-size: clamp(1.5rem, 4vw, 3rem); }
\`\`\``],
];

// Generate MDX files
let count = 0;
for (const [folder, file, title, desc, diff, lang, body] of L) {
  const dir = p.join(contentDir, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const frontmatter = `---\ntitle: "${title}"\ndescription: "${desc}"\ndifficulty: "${diff}"\nlanguage: "${lang}"\n---\n\n`;
  fs.writeFileSync(p.join(dir, `${file}.mdx`), frontmatter + body + '\n');
  count++;
}
console.log(`✅ Tạo ${count} MDX files trong ${contentDir}`);

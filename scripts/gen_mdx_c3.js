const fs=require('fs'),p=require('path');
const contentDir=p.join(__dirname,'..','content');
const L=[
// === COURSE 3: FRONTEND LIBRARIES ===
['frontend-libraries','01-bootstrap-grid','Bootstrap Grid & Components','Hệ thống lưới và components Bootstrap','intermediate','html',
`# Bootstrap Grid & Components

## Cài đặt
\`\`\`html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
\`\`\`

## Grid System (12 cột)
\`\`\`html
<div class="container">
  <div class="row">
    <div class="col-md-8">Nội dung chính (8/12)</div>
    <div class="col-md-4">Sidebar (4/12)</div>
  </div>
  <div class="row">
    <div class="col-sm-6 col-lg-3">Card 1</div>
    <div class="col-sm-6 col-lg-3">Card 2</div>
    <div class="col-sm-6 col-lg-3">Card 3</div>
    <div class="col-sm-6 col-lg-3">Card 4</div>
  </div>
</div>
\`\`\`

## Breakpoints
| Class | Màn hình | Pixels |
|-------|---------|--------|
| \`col-sm-\` | Small | ≥576px |
| \`col-md-\` | Medium | ≥768px |
| \`col-lg-\` | Large | ≥992px |
| \`col-xl-\` | Extra large | ≥1200px |

## Components phổ biến
\`\`\`html
<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <a class="navbar-brand" href="#">Logo</a>
    <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">☰</button>
    <div class="collapse navbar-collapse" id="nav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="#">Trang chủ</a></li>
      </ul>
    </div>
  </div>
</nav>

<!-- Card -->
<div class="card">
  <div class="card-body">
    <h5 class="card-title">Tiêu đề</h5>
    <p class="card-text">Nội dung</p>
    <a href="#" class="btn btn-primary">Chi tiết</a>
  </div>
</div>

<!-- Modal -->
<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal">Mở</button>
<div class="modal fade" id="myModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header"><h5>Tiêu đề</h5></div>
      <div class="modal-body">Nội dung</div>
    </div>
  </div>
</div>
\`\`\``],

['frontend-libraries','02-jquery-dom','jQuery DOM Manipulation','Thao tác DOM với jQuery','intermediate','javascript',
`# jQuery DOM Manipulation

## Selectors & DOM
\`\`\`javascript
// Chọn phần tử
$("h1")              // Theo tag
$(".card")           // Theo class
$("#header")         // Theo id
$("ul > li:first")   // CSS selector

// Thay đổi nội dung
$("h1").text("Tiêu đề mới");
$(".content").html("<p>HTML mới</p>");
$("input").val("Giá trị mới");

// CSS & Class
$(".box").css("color", "red");
$(".box").css({ color: "red", fontSize: "1.2rem" });
$(".btn").addClass("active");
$(".btn").removeClass("active");
$(".btn").toggleClass("active");

// Attributes
$("img").attr("src", "new.jpg");
$("input").prop("disabled", true);
\`\`\`

## Tạo & Xóa phần tử
\`\`\`javascript
$("ul").append("<li>Mục mới cuối</li>");
$("ul").prepend("<li>Mục mới đầu</li>");
$("<div class='alert'>Thông báo</div>").insertAfter("#content");
$(".old-item").remove();
$(".container").empty(); // Xóa nội dung con
\`\`\`

## Animation
\`\`\`javascript
$(".box").fadeIn(400);
$(".box").fadeOut(400);
$(".panel").slideDown(300);
$(".panel").slideUp(300);
$(".element").animate({ opacity: 0.5, left: "200px" }, 500);
\`\`\`

> **Lưu ý**: jQuery đang ít được dùng trong dự án mới. React/Vue thường thay thế jQuery cho DOM manipulation.`],

['frontend-libraries','03-jquery-events','jQuery Events & AJAX','Xử lý sự kiện và gọi API với jQuery','intermediate','javascript',
`# jQuery Events & AJAX

## Events
\`\`\`javascript
// Click
$(".btn").on("click", function() {
  $(this).toggleClass("active");
});

// Form submit
$("form").on("submit", function(e) {
  e.preventDefault();
  const data = $(this).serialize();
  console.log(data);
});

// Keyboard
$(document).on("keydown", function(e) {
  if (e.key === "Escape") $(".modal").fadeOut();
});

// Event delegation (cho phần tử động)
$("ul").on("click", "li", function() {
  $(this).toggleClass("done");
});
\`\`\`

## AJAX
\`\`\`javascript
// GET request
$.get("/api/users", function(data) {
  data.forEach(user => {
    $("ul").append(\`<li>\${user.name}</li>\`);
  });
});

// POST request
$.ajax({
  url: "/api/users",
  method: "POST",
  contentType: "application/json",
  data: JSON.stringify({ name: "An", email: "an@mail.com" }),
  success: (res) => console.log("Thành công:", res),
  error: (err) => console.error("Lỗi:", err)
});

// Modern: fetch API (không cần jQuery)
const res = await fetch("/api/users");
const users = await res.json();
\`\`\``],

['frontend-libraries','04-sass-basics','Sass Variables, Nesting & Mixins','Cơ bản Sass/SCSS','intermediate','scss',
`# Sass Variables, Nesting & Mixins

Sass (SCSS) mở rộng CSS với biến, nesting, mixins và nhiều tính năng mạnh mẽ.

## Variables — Biến
\`\`\`scss
$primary: #3498db;
$secondary: #2ecc71;
$font-stack: 'Inter', sans-serif;
$spacing: 1rem;
$border-radius: 8px;

body {
  font-family: $font-stack;
  color: #333;
}
.btn-primary {
  background: $primary;
  padding: $spacing;
  border-radius: $border-radius;
}
\`\`\`

## Nesting — Lồng nhau
\`\`\`scss
.navbar {
  display: flex;
  padding: 1rem 2rem;

  .logo {
    font-weight: bold;
  }
  .nav-links {
    display: flex;
    gap: 1rem;

    a {
      text-decoration: none;
      &:hover { color: $primary; }    // & = parent selector
      &.active { font-weight: bold; }
    }
  }
}
\`\`\`

## Mixins — Tái sử dụng
\`\`\`scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin responsive($bp) {
  @if $bp == tablet { @media (min-width: 768px) { @content; } }
  @if $bp == desktop { @media (min-width: 1024px) { @content; } }
}

.hero {
  @include flex-center;
  min-height: 100vh;

  @include responsive(tablet) {
    flex-direction: row;
  }
}
\`\`\``],

['frontend-libraries','05-sass-advanced','Functions, Operators & Partials','Sass nâng cao: functions, imports, architecture','intermediate','scss',
`# Sass Nâng Cao

## Functions
\`\`\`scss
@function rem($px) {
  @return calc($px / 16) * 1rem;
}

@function lighten-color($color, $amount) {
  @return lighten($color, $amount);
}

h1 { font-size: rem(32); } // 2rem
.box { background: lighten-color(#3498db, 20%); }
\`\`\`

## Operators
\`\`\`scss
.container { width: 100% - 2rem; }
.col-half { width: calc(50% - 1rem); }
\`\`\`

## Partials & Imports
\`\`\`
styles/
├── _variables.scss
├── _mixins.scss
├── _reset.scss
├── _components.scss
└── main.scss
\`\`\`
\`\`\`scss
// main.scss
@use 'variables' as v;
@use 'mixins' as m;
@use 'reset';
@use 'components';

body { font-family: v.$font-stack; }
.card { @include m.flex-center; }
\`\`\`

## Loops & Conditions
\`\`\`scss
@for $i from 1 through 6 {
  .mt-#{$i} { margin-top: $i * 0.25rem; }
}

$colors: (primary: #3498db, danger: #e74c3c, success: #2ecc71);
@each $name, $color in $colors {
  .text-#{$name} { color: $color; }
  .bg-#{$name} { background-color: $color; }
}
\`\`\``],

['frontend-libraries','06-sass-practice','Thực hành: Sass Project','Bài tập xây dựng design system với Sass','intermediate','scss',
`# Thực hành: Sass Project

## Bài tập: Tạo Design System
\`\`\`scss
// _variables.scss
$colors: (
  primary: #667eea, secondary: #764ba2,
  success: #2ecc71, danger: #e74c3c,
  dark: #2c3e50, light: #ecf0f1
);
$font-sizes: (sm: 0.875rem, base: 1rem, lg: 1.25rem, xl: 1.5rem, xxl: 2rem);
$spacing: (1: 0.25rem, 2: 0.5rem, 3: 1rem, 4: 1.5rem, 5: 2rem);

// _mixins.scss
@mixin button-variant($bg) {
  background: $bg;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
}

// _components.scss
@each $name, $color in $colors {
  .btn-#{$name} { @include button-variant($color); }
}

.card {
  background: white;
  border-radius: 12px;
  padding: map-get($spacing, 4);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  &:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
}

// Utility classes
@each $key, $val in $spacing {
  .p-#{$key} { padding: $val; }
  .m-#{$key} { margin: $val; }
}
\`\`\``],

['frontend-libraries','07-react-components','Components, JSX & Props','Tạo React components với JSX và Props','intermediate','jsx',
`# React Components, JSX & Props

## JSX — JavaScript XML
\`\`\`jsx
const element = <h1 className="title">Xin chào React!</h1>;

// JSX cho phép viết HTML trong JavaScript
const greeting = (
  <div>
    <h1>Xin chào</h1>
    <p>Chào mừng đến với React</p>
  </div>
);
\`\`\`

## Function Components
\`\`\`jsx
// Cách hiện đại để tạo component
function Welcome({ name, role = "student" }) {
  return (
    <div className="welcome">
      <h2>Xin chào, {name}!</h2>
      <p>Vai trò: {role}</p>
    </div>
  );
}

// Arrow function
const Card = ({ title, children }) => (
  <div className="card">
    <h3>{title}</h3>
    <div className="card-body">{children}</div>
  </div>
);
\`\`\`

## Props — Truyền dữ liệu
\`\`\`jsx
// Parent → Child qua props
function App() {
  const courses = ["HTML", "CSS", "JavaScript"];
  return (
    <div>
      <Welcome name="An" role="admin" />
      <CourseList items={courses} />
    </div>
  );
}

function CourseList({ items }) {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
\`\`\`

## Conditional Rendering
\`\`\`jsx
function Status({ isOnline }) {
  return isOnline ? <span className="online">🟢 Online</span> : <span>⚫ Offline</span>;
}
\`\`\``],

['frontend-libraries','08-react-state','State & Lifecycle Hooks','useState, useEffect và các Hooks cơ bản','intermediate','jsx',
`# State & Lifecycle Hooks

## useState
\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Đếm: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(prev => prev - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
\`\`\`

## useEffect
\`\`\`jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => { setUser(data); setLoading(false); });

    return () => console.log("Cleanup khi unmount hoặc userId thay đổi");
  }, [userId]); // Dependency array

  if (loading) return <p>Đang tải...</p>;
  return <h2>{user.name}</h2>;
}
\`\`\`

## Custom Hook
\`\`\`jsx
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Sử dụng
const [theme, setTheme] = useLocalStorage("theme", "dark");
\`\`\``],

['frontend-libraries','09-react-practice','Thực hành: React App','Bài tập xây dựng ứng dụng React','intermediate','jsx',
`# Thực hành: React Todo App

\`\`\`jsx
import { useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, done: false }]);
    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="todo-app">
      <h1>📝 Danh sách việc cần làm</h1>
      <div className="input-group">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTodo()}
          placeholder="Thêm việc mới..."
        />
        <button onClick={addTodo}>Thêm</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} className={todo.done ? "done" : ""}>
            <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
          </li>
        ))}
      </ul>
      <p>{todos.filter(t => !t.done).length} việc còn lại</p>
    </div>
  );
}
\`\`\``],

['frontend-libraries','10-redux-basics','Store, Actions & Reducers','Quản lý state toàn cục với Redux','intermediate','javascript',
`# Redux: Store, Actions & Reducers

## Nguyên tắc Redux
1. **Single source of truth**: Toàn bộ state trong 1 store
2. **State is read-only**: Chỉ thay đổi qua actions
3. **Pure reducers**: Reducer là pure functions

## Actions
\`\`\`javascript
// Action types
const ADD_TODO = "ADD_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";

// Action creators
const addTodo = (text) => ({ type: ADD_TODO, payload: { id: Date.now(), text, done: false } });
const toggleTodo = (id) => ({ type: TOGGLE_TODO, payload: id });
\`\`\`

## Reducer
\`\`\`javascript
const initialState = { todos: [], filter: "all" };

function todoReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return { ...state, todos: [...state.todos, action.payload] };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        )
      };
    default:
      return state;
  }
}
\`\`\`

## Store
\`\`\`javascript
import { createStore } from 'redux';
const store = createStore(todoReducer);

store.subscribe(() => console.log(store.getState()));
store.dispatch(addTodo("Học Redux"));
store.dispatch(toggleTodo(1));
\`\`\``],

['frontend-libraries','11-redux-react','React-Redux Integration','Kết nối Redux với React','intermediate','jsx',
`# React-Redux Integration

## Setup
\`\`\`jsx
// store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => { state.push(action.payload); },
    toggleTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) todo.done = !todo.done;
    },
    removeTodo: (state, action) => state.filter(t => t.id !== action.payload),
  }
});

export const { addTodo, toggleTodo, removeTodo } = todoSlice.actions;
export const store = configureStore({ reducer: { todos: todoSlice.reducer } });
\`\`\`

## Provider & Hooks
\`\`\`jsx
// App.jsx
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, addTodo, toggleTodo } from './store';

function TodoList() {
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();

  return (
    <ul>
      {todos.map(t => (
        <li key={t.id} onClick={() => dispatch(toggleTodo(t.id))}>
          {t.done ? "✅" : "⬜"} {t.text}
        </li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <Provider store={store}>
      <TodoList />
    </Provider>
  );
}
\`\`\`

## Redux Toolkit > Redux cổ điển
- \`createSlice\`: tự tạo action creators + reducer
- \`configureStore\`: tự thêm middleware
- Có thể "mutate" state (dùng Immer bên trong)`],

['frontend-libraries','12-redux-practice','Thực hành: Redux App','Bài tập quản lý state với Redux Toolkit','intermediate','jsx',
`# Thực hành: Redux Shopping Cart

\`\`\`jsx
// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0 },
  reducers: {
    addItem: (state, action) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) existing.qty += 1;
      else state.items.push({ ...action.payload, qty: 1 });
      state.total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      state.total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    },
    clearCart: (state) => { state.items = []; state.total = 0; },
  }
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
\`\`\`

## Thử thách
1. Thêm tính năng tăng/giảm số lượng
2. Lưu cart vào localStorage
3. Thêm async thunk để fetch sản phẩm từ API`],
];

let c=0;
for(const[folder,file,title,desc,diff,lang,body]of L){
  const dir=p.join(contentDir,folder);
  if(!fs.existsSync(dir))fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(p.join(dir,`${file}.mdx`),`---\ntitle: "${title}"\ndescription: "${desc}"\ndifficulty: "${diff}"\nlanguage: "${lang}"\n---\n\n${body}\n`);
  c++;
}
console.log(`✅ Tạo ${c} MDX files (Frontend Libraries) trong ${contentDir}`);

const fs=require('fs'),p=require('path');
const contentDir=p.join(__dirname,'..','content');
const L=[
// === COURSE 2: JAVASCRIPT ===
['javascript-fcc','01-js-variables','Biến, Kiểu dữ liệu & Operators','Khai báo biến, các kiểu dữ liệu và toán tử trong JavaScript','beginner','javascript',
`# Biến, Kiểu dữ liệu & Operators

## Khai báo biến

\`\`\`javascript
var oldWay = "ES5";       // Function scope, tránh dùng
let name = "An";          // Block scope, có thể gán lại
const PI = 3.14159;       // Block scope, không thể gán lại
\`\`\`

## Kiểu dữ liệu (Data Types)

| Kiểu | Ví dụ | typeof |
|------|-------|--------|
| String | \`"Hello"\` | \`"string"\` |
| Number | \`42\`, \`3.14\` | \`"number"\` |
| Boolean | \`true\`, \`false\` | \`"boolean"\` |
| Undefined | \`undefined\` | \`"undefined"\` |
| Null | \`null\` | \`"object"\` (bug lịch sử) |
| BigInt | \`9007199254740991n\` | \`"bigint"\` |
| Symbol | \`Symbol("id")\` | \`"symbol"\` |
| Object | \`{}\`, \`[]\` | \`"object"\` |

## Operators — Toán tử

\`\`\`javascript
// Arithmetic: +, -, *, /, %, **
console.log(2 ** 3);  // 8

// So sánh: dùng === thay vì ==
console.log(5 === "5");  // false (strict)
console.log(5 == "5");   // true (loose, tránh dùng)

// Logic: &&, ||, !
const canDrive = age >= 18 && hasLicense;

// Nullish coalescing
const name = user.name ?? "Ẩn danh";

// Optional chaining
const city = user?.address?.city;
\`\`\`

## Ép kiểu (Type Coercion)
\`\`\`javascript
String(42)       // "42"
Number("42")     // 42
Boolean("")      // false
Boolean("hello") // true
\`\`\``],

['javascript-fcc','02-js-conditions','Điều kiện & Vòng lặp','if/else, switch, for, while và các cấu trúc điều khiển','beginner','javascript',
`# Điều kiện & Vòng lặp

## If / Else

\`\`\`javascript
const score = 85;

if (score >= 90) {
  console.log("Xuất sắc");
} else if (score >= 70) {
  console.log("Khá");
} else {
  console.log("Cần cố gắng");
}

// Ternary operator
const result = score >= 50 ? "Đậu" : "Trượt";
\`\`\`

## Switch

\`\`\`javascript
const day = "T2";
switch (day) {
  case "T2": case "T3": case "T4": case "T5": case "T6":
    console.log("Ngày làm việc");
    break;
  case "T7": case "CN":
    console.log("Cuối tuần");
    break;
  default:
    console.log("Không hợp lệ");
}
\`\`\`

## Vòng lặp

\`\`\`javascript
// for
for (let i = 0; i < 5; i++) { console.log(i); }

// for...of (duyệt giá trị)
for (const item of ["An", "Bình", "Chi"]) { console.log(item); }

// for...in (duyệt key)
for (const key in { name: "An", age: 20 }) { console.log(key); }

// while
let count = 0;
while (count < 3) { console.log(count++); }

// do...while (chạy ít nhất 1 lần)
do { console.log("Chạy!"); } while (false);
\`\`\``],

['javascript-fcc','03-js-basic-practice','Thực hành: Logic cơ bản','Bài tập về biến, điều kiện và vòng lặp','beginner','javascript',
`# Thực hành: Logic Cơ Bản

## Bài 1: FizzBuzz
\`\`\`javascript
for (let i = 1; i <= 100; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}
\`\`\`

## Bài 2: Tìm số lớn nhất
\`\`\`javascript
function findMax(arr) {
  let max = arr[0];
  for (const num of arr) {
    if (num > max) max = num;
  }
  return max;
}
console.log(findMax([3, 7, 2, 9, 1])); // 9
\`\`\`

## Bài 3: Đếm ký tự
\`\`\`javascript
function countChars(str) {
  const result = {};
  for (const char of str.toLowerCase()) {
    if (char !== " ") {
      result[char] = (result[char] || 0) + 1;
    }
  }
  return result;
}
console.log(countChars("hello")); // { h:1, e:1, l:2, o:1 }
\`\`\`

## Thử thách
1. Viết hàm kiểm tra số nguyên tố
2. Viết hàm đảo ngược chuỗi mà không dùng \`.reverse()\`
3. Viết hàm tìm số Fibonacci thứ n`],

['javascript-fcc','04-es6-basics','let/const, Arrow Functions & Template Literals','Cú pháp hiện đại ES6+','beginner','javascript',
`# ES6+ Cơ bản

## let & const
\`\`\`javascript
// Block scope
if (true) {
  let x = 10;
  const y = 20;
}
// x và y không tồn tại ở đây

// const với objects — có thể thay đổi thuộc tính
const user = { name: "An" };
user.name = "Bình"; // ✅ OK
// user = {};       // ❌ Error
\`\`\`

## Arrow Functions
\`\`\`javascript
// Cú pháp ngắn gọn
const add = (a, b) => a + b;
const square = x => x * x;
const greet = () => "Xin chào!";

// Multi-line
const processUser = (user) => {
  const name = user.name.toUpperCase();
  return \`Chào \${name}\`;
};

// ⚠️ Arrow function không có this riêng
const obj = {
  name: "An",
  greet: function() { return this.name; },  // ✅ "An"
  greetArrow: () => this.name,              // ❌ undefined
};
\`\`\`

## Template Literals
\`\`\`javascript
const name = "An";
const age = 20;

// String interpolation
const msg = \`Xin chào, \${name}! Bạn \${age} tuổi.\`;

// Multi-line
const html = \`
  <div class="card">
    <h2>\${name}</h2>
    <p>Tuổi: \${age}</p>
  </div>
\`;

// Tagged templates
const highlight = (strings, ...values) =>
  strings.reduce((r, s, i) => \`\${r}\${s}<b>\${values[i]||''}</b>\`, '');
\`\`\``],

['javascript-fcc','05-es6-destructuring','Destructuring, Spread & Rest','Trích xuất dữ liệu và toán tử spread/rest','beginner','javascript',
`# Destructuring, Spread & Rest

## Object Destructuring
\`\`\`javascript
const user = { name: "An", age: 20, city: "HCM" };

const { name, age, city } = user;
const { name: userName, age: userAge } = user; // Đổi tên
const { name, ...rest } = user; // rest = { age: 20, city: "HCM" }

// Default values
const { role = "student" } = user;

// Nested
const { address: { street } = {} } = user;
\`\`\`

## Array Destructuring
\`\`\`javascript
const [first, second, ...others] = [1, 2, 3, 4, 5];
// first=1, second=2, others=[3,4,5]

// Swap
let a = 1, b = 2;
[a, b] = [b, a]; // a=2, b=1

// Skip
const [, , third] = [1, 2, 3]; // third=3
\`\`\`

## Spread Operator (...)
\`\`\`javascript
// Clone array
const copy = [...original];

// Merge arrays
const merged = [...arr1, ...arr2];

// Clone object
const newUser = { ...user, role: "admin" };

// Function args
Math.max(...[1, 5, 3]); // 5
\`\`\`

## Rest Parameters
\`\`\`javascript
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4); // 10
\`\`\``],

['javascript-fcc','06-es6-async','Promises & Async/Await','Xử lý bất đồng bộ trong JavaScript','beginner','javascript',
`# Promises & Async/Await

## Callback (cách cũ)
\`\`\`javascript
// Callback hell
getData(function(a) {
  getMoreData(a, function(b) {
    getEvenMore(b, function(c) {
      console.log(c); // 😵 Pyramid of doom
    });
  });
});
\`\`\`

## Promises
\`\`\`javascript
const fetchUser = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ id, name: "An" });
      else reject(new Error("ID không hợp lệ"));
    }, 1000);
  });
};

fetchUser(1)
  .then(user => console.log(user))
  .catch(err => console.error(err))
  .finally(() => console.log("Xong!"));

// Promise.all — chờ tất cả
const [user, posts] = await Promise.all([
  fetchUser(1), fetchPosts(1)
]);
\`\`\`

## Async/Await
\`\`\`javascript
async function loadData() {
  try {
    const response = await fetch("/api/users");
    const users = await response.json();
    return users;
  } catch (error) {
    console.error("Lỗi:", error.message);
  }
}
\`\`\`

## Điểm chính
- \`async\` function luôn trả về Promise
- \`await\` chỉ dùng trong \`async\` function
- Luôn bọc \`try/catch\` cho error handling`],

['javascript-fcc','07-js-arrays','Arrays & Array Methods','Mảng và các phương thức xử lý mảng','beginner','javascript',
`# Arrays & Array Methods

## Tạo mảng
\`\`\`javascript
const fruits = ["Táo", "Cam", "Xoài"];
const numbers = Array.from({ length: 5 }, (_, i) => i + 1); // [1,2,3,4,5]
\`\`\`

## Phương thức biến đổi (Mutating)
\`\`\`javascript
fruits.push("Dưa");      // Thêm cuối
fruits.pop();             // Xóa cuối
fruits.unshift("Lê");    // Thêm đầu
fruits.shift();           // Xóa đầu
fruits.splice(1, 1);      // Xóa 1 phần tử tại index 1
\`\`\`

## Phương thức không biến đổi (Non-mutating)
\`\`\`javascript
const nums = [1, 2, 3, 4, 5];

// map — biến đổi từng phần tử
const doubled = nums.map(n => n * 2); // [2,4,6,8,10]

// filter — lọc
const evens = nums.filter(n => n % 2 === 0); // [2,4]

// reduce — gộp
const sum = nums.reduce((acc, n) => acc + n, 0); // 15

// find / findIndex
const found = nums.find(n => n > 3); // 4

// some / every
nums.some(n => n > 4);  // true
nums.every(n => n > 0); // true

// flat / flatMap
[[1,2],[3,4]].flat(); // [1,2,3,4]

// slice
nums.slice(1, 3); // [2, 3]
\`\`\`

## Method Chaining
\`\`\`javascript
const result = users
  .filter(u => u.active)
  .map(u => u.name)
  .sort();
\`\`\``],

['javascript-fcc','08-js-objects','Objects & JSON','Object, prototype và JSON','beginner','javascript',
`# Objects & JSON

## Tạo Object
\`\`\`javascript
const student = {
  name: "An",
  age: 20,
  grades: [9, 8, 7],
  getAverage() {
    return this.grades.reduce((a, b) => a + b) / this.grades.length;
  }
};

// Truy cập
console.log(student.name);       // "An"
console.log(student["age"]);     // 20

// Computed property
const key = "email";
const obj = { [key]: "an@mail.com" };
\`\`\`

## Object Methods
\`\`\`javascript
Object.keys(student);    // ["name", "age", "grades", "getAverage"]
Object.values(student);  // ["An", 20, [9,8,7], ƒ]
Object.entries(student);  // [["name","An"], ...]

// Merge
const merged = Object.assign({}, defaults, overrides);
// Hoặc: const merged = { ...defaults, ...overrides };

// Freeze (không thể thay đổi)
Object.freeze(config);
\`\`\`

## JSON
\`\`\`javascript
const json = JSON.stringify(student, null, 2);
const parsed = JSON.parse(json);

// Deep clone (đơn giản)
const clone = JSON.parse(JSON.stringify(original));

// Modern deep clone
const clone2 = structuredClone(original);
\`\`\``],

['javascript-fcc','09-js-map-set','Map, Set & Iterators','Cấu trúc dữ liệu Map, Set và Iterator protocol','beginner','javascript',
`# Map, Set & Iterators

## Map — Bảng ánh xạ key-value
\`\`\`javascript
const userRoles = new Map();
userRoles.set("an@mail.com", "admin");
userRoles.set("binh@mail.com", "editor");

console.log(userRoles.get("an@mail.com")); // "admin"
console.log(userRoles.has("an@mail.com")); // true
console.log(userRoles.size); // 2

// Duyệt
for (const [email, role] of userRoles) {
  console.log(\`\${email}: \${role}\`);
}
\`\`\`

## Set — Tập hợp giá trị duy nhất
\`\`\`javascript
const uniqueNums = new Set([1, 2, 2, 3, 3, 3]);
console.log(uniqueNums); // Set {1, 2, 3}

uniqueNums.add(4);
uniqueNums.delete(1);
uniqueNums.has(2); // true

// Loại bỏ trùng lặp trong array
const unique = [...new Set(array)];
\`\`\`

## Iterator Protocol
\`\`\`javascript
// Tạo iterable tùy chỉnh
const range = {
  from: 1, to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    return {
      next: () => current <= this.to
        ? { value: current++, done: false }
        : { done: true }
    };
  }
};

for (const n of range) console.log(n); // 1, 2, 3, 4, 5
\`\`\``],

['javascript-fcc','10-algo-string','Thuật toán xử lý chuỗi','Các thuật toán phổ biến với string','beginner','javascript',
`# Thuật toán xử lý chuỗi

## Đảo ngược chuỗi
\`\`\`javascript
const reverse = str => [...str].reverse().join("");
reverse("hello"); // "olleh"
\`\`\`

## Kiểm tra Palindrome
\`\`\`javascript
function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return clean === [...clean].reverse().join("");
}
isPalindrome("A man, a plan, a canal: Panama"); // true
\`\`\`

## Đếm từ
\`\`\`javascript
const wordCount = str => str.trim().split(/\\s+/).length;
wordCount("Xin chào các bạn"); // 4
\`\`\`

## Title Case
\`\`\`javascript
function titleCase(str) {
  return str.toLowerCase()
    .split(" ")
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
titleCase("xin chào thế giới"); // "Xin Chào Thế Giới"
\`\`\`

## Caesar Cipher
\`\`\`javascript
function caesarCipher(str, shift) {
  return str.replace(/[a-z]/gi, char => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
  });
}
caesarCipher("HELLO", 3); // "KHOOR"
\`\`\``],

['javascript-fcc','11-algo-sort','Sắp xếp & Tìm kiếm','Thuật toán sorting và searching cơ bản','beginner','javascript',
`# Sắp xếp & Tìm kiếm

## Bubble Sort
\`\`\`javascript
function bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j+1]) [a[j], a[j+1]] = [a[j+1], a[j]];
    }
  }
  return a;
}
\`\`\`

## Quick Sort
\`\`\`javascript
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = arr.filter(x => x < pivot);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}
\`\`\`

## Binary Search
\`\`\`javascript
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
binarySearch([1,3,5,7,9], 7); // 3
\`\`\`

## Độ phức tạp (Big O)
| Thuật toán | Trung bình | Tệ nhất |
|-----------|-----------|---------|
| Bubble Sort | O(n²) | O(n²) |
| Quick Sort | O(n log n) | O(n²) |
| Binary Search | O(log n) | O(log n) |`],

['javascript-fcc','12-algo-practice','Thực hành: Giải thuật toán','Bài tập thuật toán JavaScript','beginner','javascript',
`# Thực hành: Giải Thuật Toán

## Bài 1: Tìm phần tử xuất hiện nhiều nhất
\`\`\`javascript
function mostFrequent(arr) {
  const freq = {};
  for (const item of arr) freq[item] = (freq[item] || 0) + 1;
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
}
mostFrequent([1,2,3,2,2,3,1,2]); // "2"
\`\`\`

## Bài 2: Two Sum
\`\`\`javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}
twoSum([2, 7, 11, 15], 9); // [0, 1]
\`\`\`

## Bài 3: Flatten Array
\`\`\`javascript
function flatten(arr) {
  return arr.reduce((flat, item) =>
    flat.concat(Array.isArray(item) ? flatten(item) : item), []);
}
flatten([1, [2, [3, [4]]]]); // [1, 2, 3, 4]
\`\`\`

## Thử thách
1. Viết hàm tìm chuỗi con chung dài nhất (Longest Common Substring)
2. Viết hàm kiểm tra anagram (cùng ký tự khác thứ tự)
3. Viết hàm nén chuỗi: "aaabbc" → "a3b2c1"`],

['javascript-fcc','13-fp-concepts','Khái niệm Functional Programming','Lập trình hàm: Immutability, Pure Functions, Side Effects','beginner','javascript',
`# Functional Programming

Lập trình hàm (FP) là paradigm dựa trên hàm thuần túy, tránh side effects và dữ liệu bất biến.

## Pure Functions — Hàm thuần túy
\`\`\`javascript
// ✅ Pure: cùng input → cùng output, không side effects
const add = (a, b) => a + b;
const toUpper = str => str.toUpperCase();

// ❌ Impure: phụ thuộc hoặc thay đổi state bên ngoài
let count = 0;
const increment = () => ++count;
\`\`\`

## Immutability — Bất biến
\`\`\`javascript
// ❌ Mutating
const addItem = (arr, item) => { arr.push(item); return arr; };

// ✅ Immutable
const addItem = (arr, item) => [...arr, item];
const updateUser = (user, updates) => ({ ...user, ...updates });
\`\`\`

## First-Class Functions
\`\`\`javascript
// Hàm là giá trị — có thể gán, truyền, trả về
const greet = name => \`Xin chào, \${name}!\`;
const process = (fn, value) => fn(value);
process(greet, "An"); // "Xin chào, An!"
\`\`\`

## Tại sao FP?
- **Dễ test**: Pure functions dễ unit test
- **Dễ debug**: Không side effects → ít lỗi
- **Dễ kết hợp**: Compose nhiều hàm nhỏ thành pipeline`],

['javascript-fcc','14-fp-hof','Higher-Order Functions','Hàm bậc cao: map, filter, reduce và ứng dụng','beginner','javascript',
`# Higher-Order Functions

Hàm bậc cao (HOF) là hàm nhận hoặc trả về hàm khác.

## Các HOF phổ biến

\`\`\`javascript
const students = [
  { name: "An", score: 85 },
  { name: "Bình", score: 92 },
  { name: "Chi", score: 68 },
  { name: "Dung", score: 95 },
];

// map: biến đổi
const names = students.map(s => s.name);

// filter: lọc
const topStudents = students.filter(s => s.score >= 90);

// reduce: gộp
const avgScore = students.reduce((sum, s) => sum + s.score, 0) / students.length;

// sort: sắp xếp (immutable)
const sorted = [...students].sort((a, b) => b.score - a.score);

// Chaining
const topNames = students
  .filter(s => s.score >= 80)
  .sort((a, b) => b.score - a.score)
  .map(s => s.name);
// ["Dung", "Bình", "An"]
\`\`\`

## Tạo HOF riêng
\`\`\`javascript
// Function factory
const multiplyBy = factor => num => num * factor;
const double = multiplyBy(2);
const triple = multiplyBy(3);
double(5); // 10
triple(5); // 15

// Memoize
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}
\`\`\``],

['javascript-fcc','15-fp-practice','Thực hành: Composition & Currying','Bài tập kết hợp hàm và currying','beginner','javascript',
`# Thực hành: Composition & Currying

## Function Composition
\`\`\`javascript
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const processName = pipe(
  str => str.trim(),
  str => str.toLowerCase(),
  str => str.split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")
);
processName("  nguyễn văn an  "); // "Nguyễn Văn An"
\`\`\`

## Currying
\`\`\`javascript
// Chuyển hàm nhiều tham số thành chuỗi hàm 1 tham số
const curry = fn => {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
};

const add = curry((a, b, c) => a + b + c);
add(1)(2)(3);    // 6
add(1, 2)(3);    // 6
add(1)(2, 3);    // 6
\`\`\`

## Bài tập: Data Pipeline
\`\`\`javascript
const users = [
  { name: "An", age: 20, active: true },
  { name: "Bình", age: 17, active: true },
  { name: "Chi", age: 22, active: false },
];

const getActiveAdults = pipe(
  users => users.filter(u => u.active),
  users => users.filter(u => u.age >= 18),
  users => users.map(u => u.name)
);
getActiveAdults(users); // ["An"]
\`\`\``],
];

let c=0;
for(const[folder,file,title,desc,diff,lang,body]of L){
  const dir=p.join(contentDir,folder);
  if(!fs.existsSync(dir))fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(p.join(dir,`${file}.mdx`),`---\ntitle: "${title}"\ndescription: "${desc}"\ndifficulty: "${diff}"\nlanguage: "${lang}"\n---\n\n${body}\n`);
  c++;
}
console.log(`✅ Tạo ${c} MDX files (JavaScript) trong ${contentDir}`);

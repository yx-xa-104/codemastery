const fs=require('fs'),p=require('path');
const contentDir=p.join(__dirname,'..','content');
const L=[
// === COURSE 4: PYTHON ===
['python-fcc','01-py-basics','Biến, Kiểu dữ liệu & I/O','Cơ bản Python: biến, types, input/output','beginner','python',
`# Biến, Kiểu dữ liệu & I/O

## Biến (Variables)
\`\`\`python
name = "An"           # str
age = 20              # int
height = 1.75         # float
is_student = True     # bool
courses = ["HTML", "CSS"]  # list

# Nhiều biến cùng lúc
x, y, z = 1, 2, 3

# Type checking
print(type(name))  # <class 'str'>
\`\`\`

## Kiểu dữ liệu
| Kiểu | Ví dụ | Mutable? |
|------|-------|----------|
| \`int\` | \`42\` | Không |
| \`float\` | \`3.14\` | Không |
| \`str\` | \`"hello"\` | Không |
| \`bool\` | \`True/False\` | Không |
| \`list\` | \`[1, 2, 3]\` | Có |
| \`tuple\` | \`(1, 2, 3)\` | Không |
| \`dict\` | \`{"a": 1}\` | Có |
| \`set\` | \`{1, 2, 3}\` | Có |

## String Operations
\`\`\`python
s = "Xin chào Python"
s.upper()         # "XIN CHÀO PYTHON"
s.lower()         # "xin chào python"
s.split(" ")      # ["Xin", "chào", "Python"]
s.replace("Python", "World")
f"Tên: {name}, Tuổi: {age}"  # f-string
\`\`\`

## Input/Output
\`\`\`python
name = input("Nhập tên: ")
age = int(input("Nhập tuổi: "))
print(f"Xin chào {name}, bạn {age} tuổi!")
\`\`\``],

['python-fcc','02-py-conditions','Điều kiện & Vòng lặp','if/elif/else, for, while trong Python','beginner','python',
`# Điều kiện & Vòng lặp

## if / elif / else
\`\`\`python
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

# Ternary
result = "Đậu" if score >= 50 else "Trượt"

# Match-case (Python 3.10+)
match command:
    case "start": print("Bắt đầu")
    case "stop": print("Dừng")
    case _: print("Không rõ")
\`\`\`

## for loop
\`\`\`python
# Range
for i in range(5):        # 0,1,2,3,4
    print(i)
for i in range(1, 10, 2): # 1,3,5,7,9
    print(i)

# Iterate
fruits = ["Táo", "Cam", "Xoài"]
for fruit in fruits:
    print(fruit)

# enumerate
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")
\`\`\`

## while loop
\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1

# break & continue
for n in range(100):
    if n % 2 == 0: continue  # Bỏ qua số chẵn
    if n > 10: break          # Dừng khi > 10
    print(n)
\`\`\``],

['python-fcc','03-py-functions','Hàm & Lambda','Định nghĩa hàm, parameters, lambda expressions','beginner','python',
`# Hàm & Lambda

## Định nghĩa hàm
\`\`\`python
def greet(name, greeting="Xin chào"):
    """Hàm chào - docstring"""
    return f"{greeting}, {name}!"

print(greet("An"))             # "Xin chào, An!"
print(greet("An", "Hello"))    # "Hello, An!"
\`\`\`

## *args & **kwargs
\`\`\`python
def sum_all(*args):
    return sum(args)
sum_all(1, 2, 3, 4)  # 10

def create_user(**kwargs):
    return kwargs
create_user(name="An", age=20)  # {"name": "An", "age": 20}
\`\`\`

## Lambda
\`\`\`python
square = lambda x: x ** 2
add = lambda a, b: a + b

# Dùng với sorted, map, filter
students = [("An", 85), ("Bình", 92), ("Chi", 78)]
sorted(students, key=lambda s: s[1], reverse=True)

numbers = [1, 2, 3, 4, 5]
evens = list(filter(lambda x: x % 2 == 0, numbers))
doubled = list(map(lambda x: x * 2, numbers))
\`\`\`

## Type Hints (khuyên dùng)
\`\`\`python
def calculate_area(width: float, height: float) -> float:
    return width * height

def process_items(items: list[str]) -> dict[str, int]:
    return {item: len(item) for item in items}
\`\`\``],

['python-fcc','04-py-lists','Lists & Tuples','Danh sách và bộ giá trị trong Python','beginner','python',
`# Lists & Tuples

## List — Danh sách (mutable)
\`\`\`python
fruits = ["Táo", "Cam", "Xoài"]

# Truy cập
fruits[0]    # "Táo"
fruits[-1]   # "Xoài"
fruits[1:3]  # ["Cam", "Xoài"] - slicing

# Thao tác
fruits.append("Dưa")
fruits.insert(1, "Lê")
fruits.remove("Cam")
popped = fruits.pop()
fruits.sort()
fruits.reverse()

# List methods
len(fruits)           # Độ dài
"Táo" in fruits       # Kiểm tra tồn tại
fruits.index("Xoài") # Vị trí
fruits.count("Táo")   # Đếm
\`\`\`

## Tuple — Bộ giá trị (immutable)
\`\`\`python
point = (10, 20)
rgb = (255, 128, 0)
x, y = point  # Unpacking

# Named tuple
from collections import namedtuple
Student = namedtuple("Student", ["name", "score"])
s = Student("An", 95)
print(s.name)  # "An"
\`\`\`

## List Comprehension
\`\`\`python
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
matrix = [[i*j for j in range(5)] for i in range(5)]

# Với điều kiện
grades = [90, 65, 78, 92, 55]
passed = [g for g in grades if g >= 70]
labels = ["Đậu" if g >= 50 else "Trượt" for g in grades]
\`\`\``],

['python-fcc','05-py-dicts','Dictionaries & Sets','Dict và set: tập hợp dữ liệu trong Python','beginner','python',
`# Dictionaries & Sets

## Dictionary — Từ điển
\`\`\`python
student = {
    "name": "An",
    "age": 20,
    "courses": ["HTML", "Python"]
}

# Truy cập
student["name"]           # "An"
student.get("email", "N/A")  # "N/A" (default nếu không có)

# Thao tác
student["email"] = "an@mail.com"  # Thêm/sửa
del student["age"]                 # Xóa
student.update({"age": 21, "city": "HCM"})

# Duyệt
for key, value in student.items():
    print(f"{key}: {value}")
\`\`\`

## Dict Comprehension
\`\`\`python
squares = {x: x**2 for x in range(6)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

word_count = {}
for word in text.split():
    word_count[word] = word_count.get(word, 0) + 1
\`\`\`

## Set — Tập hợp (giá trị duy nhất)
\`\`\`python
colors = {"đỏ", "xanh", "vàng"}
colors.add("tím")
colors.discard("đỏ")

a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
a | b   # Union:        {1,2,3,4,5,6}
a & b   # Intersection:  {3,4}
a - b   # Difference:    {1,2}
a ^ b   # Symmetric:     {1,2,5,6}

# Loại bỏ trùng lặp
unique = list(set([1, 2, 2, 3, 3, 3]))
\`\`\``],

['python-fcc','06-py-comprehensions','Comprehensions & Generators','List/dict comprehension và generator','beginner','python',
`# Comprehensions & Generators

## Generator — Lười tạo giá trị
\`\`\`python
# Generator expression (tiết kiệm bộ nhớ)
squares_gen = (x**2 for x in range(1000000))
next(squares_gen)  # 0
next(squares_gen)  # 1

# Generator function
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

for num in fibonacci(10):
    print(num)  # 0, 1, 1, 2, 3, 5, 8, 13, 21, 34
\`\`\`

## Bài tập
\`\`\`python
# 1. Lọc số nguyên tố
primes = [n for n in range(2, 100)
          if all(n % i != 0 for i in range(2, int(n**0.5)+1))]

# 2. Đảo dict
original = {"a": 1, "b": 2, "c": 3}
inverted = {v: k for k, v in original.items()}

# 3. Flatten nested list
nested = [[1,2], [3,4], [5,6]]
flat = [x for sublist in nested for x in sublist]

# 4. Word frequency
text = "python là ngôn ngữ python rất hay"
freq = {w: text.split().count(w) for w in set(text.split())}
\`\`\``],

['python-fcc','07-py-classes','Classes & Objects','Lập trình hướng đối tượng: class, object, methods','beginner','python',
`# Classes & Objects

## Tạo Class
\`\`\`python
class Student:
    school = "CodeMastery"  # Class attribute

    def __init__(self, name, age):
        self.name = name    # Instance attribute
        self.age = age
        self._score = 0     # Private (convention)

    def greet(self):
        return f"Xin chào, tôi là {self.name}, {self.age} tuổi"

    @property
    def score(self):
        return self._score

    @score.setter
    def score(self, value):
        if 0 <= value <= 100:
            self._score = value
        else:
            raise ValueError("Điểm phải từ 0-100")

    def __str__(self):
        return f"Student({self.name})"

    def __repr__(self):
        return f"Student(name='{self.name}', age={self.age})"

# Sử dụng
s = Student("An", 20)
print(s.greet())
s.score = 95
print(s)  # Student(An)
\`\`\``],

['python-fcc','08-py-inheritance','Inheritance & Polymorphism','Kế thừa và đa hình trong Python','beginner','python',
`# Inheritance & Polymorphism

## Kế thừa
\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("Subclass phải override")

class Dog(Animal):
    def speak(self):
        return f"{self.name}: Gâu gâu!"

class Cat(Animal):
    def speak(self):
        return f"{self.name}: Meo meo!"

# Polymorphism
animals = [Dog("Rex"), Cat("Mimi"), Dog("Max")]
for animal in animals:
    print(animal.speak())
\`\`\`

## Multiple Inheritance
\`\`\`python
class Flyable:
    def fly(self): return "Đang bay..."

class Swimmable:
    def swim(self): return "Đang bơi..."

class Duck(Animal, Flyable, Swimmable):
    def speak(self): return f"{self.name}: Quạc quạc!"

duck = Duck("Donald")
duck.speak()  # "Donald: Quạc quạc!"
duck.fly()    # "Đang bay..."
duck.swim()   # "Đang bơi..."
\`\`\`

## Abstract Base Class
\`\`\`python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self): pass

    @abstractmethod
    def perimeter(self): pass

class Rectangle(Shape):
    def __init__(self, w, h):
        self.w, self.h = w, h
    def area(self): return self.w * self.h
    def perimeter(self): return 2 * (self.w + self.h)
\`\`\``],

['python-fcc','09-py-oop-practice','Thực hành: OOP Project','Bài tập OOP: xây dựng hệ thống quản lý','beginner','python',
`# Thực hành: OOP Project

## Hệ thống quản lý thư viện
\`\`\`python
from datetime import datetime

class Book:
    def __init__(self, title, author, isbn):
        self.title = title
        self.author = author
        self.isbn = isbn
        self.is_available = True

    def __str__(self):
        status = "Có sẵn" if self.is_available else "Đã mượn"
        return f"{self.title} - {self.author} [{status}]"

class Member:
    def __init__(self, name, member_id):
        self.name = name
        self.id = member_id
        self.borrowed = []

    def borrow(self, book):
        if not book.is_available:
            return f"'{book.title}' đã được mượn"
        book.is_available = False
        self.borrowed.append({"book": book, "date": datetime.now()})
        return f"{self.name} đã mượn '{book.title}'"

    def return_book(self, book):
        book.is_available = True
        self.borrowed = [b for b in self.borrowed if b["book"] != book]
        return f"{self.name} đã trả '{book.title}'"

class Library:
    def __init__(self, name):
        self.name = name
        self.books = []
        self.members = []

    def add_book(self, book):
        self.books.append(book)

    def search(self, keyword):
        return [b for b in self.books
                if keyword.lower() in b.title.lower()
                or keyword.lower() in b.author.lower()]

    def available_books(self):
        return [b for b in self.books if b.is_available]
\`\`\``],

['python-fcc','10-py-fileio','File I/O & Error Handling','Đọc ghi file và xử lý lỗi trong Python','beginner','python',
`# File I/O & Error Handling

## Đọc/Ghi File
\`\`\`python
# Ghi file
with open("data.txt", "w", encoding="utf-8") as f:
    f.write("Dòng 1\\n")
    f.write("Dòng 2\\n")

# Đọc file
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()       # Đọc toàn bộ
    # lines = f.readlines()  # Đọc theo dòng

# Đọc JSON
import json
with open("config.json") as f:
    config = json.load(f)

# Ghi JSON
with open("output.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# CSV
import csv
with open("students.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["score"])
\`\`\`

## Error Handling
\`\`\`python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Không thể chia cho 0!")
except (TypeError, ValueError) as e:
    print(f"Lỗi: {e}")
else:
    print("Thành công!")
finally:
    print("Luôn chạy")

# Custom Exception
class InvalidScoreError(Exception):
    def __init__(self, score):
        super().__init__(f"Điểm {score} không hợp lệ (0-100)")
\`\`\``],

['python-fcc','11-py-regex','Regular Expressions','Biểu thức chính quy trong Python','beginner','python',
`# Regular Expressions

\`\`\`python
import re

# Tìm kiếm
text = "Email: an@mail.com và binh@gmail.com"
emails = re.findall(r'[\\w.]+@[\\w.]+', text)
# ["an@mail.com", "binh@gmail.com"]

# Patterns phổ biến
re.match(r'^\\d+', "123abc")       # Match đầu chuỗi
re.search(r'\\d+', "abc123def")    # Tìm bất kỳ đâu
re.findall(r'\\b\\w{4}\\b', text)   # Tất cả từ 4 ký tự
re.sub(r'\\d+', 'X', "abc123")    # Thay thế → "abcX"

# Nhóm (Groups)
pattern = r'(\\w+)@(\\w+)\\.(\\w+)'
match = re.search(pattern, "an@mail.com")
match.group(1)  # "an"
match.group(2)  # "mail"

# Các ký hiệu
# \\d = digit, \\w = word char, \\s = whitespace
# .  = any char, * = 0+, + = 1+, ? = 0 or 1
# ^  = start, $ = end
# [] = char class, () = group
\`\`\`

## Ví dụ thực tế
\`\`\`python
# Validate số điện thoại VN
def is_valid_phone(phone):
    return bool(re.match(r'^(0|\\+84)(3|5|7|8|9)\\d{8}$', phone))

# Extract hashtags
tags = re.findall(r'#(\\w+)', "Học #Python #freeCodeCamp")
# ["Python", "freeCodeCamp"]
\`\`\``],

['python-fcc','12-py-modules','Modules & Packages','Tổ chức code với modules và packages','beginner','python',
`# Modules & Packages

## Import
\`\`\`python
import os
from pathlib import Path
from datetime import datetime, timedelta
from collections import Counter, defaultdict

# Alias
import numpy as np
import pandas as pd
\`\`\`

## Tạo Module riêng
\`\`\`python
# utils.py
def slugify(text):
    return text.lower().replace(" ", "-")

def format_currency(amount):
    return f"{amount:,.0f} VNĐ"

# main.py
from utils import slugify, format_currency
print(slugify("Xin Chào"))  # "xin-chào"
\`\`\`

## Package Structure
\`\`\`
mypackage/
├── __init__.py
├── math_utils.py
├── string_utils.py
└── sub_package/
    ├── __init__.py
    └── helpers.py
\`\`\`

## Virtual Environment
\`\`\`bash
python -m venv venv
source venv/bin/activate    # Linux/Mac
venv\\Scripts\\activate       # Windows

pip install requests flask
pip freeze > requirements.txt
pip install -r requirements.txt
\`\`\`

## Thư viện vô dùng
| Thư viện | Mục đích |
|---------|---------|
| \`requests\` | HTTP requests |
| \`flask\` / \`fastapi\` | Web framework |
| \`pytest\` | Testing |
| \`pandas\` | Data analysis |
| \`sqlalchemy\` | ORM database |`],

// === COURSE 5: RELATIONAL DATABASES ===
['relational-databases','01-bash-intro','Terminal & Lệnh cơ bản','Giới thiệu terminal và các lệnh Linux cơ bản','intermediate','bash',
`# Terminal & Lệnh Cơ Bản

## Điều hướng
\`\`\`bash
pwd                # Thư mục hiện tại
ls                 # Liệt kê files
ls -la             # Chi tiết + ẩn
cd /path/to/dir    # Chuyển thư mục
cd ..              # Lên một cấp
cd ~               # Về home
\`\`\`

## Quản lý File & Thư mục
\`\`\`bash
mkdir project          # Tạo thư mục
mkdir -p a/b/c         # Tạo nested
touch file.txt         # Tạo file
cp file.txt backup.txt # Copy
mv old.txt new.txt     # Đổi tên/di chuyển
rm file.txt            # Xóa file
rm -rf folder          # Xóa thư mục (cẩn thận!)
\`\`\`

## Đọc & Tìm kiếm
\`\`\`bash
cat file.txt           # Hiển thị nội dung
head -n 10 file.txt    # 10 dòng đầu
tail -n 5 file.txt     # 5 dòng cuối
grep "error" log.txt   # Tìm pattern
grep -r "TODO" ./src   # Tìm recursive
find . -name "*.py"    # Tìm file
wc -l file.txt         # Đếm dòng
\`\`\`

## Pipe & Redirect
\`\`\`bash
ls -la | grep ".txt"           # Pipe
cat log.txt | sort | uniq -c   # Chain
echo "data" > file.txt         # Ghi đè
echo "more" >> file.txt        # Append
command 2> error.log           # Redirect stderr
\`\`\``],

['relational-databases','02-bash-filesystem','File System & Permissions','Hệ thống file và phân quyền Linux','intermediate','bash',
`# File System & Permissions

## Cấu trúc thư mục Linux
\`\`\`
/             # Root
├── home/     # Thư mục người dùng
├── etc/      # Cấu hình hệ thống
├── var/      # Dữ liệu thay đổi (logs, databases)
├── usr/      # Chương trình người dùng
├── tmp/      # File tạm
└── bin/      # Lệnh cơ bản
\`\`\`

## Permissions
\`\`\`bash
# Hiển thị: -rwxr-xr--
# Type | Owner | Group | Others
# -    | rwx   | r-x   | r--

chmod 755 script.sh    # rwxr-xr-x
chmod +x script.sh     # Thêm execute
chmod u+w file.txt     # Owner thêm write

# Số: r=4, w=2, x=1
# 755 = rwx(7) r-x(5) r-x(5)
# 644 = rw-(6) r--(4) r--(4)

# Đổi sở hữu
chown user:group file.txt
\`\`\`

## Environment Variables
\`\`\`bash
echo \$HOME             # /home/username
echo \$PATH             # Đường dẫn tìm lệnh
export MY_VAR="hello"  # Tạo biến môi trường

# .bashrc hoặc .zshrc
export PATH="\$HOME/.local/bin:\$PATH"
alias ll="ls -la"
alias gs="git status"
\`\`\``],

['relational-databases','03-bash-scripting','Bash Scripting cơ bản','Viết script tự động hóa với Bash','intermediate','bash',
`# Bash Scripting

## Script cơ bản
\`\`\`bash
#!/bin/bash
# setup.sh - Script cài đặt dự án

echo "🚀 Bắt đầu cài đặt..."

# Biến
PROJECT="my-app"
VERSION="1.0.0"

# Điều kiện
if [ -d "\$PROJECT" ]; then
    echo "Thư mục \$PROJECT đã tồn tại"
else
    mkdir -p "\$PROJECT"
    echo "Đã tạo \$PROJECT"
fi

# Vòng lặp
for file in *.txt; do
    echo "Xử lý: \$file"
    cp "\$file" "\$PROJECT/"
done

echo "✅ Hoàn tất v\$VERSION!"
\`\`\`

## Hàm
\`\`\`bash
#!/bin/bash
log() {
    echo "[\$(date '+%H:%M:%S')] \$1"
}

check_command() {
    if command -v "\$1" &> /dev/null; then
        log "✅ \$1 đã cài đặt"
    else
        log "❌ \$1 chưa cài đặt"
        return 1
    fi
}

check_command "node"
check_command "python3"
check_command "git"
\`\`\`

## Input & Arguments
\`\`\`bash
#!/bin/bash
# deploy.sh <env> <version>
ENV=\${1:-"staging"}     # Argument 1, default "staging"
VER=\${2:-"latest"}      # Argument 2, default "latest"

read -p "Deploy \$VER to \$ENV? (y/n): " confirm
if [ "\$confirm" = "y" ]; then
    echo "Deploying..."
fi
\`\`\``],

['relational-databases','04-sql-crud','CREATE, INSERT & SELECT','Tạo bảng, thêm và truy vấn dữ liệu SQL','intermediate','sql',
`# CREATE, INSERT & SELECT

## Tạo bảng (CREATE TABLE)
\`\`\`sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INT CHECK (age >= 0 AND age <= 150),
    gpa DECIMAL(3,2) DEFAULT 0.00,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    credits INT NOT NULL DEFAULT 3
);

CREATE TABLE enrollments (
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    grade CHAR(1),
    PRIMARY KEY (student_id, course_id)
);
\`\`\`

## Thêm dữ liệu (INSERT)
\`\`\`sql
INSERT INTO students (name, email, age, gpa) VALUES
    ('Nguyễn An', 'an@mail.com', 20, 3.50),
    ('Trần Bình', 'binh@mail.com', 21, 3.80),
    ('Lê Chi', 'chi@mail.com', 19, 3.20);

INSERT INTO courses (title, credits) VALUES
    ('Cơ sở dữ liệu', 4),
    ('Lập trình Python', 3);
\`\`\`

## Truy vấn (SELECT)
\`\`\`sql
SELECT * FROM students;
SELECT name, gpa FROM students WHERE gpa >= 3.5;
SELECT name, age FROM students ORDER BY age DESC LIMIT 5;
SELECT DISTINCT age FROM students;
\`\`\``],

['relational-databases','05-sql-joins','WHERE, JOIN & Aggregation','Lọc, kết bảng và hàm tổng hợp SQL','intermediate','sql',
`# WHERE, JOIN & Aggregation

## WHERE — Lọc dữ liệu
\`\`\`sql
SELECT * FROM students WHERE age BETWEEN 18 AND 25;
SELECT * FROM students WHERE name LIKE 'Nguyễn%';
SELECT * FROM students WHERE email IN ('an@mail.com', 'binh@mail.com');
SELECT * FROM students WHERE gpa >= 3.0 AND age < 22;
SELECT * FROM courses WHERE title IS NOT NULL;
\`\`\`

## JOIN — Kết bảng
\`\`\`sql
-- INNER JOIN: chỉ lấy dòng khớp cả 2 bảng
SELECT s.name, c.title, e.grade
FROM enrollments e
INNER JOIN students s ON e.student_id = s.id
INNER JOIN courses c ON e.course_id = c.id;

-- LEFT JOIN: lấy tất cả bên trái
SELECT s.name, COUNT(e.course_id) AS total_courses
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id
GROUP BY s.name;
\`\`\`

## Aggregation — Hàm tổng hợp
\`\`\`sql
SELECT COUNT(*) FROM students;
SELECT AVG(gpa) FROM students;
SELECT MAX(gpa), MIN(gpa) FROM students;

-- GROUP BY
SELECT age, COUNT(*) AS total, AVG(gpa) AS avg_gpa
FROM students
GROUP BY age
HAVING AVG(gpa) >= 3.0
ORDER BY avg_gpa DESC;
\`\`\``],

['relational-databases','06-sql-practice','Thực hành: SQL Queries','Bài tập truy vấn SQL nâng cao','intermediate','sql',
`# Thực hành: SQL Queries

## Subqueries
\`\`\`sql
-- Sinh viên có GPA cao hơn trung bình
SELECT name, gpa FROM students
WHERE gpa > (SELECT AVG(gpa) FROM students);

-- Khóa học có nhiều sinh viên nhất
SELECT c.title, COUNT(e.student_id) AS total
FROM courses c
JOIN enrollments e ON c.id = e.course_id
GROUP BY c.title
ORDER BY total DESC
LIMIT 1;
\`\`\`

## Views
\`\`\`sql
CREATE VIEW student_summary AS
SELECT s.name, s.gpa, COUNT(e.course_id) AS courses_taken
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id
GROUP BY s.id, s.name, s.gpa;

SELECT * FROM student_summary WHERE gpa >= 3.5;
\`\`\`

## CTE (Common Table Expression)
\`\`\`sql
WITH top_students AS (
    SELECT name, gpa, RANK() OVER (ORDER BY gpa DESC) AS rank
    FROM students
)
SELECT name, gpa, rank FROM top_students WHERE rank <= 3;
\`\`\`

## Thử thách
1. Tìm sinh viên chưa đăng ký khóa nào
2. Tính GPA trung bình theo khóa học
3. Liệt kê top 5 sinh viên theo số khóa đã hoàn thành`],

['relational-databases','07-pg-types','Data Types & Constraints','Kiểu dữ liệu và ràng buộc trong PostgreSQL','intermediate','sql',
`# PostgreSQL: Data Types & Constraints

## Kiểu dữ liệu đặc biệt
\`\`\`sql
-- UUID
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL
);

-- JSON / JSONB
CREATE TABLE settings (
    user_id UUID REFERENCES users(id),
    preferences JSONB DEFAULT '{}'::jsonb
);
INSERT INTO settings VALUES (
    '...', '{"theme": "dark", "lang": "vi"}'::jsonb
);
SELECT preferences->>'theme' FROM settings;  -- "dark"
SELECT preferences @> '{"lang": "vi"}' FROM settings;  -- true

-- Array
CREATE TABLE tags (
    post_id INT,
    labels TEXT[] DEFAULT '{}'
);
INSERT INTO tags VALUES (1, ARRAY['python', 'tutorial']);
SELECT * FROM tags WHERE 'python' = ANY(labels);

-- ENUM
CREATE TYPE status AS ENUM ('active', 'inactive', 'banned');
\`\`\`

## Constraints
\`\`\`sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    price DECIMAL(10,2) CHECK (price > 0),
    category TEXT NOT NULL DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\``],

['relational-databases','08-pg-advanced','Indexes, Triggers & Functions','Index, trigger và stored functions trong PostgreSQL','intermediate','sql',
`# Indexes, Triggers & Functions

## Indexes — Tăng tốc truy vấn
\`\`\`sql
CREATE INDEX idx_students_name ON students(name);
CREATE INDEX idx_students_email ON students(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Composite index
CREATE INDEX idx_enrollments_user_course ON enrollments(student_id, course_id);

-- GIN index cho JSONB
CREATE INDEX idx_settings_prefs ON settings USING GIN (preferences);
\`\`\`

## Stored Functions
\`\`\`sql
CREATE OR REPLACE FUNCTION calculate_gpa(student_id INT)
RETURNS DECIMAL AS $$
DECLARE avg_grade DECIMAL;
BEGIN
    SELECT AVG(
        CASE grade
            WHEN 'A' THEN 4.0 WHEN 'B' THEN 3.0
            WHEN 'C' THEN 2.0 WHEN 'D' THEN 1.0
            ELSE 0.0
        END
    ) INTO avg_grade
    FROM enrollments WHERE enrollments.student_id = calculate_gpa.student_id;
    RETURN COALESCE(avg_grade, 0);
END;
$$ LANGUAGE plpgsql;

SELECT name, calculate_gpa(id) FROM students;
\`\`\`

## Triggers
\`\`\`sql
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
\`\`\``],

['relational-databases','09-pg-design','Database Design & Normalization','Thiết kế CSDL và chuẩn hóa dữ liệu','intermediate','sql',
`# Database Design & Normalization

## Chuẩn hóa (Normal Forms)

### 1NF: Giá trị nguyên tử
\`\`\`sql
-- ❌ Sai: cột chứa nhiều giá trị
-- name: "An", courses: "HTML, CSS, JS"

-- ✅ Đúng: Tách thành bảng riêng
CREATE TABLE student_courses (
    student_id INT REFERENCES students(id),
    course_id INT REFERENCES courses(id),
    PRIMARY KEY (student_id, course_id)
);
\`\`\`

### 2NF: Không có phụ thuộc một phần
### 3NF: Không có phụ thuộc bắc cầu

## Quan hệ
\`\`\`sql
-- 1:1 (profiles ↔ users)
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    bio TEXT, avatar_url TEXT
);

-- 1:N (courses → lessons)
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(id),
    title TEXT NOT NULL
);

-- N:N (students ↔ courses qua enrollments)
CREATE TABLE enrollments (
    student_id INT REFERENCES students(id),
    course_id INT REFERENCES courses(id),
    PRIMARY KEY (student_id, course_id)
);
\`\`\`

## Checklist thiết kế
1. Xác định entities và relationships
2. Chọn primary keys (UUID vs SERIAL)
3. Thiết lập foreign keys với ON DELETE
4. Thêm indexes cho cột query thường xuyên
5. Áp dụng RLS nếu dùng Supabase`],
];

let c=0;
for(const[folder,file,title,desc,diff,lang,body]of L){
  const dir=p.join(contentDir,folder);
  if(!fs.existsSync(dir))fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(p.join(dir,`${file}.mdx`),`---\ntitle: "${title}"\ndescription: "${desc}"\ndifficulty: "${diff}"\nlanguage: "${lang}"\n---\n\n${body}\n`);
  c++;
}
console.log(`✅ Tạo ${c} MDX files (Python + Relational DB) trong ${contentDir}`);

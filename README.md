# React + Node.js + MySQL Project

A full-stack web application using React, Node.js, and MySQL.

## Project Structure
```
.
├── frontend/           # React frontend application
└── backend/           # Node.js backend application
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Database Setup
1. Create a MySQL database named `categories_db`
2. Run the following SQL query to create the categories table:
```sql
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO categories (name) VALUES 
    ('A'),
    ('B'),
    ('C'),
    ('D'),
    ('E');
```

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file with your MySQL configuration:
```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=categories_db
PORT=5000
```

4. Start the server:
```bash
npm start
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000

---

# Hướng dẫn Cài Đặt (Vietnamese)

## Cấu Trúc Dự Án
```
.
├── frontend/           # Ứng dụng React frontend
└── backend/           # Ứng dụng Node.js backend
```

## Hướng Dẫn Cài Đặt

### Yêu Cầu
- Node.js (v14 trở lên)
- MySQL (v8.0 trở lên)
- npm hoặc yarn

### Cài Đặt Database
1. Tạo database MySQL tên `categories_db`
2. Chạy câu lệnh SQL sau để tạo bảng categories:
```sql
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO categories (name) VALUES 
    ('A'),
    ('B'),
    ('C'),
    ('D'),
    ('E');
```

### Cài Đặt Backend
1. Di chuyển vào thư mục backend:
```bash
cd backend
```

2. Cài đặt các dependencies:
```bash
npm install
```

3. Tạo file .env với cấu hình MySQL:
```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=categories_db
PORT=5000
```

4. Khởi động server:
```bash
npm start
```

### Cài Đặt Frontend
1. Di chuyển vào thư mục frontend:
```bash
cd frontend
```

2. Cài đặt các dependencies:
```bash
npm install
```

3. Khởi động development server:
```bash
npm start
```

Ứng dụng sẽ chạy tại địa chỉ http://localhost:3000 
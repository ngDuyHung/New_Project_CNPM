Of course\! Here is the updated `.md` file content with the team members section added.

# React + Node.js + MySQL Project

A full-stack web application using React, Node.js, and MySQL.

## Project Name: VocabMaster

[cite\_start]VocabMaster is an intelligent English learning web application designed to provide a modern, interactive platform[cite: 4, 5]. [cite\_start]It integrates various practice formats like Flashcards, Fill-in-the-blanks, Listening, and Writing exercises[cite: 5]. [cite\_start]The application leverages Artificial Intelligence (AI) to personalize learning content, provide instant feedback, and generate exercises automatically[cite: 6, 12].

-----

## Team Members

[cite\_start]This project was developed by a team of 14 dedicated members[cite: 14].

| Name | Student ID | Role |
| :--- | :--- | :--- |
| Nguyễn Duy Hùng | DH52200731 | [cite\_start]Team Leader / Backend Developer [cite: 15, 20] |
| Trang Mạnh Phúc | DH52203917 | [cite\_start]Backend Developer [cite: 20] |
| Võ Hoàng Trường | DH52201692 | [cite\_start]Backend Developer [cite: 20] |
| Nguyễn Tiến Đạt | DH52200487 | [cite\_start]Backend Developer [cite: 20] |
| Lâm Thanh Hiếu | DH52200678 | [cite\_start]Backend Developer [cite: 20] |
| Trần Huy An | DH52200314 | [cite\_start]Frontend Developer [cite: 20] |
| Trương Ngọc Đỉnh | DH52200507 | [cite\_start]Frontend Developer [cite: 20] |
| Nguyễn Hoàng Phúc | DH52201242 | [cite\_start]Frontend Developer [cite: 20] |
| Nguyễn Thành Trung | DH52201670 | [cite\_start]Frontend Developer [cite: 20] |
| Châu Quốc Kiệt | DH52113613 | [cite\_start]Frontend Developer [cite: 20] |
| Nguyễn Hữu Khanh | DH52200857 | [cite\_start]Design, Slides, Reporting [cite: 20] |
| Hồ Khôi Phục | DH52201264 | [cite\_start]Design, Slides, Reporting [cite: 20] |
| Nguyễn Tiến Đạt | DH52200486 | [cite\_start]Design, Slides, Reporting [cite: 20] |
| Trần Quốc Khánh | DH52200887 | [cite\_start]Code Support, QA/Testing [cite: 20] |

-----

## Project Structure

```
.
├── frontend/         # React frontend application
└── backend/          # Node.js backend application
```

## Setup Instructions

### Prerequisites

  - Node.js (v14 or higher)
  - MySQL (v8.0 or higher)
  - npm or yarn

### Database Setup

1.  Create a MySQL database named `categories_db`
2.  Run the following SQL query to create the categories table:

<!-- end list -->

````sql


### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
````

2.  Install dependencies:

<!-- end list -->

```bash
npm install
```

3.  Create a .env file with your MySQL configuration:

<!-- end list -->

```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=categories_db
PORT=5000
```

4.  Start the server:

<!-- end list -->

```bash
npm start
```

### Frontend Setup

1.  Navigate to the frontend directory:

<!-- end list -->

```bash
cd frontend
```

2.  Install dependencies:

<!-- end list -->

```bash
npm install
```

3.  Start the development server:

<!-- end list -->

```bash
npm start
```

The application will be available at http://localhost:3000

-----

# Hướng dẫn Cài Đặt (Vietnamese)

## Cấu Trúc Dự Án

```
.
├── frontend/         # Ứng dụng React frontend
└── backend/          # Ứng dụng Node.js backend
```

## Hướng Dẫn Cài Đặt

### Yêu Cầu

  - Node.js (v14 trở lên)
  - MySQL (v8.0 trở lên)
  - npm hoặc yarn

### Cài Đặt Database

1.  Tạo database MySQL tên `categories_db`
2.  Chạy câu lệnh SQL sau để tạo bảng categories:

<!-- end list -->

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

1.  Di chuyển vào thư mục backend:

<!-- end list -->

```bash
cd backend
```

2.  Cài đặt các dependencies:

<!-- end list -->

```bash
npm install
```

3.  Tạo file .env với cấu hình MySQL:

<!-- end list -->

```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=categories_db
PORT=5000
```

4.  Khởi động server:

<!-- end list -->

```bash
npm start
```

### Cài Đặt Frontend

1.  Di chuyển vào thư mục frontend:

<!-- end list -->

```bash
cd frontend
```

2.  Cài đặt các dependencies:

<!-- end list -->

```bash
npm install
```

3.  Khởi động development server:

<!-- end list -->

```bash
npm start
```

Ứng dụng sẽ chạy tại địa chỉ http://localhost:3000

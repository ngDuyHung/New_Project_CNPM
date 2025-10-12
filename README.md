<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 1px solid #e1e4e8; border-radius: 10px; padding: 25px; background-color: #f6f8fa;">

<div align="center">
  <h1 style="color: #0366d6; border-bottom: 2px solid #0366d6; padding-bottom: 10px;">
    🚀 VocabMaster - Ứng dụng Học Tiếng Anh Thông Minh 🚀
  </h1>
  <p style="font-size: 1.2em; color: #586069;">
    Một nền tảng học tiếng Anh trực tuyến hiện đại, tích hợp Trí tuệ nhân tạo (AI) để cá nhân hóa lộ trình học tập của bạn.
  </p>
</div>

---

## ✨ **Tính Năng Nổi Bật**

<table width="100%">
  <tr style="vertical-align: top;">
    <td width="50%" style="padding: 10px;">
      <h4 style="color: #0366d6;">🤖 Học Tập với AI</h4>
      <p>Tự động tạo từ vựng và 4 dạng bài tập (Flashcard, Điền khuyết, Nghe, Viết) dựa trên chủ đề bạn chọn.</p>
    </td>
    <td width="50%" style="padding: 10px;">
      <h4 style="color: #0366d6;">📚 Từ điển Tích hợp</h4>
      <p>Tra cứu từ vựng nhanh chóng và lưu lại vào danh sách cá nhân để ôn tập.</p>
    </td>
  </tr>
  <tr style="vertical-align: top;">
    <td width="50%" style="padding: 10px;">
      <h4 style="color: #0366d6;">📊 Theo dõi Tiến độ</h4>
      <p>Xem lại lịch sử, số từ đã học và các danh hiệu đã đạt được để có thêm động lực.</p>
    </td>
    <td width="50%" style="padding: 10px;">
      <h4 style="color: #0366d6;">💬 Chatbot AI (Sắp ra mắt)</h4>
      <p>Trò chuyện với AI để luyện tập kỹ năng giao tiếp theo chủ đề một cách tự nhiên.</p>
    </td>
  </tr>
</table>

---

## 🛠️ **Công Nghệ Sử Dụng**

| Lĩnh vực | Công nghệ |
| :--- | :--- |
| **Frontend** | `React.js`, `Material-UI`, `Bootstrap` |
| **Backend** | `Node.js`, `Express.js` |
| **Database** | `MySQL` |
| **Xác thực** | `JSON Web Tokens (JWT)` |
| **AI** | `Mô hình sinh câu hỏi`, `Google Text-to-Speech`|
| **Quản lý** | `Agile/Scrum`, `Jira`, `ClickUp` |

---

## 👨‍💻 **Thành Viên Nhóm Phát Triển**

<details>
  <summary><strong>Nhấn vào đây để xem danh sách thành viên</strong></summary>
  <table width="100%" style="margin-top: 15px; border-collapse: collapse;">
    <thead>
      <tr style="background-color: #0366d6; color: white;">
        <th style="padding: 10px; text-align: left;">Tên</th>
        <th style="padding: 10px; text-align: left;">MSSV</th>
        <th style="padding: 10px; text-align: left;">Vai trò</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #e1e4e8;">
        <td style="padding: 10px;"><strong>Nguyễn Duy Hùng</strong></td>
        <td style="padding: 10px;"><strong>DH52200731</strong></td>
        <td style="padding: 10px;"><strong>Team Leader / Backend</strong></td>
      </tr>
      <tr style="background-color: #f6f8fa; border-bottom: 1px solid #e1e4e8;">
        <td style="padding: 10px;">Trang Mạnh Phúc</td>
        <td style="padding: 10px;">DH52203917</td>
        <td style="padding: 10px;">Backend Developer</td>
      </tr>
      <tr style="border-bottom: 1px solid #e1e4e8;">
        <td style="padding: 10px;">Võ Hoàng Trường</td>
        <td style="padding: 10px;">DH52201692</td>
        <td style="padding: 10px;">Backend Developer</td>
      </tr>
      <tr style="background-color: #f6f8fa; border-bottom: 1px solid #e1e4e8;">
        <td style="padding: 10px;">Trần Huy An</td>
        <td style="padding: 10px;">DH52200314</td>
        <td style="padding: 10px;">Frontend Developer</td>
      </tr>
    </tbody>
  </table>
</details>

---

## 🚀 **Hướng Dẫn Cài Đặt (Getting Started)**

### **📋 Yêu Cầu (Prerequisites)**
* Node.js (v14+)
* MySQL (v8.0+)
* `npm` hoặc `yarn`

### **⚙️ Các Bước Cài Đặt (Installation)**

1.  **Clone a repository về máy:**
    ```bash
    git clone <your-repository-link>
    cd <project-folder>
    ```

2.  **💾 Cài đặt Database:**
    * Tạo database trong MySQL với tên `categories_db`.
    * Chạy câu lệnh SQL sau:
        ```sql
        CREATE TABLE categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );
        INSERT INTO categories (name) VALUES ('A'), ('B'), ('C');
        ```

3.  **🔌 Cài đặt Backend:**
    * Đi đến thư mục `backend`, cài đặt dependencies và khởi động server:
        ```bash
        cd backend
        npm install
        # Tạo file .env với thông tin database của bạn
        npm start
        ```
    * *Server sẽ chạy tại `http://localhost:5000`*

4.  **🖥️ Cài đặt Frontend:**
    * Mở terminal mới, đi đến thư mục `frontend`, cài đặt dependencies và khởi động:
        ```bash
        cd frontend
        npm install
        npm start
        ```
    * *Ứng dụng sẽ chạy tại `http://localhost:3000`*

</div>

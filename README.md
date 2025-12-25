
# TuanPhim - Modern Movie Streaming Platform

TuanPhim là một ứng dụng xem phim trực tuyến hiện đại được xây dựng với React và Tailwind CSS. Dự án lấy cảm hứng từ giao diện của các nền tảng streaming hàng đầu như Netflix và Webhalong, cung cấp trải nghiệm mượt mà và tính năng đồng bộ dữ liệu độc đáo từ Google Sheets.

## 🚀 Tính năng nổi bật

- **Giao diện hiện đại**: Thiết kế Dark Mode tinh tế, responsive hoàn toàn trên mọi thiết bị.
- **Trình phát video cao cấp**: Hỗ trợ HLS (.m3u8) và MP4 với các tính năng:
  - Tua phim thông minh (Skip 10s).
  - Tùy chỉnh tốc độ phát.
  - Ghi nhớ tiến trình xem phim (Continue Watching).
- **Đồng bộ Google Sheets**: Tự động tải danh sách phim cá nhân từ Google Sheets CSV.
- **Quản lý danh sách**: Tính năng Playlist giúp lưu trữ các bộ phim yêu thích.
- **Tìm kiếm thông minh**: Tìm kiếm phim theo tên, diễn viên hoặc thể loại ngay lập tức.
- **Hệ thống lọc**: Lọc phim theo Thể loại, Quốc gia, Năm phát hành và Sắp xếp.

## 🛠 Công nghệ sử dụng

- **Frontend**: React 19 (App Router Structure).
- **Routing**: React Router 7.
- **Styling**: Tailwind CSS.
- **Icons**: Lucide React.
- **Streaming**: HLS.js.
- **State Management**: Custom React Hooks + LocalStorage.
- **Dữ liệu**: Google Sheets CSV API.

## 📦 Cài đặt

1. Clone repository:
```bash
git clone https://github.com/your-username/tuanphim.git
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy dự án:
```bash
npm start
```

## 📝 Cấu hình Google Sheets

Để sử dụng kho phim cá nhân, hãy tạo một Google Sheet với 2 cột:
1. **Name**: Tên bộ phim.
2. **URL**: Link video trực tiếp (MP4 hoặc M3U8).

Sau đó, xuất bản trang tính dưới dạng CSV và cập nhật URL trong tệp `pages/MyMovies.tsx`.

---
Dự án được thực hiện bởi Senior Frontend Engineer.

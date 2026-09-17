# Phần mềm lập và tổng hợp Dự toán ngân sách nhà nước

👉 **Truy cập: https://tranght2908.github.io/du-toan-ngan-sach-cap-xa/**

Tệp chạy độc lập: **`Phan-mem-lap-va-tong-hop-Du-toan-NSNN.html`** — mở bằng trình duyệt là dùng được, không cần cài đặt.

## Phạm vi

Quản lý trọn vòng dự toán ngân sách nhà nước cấp xã/phường: đơn vị lập và gửi hồ sơ → Sở Tài chính tiếp nhận, thẩm tra, trình → cấp có thẩm quyền quyết định → phân bổ, giao dự toán → theo dõi sau giao và điều chỉnh, bổ sung trong năm.

## Vai trò

Quản trị hệ thống · Đơn vị lập dự toán · Cán bộ tiếp nhận · Cán bộ thẩm tra · Cấp có thẩm quyền · Bộ phận phân bổ / giao dự toán · Kế toán / theo dõi. Đổi vai trò ở góc dưới bên trái; quyền của từng vai trò xem tại **Quản trị → Vai trò & phân quyền**.

## Dữ liệu

- Năm 2025, 2026: dự toán đã giao, có điều chỉnh/bổ sung trong năm.
- Năm 2027: kỳ đang mở tiếp nhận, hồ sơ HS-2027-001 đang ở trạng thái nháp — bắt đầu từ vai trò Đơn vị lập dự toán để đi hết quy trình.
- Thao tác được lưu trên trình duyệt đang dùng; chọn **Đặt lại dữ liệu** trong menu vai trò để quay về trạng thái ban đầu.

## Kiểm thử

`business-rules.js` chứa quy tắc nghiệp vụ (đã gộp vào tệp HTML); chạy `node --test business-rules.test.js`.

# Sổ Tay Thú Cưng — app đặt lịch cho trung tâm chăm sóc thú cưng

Ứng dụng web dạng **PWA** (Progressive Web App): chạy trên trình duyệt máy tính, và cài được lên điện thoại như một app thật (không cần App Store/Play Store). Frontend host miễn phí trên **GitHub Pages**; dữ liệu (tài khoản, hồ sơ thú cưng, lịch hẹn) lưu trên **Firebase** (gói miễn phí Spark).

Không cần cài Node.js hay công cụ build — toàn bộ là HTML/CSS/JS thuần, dễ mở ra sửa trực tiếp.

---

## 1. Cấu trúc project

```
index.html              Trang chủ + đăng ký/đăng nhập
booking.html             Đặt lịch hẹn (khách hàng)
profile.html              Hồ sơ thú cưng (khách hàng)
admin.html                  Bảng quản trị lịch hẹn (nhân viên/admin)
manifest.json + service-worker.js    Cấu hình để cài lên điện thoại
assets/css/style.css        Toàn bộ giao diện
assets/js/firebase-config.js   Nơi bạn dán "chìa khoá" Firebase của mình
assets/js/auth.js, booking.js, profile.js, admin.js, layout.js   Logic từng trang
firestore.rules            Luật bảo mật dữ liệu — QUAN TRỌNG NHẤT
.github/workflows/deploy.yml   Tự động deploy lên GitHub Pages mỗi khi push code
```

## 2. Tạo backend Firebase (miễn phí, 10 phút)

1. Vào **https://console.firebase.google.com** → **Add project** → đặt tên (vd: `petcare-trung-tam`).
2. Trong project, bấm biểu tượng **`</>`** để thêm một Web App → đặt tên → Firebase sẽ hiện ra một đoạn `firebaseConfig`. Copy toàn bộ.
3. Mở file `assets/js/firebase-config.js`, dán đè vào biến `firebaseConfig`.
4. Vào menu **Build → Authentication → Get started → Sign-in method** → bật **Email/Password**.
5. Vào menu **Build → Firestore Database → Create database** → chọn **Production mode** → chọn vùng (nên chọn `asia-southeast1` gần Việt Nam).
6. Vào tab **Rules** của Firestore → xoá hết nội dung mặc định → **dán toàn bộ nội dung file `firestore.rules`** vào → bấm **Publish**. Bước này chính là "khoá cửa" cho dữ liệu khách hàng — đừng bỏ qua.

## 3. Đưa code lên GitHub và bật hosting miễn phí

1. Tạo repository mới trên GitHub, đặt **Public** (bắt buộc để dùng GitHub Pages miễn phí).
2. Đẩy toàn bộ thư mục này lên repo (qua GitHub Desktop hoặc dòng lệnh `git init && git add . && git commit -m "init" && git remote add origin <link-repo> && git push -u origin main`).
3. Vào **Settings → Pages** của repo → mục **Source** chọn **GitHub Actions**. Workflow có sẵn ở `.github/workflows/deploy.yml` sẽ tự chạy và deploy mỗi khi bạn push code lên nhánh `main`.
4. Sau 1–2 phút, trang sẽ có địa chỉ dạng `https://ten-tai-khoan.github.io/ten-repo/`.

## 4. Cấp quyền nhân viên/quản trị đầu tiên

App mặc định: ai đăng ký cũng chỉ có quyền **customer** (khách hàng). Để một tài khoản xem được trang `admin.html`:

1. Đăng ký thử một tài khoản bằng chính app (vào trang chủ → Đăng ký).
2. Vào Firebase Console → Firestore Database → collection **users** → mở đúng document (uid) của tài khoản đó.
3. Sửa field `role` từ `"customer"` thành `"staff"` hoặc `"admin"` → Save.
4. Đăng xuất/đăng nhập lại trên app — giờ tài khoản đó vào được `admin.html`.

## 5. Cài lên điện thoại

Mở địa chỉ web trên **Chrome (Android)** hoặc **Safari (iPhone)** → chọn menu trình duyệt → **"Thêm vào Màn hình chính" / "Add to Home Screen"**. App sẽ có icon riêng và mở toàn màn hình như app thường.

---

## 6. Quản lý bảo mật thông tin — checklist

- [x] **Không commit khoá bí mật thật sự.** `firebaseConfig` trong bước 2 không phải bí mật cần giấu (đây là khoá "public" theo thiết kế của Firebase) — quyền truy cập được kiểm soát bởi `firestore.rules`, không phải bằng cách giấu khoá. Tuyệt đối không thêm các khoá dạng "service account" / "private key" (dạng file `.json` tải từ Project Settings → Service Accounts) vào repo này — loại khoá đó có toàn quyền và không bao giờ được đưa lên GitHub công khai.
- [x] **`firestore.rules` đã publish** — nếu quên bước này, Firestore ở chế độ Production sẽ mặc định chặn hết (an toàn), nhưng nếu bạn từng bật "Test mode" thì dữ liệu sẽ mở toang cho bất kỳ ai — kiểm tra lại tab Rules trước khi đưa app cho khách dùng thật.
- [x] **Phân quyền theo vai trò**: khách hàng chỉ đọc/sửa hồ sơ và lịch hẹn của chính mình; chỉ staff/admin xem được toàn bộ. Đã cấu hình sẵn trong `firestore.rules`.
- [x] **HTTPS mặc định** ở cả GitHub Pages và Firebase — không cần cấu hình thêm.
- [x] **Không tự lưu thông tin thanh toán.** Nếu sau này thu tiền online, dùng cổng trung gian (VNPay, MoMo, PayOS…), không thêm ô nhập số thẻ vào app này.
- [ ] **Sao lưu định kỳ**: Firebase Console → Firestore → có thể bật xuất dữ liệu tự động (Export) sang Cloud Storage theo lịch, nên bật khi có dữ liệu khách hàng thật.
- [ ] **Chính sách bảo mật & sự đồng ý của khách hàng**: theo Luật Bảo vệ dữ liệu cá nhân 2025 (hiệu lực từ 1/1/2026), app cần có mục "Chính sách bảo mật" và khách hàng cần đồng ý trước khi cung cấp thông tin. Nên thêm một trang tĩnh nêu rõ: thu thập dữ liệu gì, dùng để làm gì, lưu ở đâu (Firebase — máy chủ nước ngoài), khách hàng có quyền yêu cầu xoá dữ liệu của mình.
- [ ] Nếu trung tâm phát triển lớn (nhiều khách hàng, xử lý dữ liệu sức khoẻ thú cưng ở quy mô lớn), nên tham khảo luật sư/đơn vị tư vấn để đảm bảo tuân thủ đầy đủ nghĩa vụ về bảo vệ dữ liệu cá nhân, đặc biệt nếu vượt ngưỡng miễn trừ dành cho doanh nghiệp nhỏ.

## 7. Giới hạn cần biết

- Gói Firebase miễn phí (Spark) cho hàng chục nghìn lượt đọc/ghi Firestore mỗi ngày và 1 GB lưu trữ — đủ dùng thoải mái cho một trung tâm quy mô vừa. Xem số liệu mới nhất tại `firebase.google.com/pricing`.
- Đăng nhập bằng **số điện thoại (OTP)** không miễn phí trên Firebase — bản mẫu này dùng đăng nhập bằng **email + mật khẩu** để giữ chi phí bằng 0.
- Repo GitHub phải để **Public** thì GitHub Pages mới miễn phí — mã giao diện sẽ công khai (bình thường, vì đây chỉ là giao diện, không chứa dữ liệu khách hàng).

## 8. Muốn mở rộng thêm?

- Gắn tên miền riêng: Settings → Pages → Custom domain.
- Gửi email xác nhận lịch hẹn: dùng Firebase Cloud Functions (cần chuyển sang gói Blaze trả-theo-dùng, vẫn có mức miễn phí).
- Đóng gói thành app thật trên Play Store/App Store: dùng Capacitor để bọc lại PWA này mà không cần viết lại code.

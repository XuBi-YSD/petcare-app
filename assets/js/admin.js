// ============================================================
// admin.js — bảng điều khiển cho nhân viên / quản trị viên
// Chỉ những tài khoản có role = "staff" hoặc "admin" (đặt thủ công
// trong Firestore) mới xem được trang này — xem requireRole trong auth.js
// và quyền tương ứng trong firestore.rules.
// ============================================================
import { db, collection, doc, updateDoc, orderBy, query, onSnapshot } from "./firebase-config.js";
import { requireRole } from "./auth.js";

const STATUS_LABEL = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  completed: "Hoàn tất",
  cancelled: "Đã huỷ",
};

requireRole(["staff", "admin"], (user, profile) => {
  document.getElementById("adminGate").classList.remove("hidden");
  document.getElementById("adminWhoami").textContent = `Đăng nhập với vai trò: ${profile.role}`;

  const q = query(collection(db, "appointments"), orderBy("date", "desc"));
  onSnapshot(q, (snap) => {
    const tbody = document.getElementById("apptTableBody");
    if (snap.empty) {
      tbody.innerHTML = `<tr><td colspan="6" class="help-text">Chưa có lịch hẹn nào.</td></tr>`;
      return;
    }
    tbody.innerHTML = snap.docs.map((d) => {
      const a = d.data();
      const options = Object.keys(STATUS_LABEL).map(
        (s) => `<option value="${s}" ${a.status === s ? "selected" : ""}>${STATUS_LABEL[s]}</option>`
      ).join("");
      return `
        <tr>
          <td>${a.date || ""}<br><span class="record-id">${a.time || ""}</span></td>
          <td>${a.ownerName || ""}</td>
          <td>${a.petName || ""}</td>
          <td>${a.service || ""}</td>
          <td>${a.note ? a.note : "—"}</td>
          <td><select data-id="${d.id}" class="statusSelect">${options}</select></td>
        </tr>`;
    }).join("");

    tbody.querySelectorAll(".statusSelect").forEach((sel) => {
      sel.addEventListener("change", () => {
        updateDoc(doc(db, "appointments", sel.dataset.id), { status: sel.value });
      });
    });
  });
});

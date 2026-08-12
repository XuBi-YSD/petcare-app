// ============================================================
// booking.js — đặt lịch hẹn (chỉ dùng được sau khi đăng nhập)
// ============================================================
import {
  db, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp,
} from "./firebase-config.js";
import { requireAuth } from "./auth.js";

const STATUS_LABEL = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  completed: "Hoàn tất",
  cancelled: "Đã huỷ",
};

requireAuth((user, profile) => {
  document.getElementById("bookingGate").classList.remove("hidden");
  listenMyPets(user.uid);
  listenMyAppointments(user.uid);

  document.getElementById("bookingForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("bookingMsg");
    const petSelect = document.getElementById("petSelect");
    const payload = {
      uid: user.uid,
      ownerName: profile?.name || user.email,
      petId: petSelect.value || null,
      petName: petSelect.selectedOptions[0]?.textContent || document.getElementById("petNameFallback").value,
      service: document.getElementById("service").value,
      date: document.getElementById("date").value,
      time: document.getElementById("time").value,
      note: document.getElementById("note").value,
      status: "pending",
      createdAt: serverTimestamp(),
    };
    try {
      await addDoc(collection(db, "appointments"), payload);
      msg.textContent = "Đặt lịch thành công! Trung tâm sẽ xác nhận sớm.";
      msg.className = "form-msg show success";
      e.target.reset();
    } catch (err) {
      msg.textContent = "Có lỗi xảy ra: " + err.message;
      msg.className = "form-msg show error";
    }
  });
});

function listenMyPets(uid) {
  const petSelect = document.getElementById("petSelect");
  const q = collection(db, "users", uid, "pets");
  onSnapshot(q, (snap) => {
    if (snap.empty) {
      petSelect.innerHTML = `<option value="">-- Bạn chưa có hồ sơ thú cưng --</option>`;
      document.getElementById("petNameFallback").closest(".field").classList.remove("hidden");
      return;
    }
    petSelect.innerHTML = snap.docs
      .map((d) => `<option value="${d.id}">${d.data().name}</option>`)
      .join("");
  });
}

function listenMyAppointments(uid) {
  const list = document.getElementById("myAppointments");
  const q = query(collection(db, "appointments"), where("uid", "==", uid), orderBy("date", "desc"));
  onSnapshot(q, (snap) => {
    if (snap.empty) {
      list.innerHTML = `<p class="help-text">Chưa có lịch hẹn nào.</p>`;
      return;
    }
    list.innerHTML = snap.docs.map((d) => {
      const a = d.data();
      return `
        <div class="record">
          <div>
            <strong>${a.petName || "Thú cưng"}</strong> — ${a.service}
            <div class="record-id">${a.date || ""} ${a.time || ""}</div>
          </div>
          <span class="badge badge-${a.status}">${STATUS_LABEL[a.status] || a.status}</span>
        </div>`;
    }).join("");
  });
}

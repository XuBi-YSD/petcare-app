// ============================================================
// profile.js — hồ sơ thú cưng của khách hàng (CRUD)
// ============================================================
import {
  db, collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp,
} from "./firebase-config.js";
import { requireAuth } from "./auth.js";

requireAuth((user) => {
  document.getElementById("profileGate").classList.remove("hidden");
  const petsRef = collection(db, "users", user.uid, "pets");

  onSnapshot(petsRef, (snap) => {
    const list = document.getElementById("petList");
    if (snap.empty) {
      list.innerHTML = `<p class="help-text">Chưa có hồ sơ thú cưng nào. Thêm hồ sơ đầu tiên bên dưới.</p>`;
      return;
    }
    list.innerHTML = snap.docs.map((d) => {
      const p = d.data();
      return `
        <div class="record">
          <div>
            <strong>${p.name}</strong> · ${p.species}${p.breed ? " · " + p.breed : ""}
            <div class="record-id">${p.birthYear ? "Sinh năm " + p.birthYear : ""}</div>
            ${p.notes ? `<p class="help-text" style="margin-top:6px">${p.notes}</p>` : ""}
          </div>
          <button class="btn btn-ghost btn-sm" data-id="${d.id}">Xoá</button>
        </div>`;
    }).join("");

    list.querySelectorAll("button[data-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (confirm("Xoá hồ sơ thú cưng này?")) {
          deleteDoc(doc(db, "users", user.uid, "pets", btn.dataset.id));
        }
      });
    });
  });

  document.getElementById("petForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("petMsg");
    try {
      await addDoc(petsRef, {
        name: document.getElementById("petName").value,
        species: document.getElementById("petSpecies").value,
        breed: document.getElementById("petBreed").value,
        birthYear: document.getElementById("petBirthYear").value,
        notes: document.getElementById("petNotes").value,
        createdAt: serverTimestamp(),
      });
      msg.textContent = "Đã lưu hồ sơ thú cưng.";
      msg.className = "form-msg show success";
      e.target.reset();
    } catch (err) {
      msg.textContent = "Có lỗi xảy ra: " + err.message;
      msg.className = "form-msg show error";
    }
  });
});

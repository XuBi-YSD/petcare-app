// ============================================================
// auth.js — đăng ký / đăng nhập / đăng xuất + bảo vệ trang theo vai trò
//
// Vai trò (role) được lưu trong Firestore: users/{uid}.role
//   "customer" (mặc định khi đăng ký) | "staff" | "admin"
// Muốn cấp quyền staff/admin cho ai: vào Firebase Console → Firestore →
// collection "users" → mở document của người đó → sửa field role.
// ============================================================
import {
  auth, db, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, updateProfile,
  doc, setDoc, getDoc, serverTimestamp,
} from "./firebase-config.js";

let currentUser = null;
let currentProfile = null;

function renderHeaderAuth(user, profile) {
  const el = document.getElementById("authArea");
  if (!el) return;
  if (user) {
    el.innerHTML = `
      <span>Xin chào, ${profile?.name || user.email}</span>
      <button id="logoutBtn" class="btn btn-outline btn-sm">Đăng xuất</button>
    `;
    document.getElementById("logoutBtn").addEventListener("click", () => signOut(auth));
  } else {
    el.innerHTML = `<a href="index.html#auth" class="btn btn-outline btn-sm">Đăng nhập</a>`;
  }
}

async function fetchProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

// Theo dõi trạng thái đăng nhập cho MỌI trang (dùng để hiện tên trong header)
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  currentProfile = user ? await fetchProfile(user.uid) : null;
  renderHeaderAuth(user, currentProfile);
  document.dispatchEvent(new CustomEvent("authready", { detail: { user, profile: currentProfile } }));
});

// ---------- Đăng ký ----------
async function registerCustomer({ email, password, name, phone }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await setDoc(doc(db, "users", cred.user.uid), {
    name, phone, role: "customer", createdAt: serverTimestamp(),
  });
  return cred.user;
}

// ---------- Đăng nhập ----------
async function loginCustomer({ email, password }) {
  return signInWithEmailAndPassword(auth, email, password);
}

// ---------- Bảo vệ trang: yêu cầu đã đăng nhập ----------
// callback(user, profile) chỉ chạy khi đã xác thực xong; nếu chưa đăng
// nhập sẽ tự chuyển hướng về trang chủ.
function requireAuth(callback, { redirectTo = "index.html" } = {}) {
  document.addEventListener("authready", (e) => {
    const { user, profile } = e.detail;
    if (!user) {
      window.location.href = redirectTo;
      return;
    }
    callback(user, profile);
  }, { once: true });
}

// ---------- Bảo vệ trang: yêu cầu vai trò cụ thể (vd: admin/staff) ----------
function requireRole(allowedRoles, callback, { redirectTo = "index.html" } = {}) {
  requireAuth((user, profile) => {
    if (!profile || !allowedRoles.includes(profile.role)) {
      window.location.href = redirectTo;
      return;
    }
    callback(user, profile);
  }, { redirectTo });
}

export { registerCustomer, loginCustomer, requireAuth, requireRole, fetchProfile };

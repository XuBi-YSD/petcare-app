// ============================================================
// layout.js — chèn header/footer dùng chung cho mọi trang
// (giữ menu điều hướng ở một chỗ duy nhất, dễ sửa)
// ============================================================
const page = location.pathname.split("/").pop() || "index.html";

const NAV = [
  { href: "index.html", label: "Trang chủ" },
  { href: "booking.html", label: "Đặt lịch hẹn" },
  { href: "profile.html", label: "Hồ sơ thú cưng" },
  { href: "admin.html", label: "Quản trị" },
];

document.getElementById("site-header").innerHTML = `
  <div class="wrap">
    <a class="brand" href="index.html">
      <img src="assets/icons/icon-192.png" alt="" />
      Sổ Tay Thú Cưng
    </a>
    <nav class="tabs">
      ${NAV.map(n => `<a href="${n.href}" class="${page === n.href ? "active" : ""}">${n.label}</a>`).join("")}
    </nav>
    <div id="authArea"></div>
  </div>
`;

document.getElementById("site-footer").innerHTML = `
  <div class="wrap row-between">
    <span>© ${new Date().getFullYear()} Trung tâm chăm sóc thú cưng — Sổ Tay Thú Cưng</span>
    <span class="mono">made with a paw stamp 🐾</span>
  </div>
`;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const pw = document.getElementById("id_password");
  if (!pw) return;

  const MAX_LEN = 16;
  pw.setAttribute("maxlength", String(MAX_LEN));

  // wrap
  const wrap = document.createElement("div");
  wrap.className = "password-wrapper";
  pw.parentNode.insertBefore(wrap, pw);
  wrap.appendChild(pw);

  // toggle
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "password-toggle";
  toggle.textContent = "Show";
  wrap.appendChild(toggle);

  let visible = false;
  toggle.addEventListener("click", () => {
    visible = !visible;
    pw.type = visible ? "text" : "password";
    toggle.textContent = visible ? "Hide" : "Show";
  });

  // hard limit (paste safe)
  pw.addEventListener("input", () => {
    if (pw.value.length > MAX_LEN) pw.value = pw.value.slice(0, MAX_LEN);
  });
});
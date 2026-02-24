window.addEventListener("DOMContentLoaded", () => {
  const pw = document.getElementById("id_password");
  if (!pw) return;

  const p = pw.closest("p");
  if (!p) return;

  // створюємо блок під полем
  const wrap = document.createElement("div");
  wrap.className = "field__typed";
  wrap.hidden = true;

  wrap.innerHTML = `
    <span class="field__typed-label">You typed:</span>
    <span class="field__typed-value"></span>
    <button type="button" class="field__typed-toggle">Hide</button>
  `;

  p.appendChild(wrap);

  const valueEl = wrap.querySelector(".field__typed-value");
  const toggle = wrap.querySelector(".field__typed-toggle");

  let show = true;

  function render() {
    const v = pw.value || "";

    if (!v) {
      wrap.hidden = true;
      valueEl.textContent = "";
      return;
    }

    wrap.hidden = false;

    if (show) {
      valueEl.textContent = v;
      toggle.textContent = "Hide";
    } else {
      valueEl.textContent = "••••••••";
      toggle.textContent = "Show";
    }
  }

  pw.addEventListener("input", render);

  toggle.addEventListener("click", () => {
    show = !show;
    render();
  });

  render();
});
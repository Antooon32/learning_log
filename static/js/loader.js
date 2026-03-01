(() => {
  const overlay = document.getElementById("page-loader");
  if (!overlay) return;

  const show = () => overlay.classList.add("is-active");
  const hide = () => overlay.classList.remove("is-active");

  show();

  window.addEventListener("load", () => {
    setTimeout(hide, 150);
  });


  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    if (
      href.startsWith("#") ||
      link.target === "_blank" ||
      e.ctrlKey || e.metaKey || e.shiftKey || e.altKey
    ) return;

    show();
  });

  document.addEventListener("submit", () => show());
})();
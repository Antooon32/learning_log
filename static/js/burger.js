document.addEventListener("DOMContentLoaded", () => {
  const burgerToggle = document.getElementById("burgerToggle");
  const navContent = document.getElementById("navContent");

  if (!burgerToggle || !navContent) return;

  burgerToggle.addEventListener("click", () => {
    navContent.classList.toggle("is-open");
    burgerToggle.classList.toggle("is-active");
  });
});
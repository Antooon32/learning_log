document.addEventListener("DOMContentLoaded", () => {
  console.log("loader init");

  const loader = document.getElementById("appLoader");
  if (!loader) {
    console.warn("No #appLoader found");
    return;
  }

  // Перевіримо, чи CSS взагалі є (щоб не було "клас додався, але не сховалось")
  const test = getComputedStyle(loader).position;
  console.log("loader position:", test);

  const hide = () => {
    console.log("hide loader");
    loader.classList.add("loader--hide");
    setTimeout(() => loader.remove(), 500);
  };

  // Закриваємо завжди через 2 секунди
  setTimeout(hide, 2000);

  // Додатково — якщо анімація text закінчилась, теж закриваємо
  const inkText = loader.querySelector(".ink-text");
  if (inkText) {
    inkText.addEventListener("animationend", () => setTimeout(hide, 200));
  }
});

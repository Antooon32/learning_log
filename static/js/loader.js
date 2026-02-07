document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("appLoader");
  const wrap = document.querySelector(".logo-wrap");
  const lettersBox = document.querySelector(".letters");
  const letters = document.querySelectorAll(".ch");

  if (!loader || !wrap || !letters.length) return;

  /* === calculate final positions === */
  lettersBox.style.visibility = "hidden";

  requestAnimationFrame(() => {
    const totalWidth = lettersBox.getBoundingClientRect().width;
    let x = -totalWidth / 2;

    letters.forEach((el, i) => {
      const w = el.getBoundingClientRect().width;
      const cx = x + w / 2;

      el.style.setProperty("--tx", `${cx}px`);
      el.style.setProperty("--ty", i % 2 === 0 ? "-120px" : "120px");

      x += w;
    });

    lettersBox.style.visibility = "visible";

    /* === TIMELINE === */

    // 1) text fades out
    setTimeout(() => {
      wrap.classList.add("phase-text-out");
    }, 900);

    // 2) L appears and spins
    setTimeout(() => {
      wrap.classList.add("phase-L");
    }, 1800);

    // 3) letters burst from L
    setTimeout(() => {
      wrap.classList.add("phase-burst");
    }, 3900);

    // 4) close loader
    setTimeout(() => {
      loader.classList.add("loader--hide");
      setTimeout(() => loader.remove(), 400);
    }, 5600);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  if (!form) return;

  const username = document.getElementById("id_username");
  const pw1 = document.getElementById("id_password1");
  const pw2 = document.getElementById("id_password2");
  const btn = document.getElementById("registerBtn");

  const usernameError = document.getElementById("usernameError");
  const pw1Error = document.getElementById("password1Error");
  const pw2Error = document.getElementById("password2Error");

  const rulesWrap = document.getElementById("pwRules");
  const strengthWrap = document.getElementById("strengthWrap");
  const strengthFill = document.getElementById("strengthFill");
  const strengthText = document.getElementById("strengthText");

  if (!username || !pw1 || !pw2 || !btn) return;

  const USERNAME_RE = /^[\w.@+-]+$/;
  const checkUrl = form.dataset.checkUsernameUrl || "";

  const touched = { u: false, p1: false, p2: false };

  // async username check
  let usernameAvailable = null; // null=unknown/loading, true=available, false=taken
  let debounceTimer = null;
  let abortCtrl = null;

  function normalize(v) {
    return (v || "").trim();
  }

  function fieldBox(input) {
    return input.closest(".field");
  }

  function setState(input, errorEl, message, show) {
    const box = fieldBox(input);
    if (!box || !errorEl) return;

    if (!show) {
      errorEl.textContent = "";
      box.classList.remove("is-invalid", "is-valid");
      return;
    }

    if (message) {
      errorEl.textContent = message;
      box.classList.add("is-invalid");
      box.classList.remove("is-valid");
    } else {
      errorEl.textContent = "";
      box.classList.remove("is-invalid");
      box.classList.add("is-valid");
    }
  }

  // ------- Show/Hide inside input (pw1, pw2) -------
  function attachPasswordToggle(input) {
    if (!input) return;
    const p = input.closest("p"); // якщо колись буде as_p
    const field = input.closest(".field") || p || input.parentElement;

    // already wrapped?
    if (field.querySelector(".password-wrapper")) return;

    const wrap = document.createElement("div");
    wrap.className = "password-wrapper";
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "password-toggle";
    toggle.textContent = "Show";
    wrap.appendChild(toggle);

    let visible = false;

    toggle.addEventListener("click", () => {
      visible = !visible;
      input.type = visible ? "text" : "password";
      toggle.textContent = visible ? "Hide" : "Show";
    });
  }

  attachPasswordToggle(pw1);
  attachPasswordToggle(pw2);

  // ---------- Username ----------
  function validateUsername() {
    const v = normalize(username.value);

    if (!v) return "Username is required.";
    if (v.length < 3) return "Username is too short (min 3 characters).";
    if (v.length > 150) return "Username must be 150 characters or fewer.";
    if (!USERNAME_RE.test(v)) return "Use only letters, digits and @/./+/-/_.";
    if (touched.u && usernameAvailable === false) return "This username is already taken.";

    return "";
  }

  function baseUsernameMessage() {
    const v = normalize(username.value);

    if (!v) return "Username is required.";
    if (v.length < 3) return "Username is too short (min 3 characters).";
    if (v.length > 150) return "Username must be 150 characters or fewer.";
    if (!USERNAME_RE.test(v)) return "Use only letters, digits and @/./+/-/_.";
    return "";
  }

  function scheduleUsernameCheck() {
    if (!checkUrl) return;

    const baseMsg = baseUsernameMessage();
    if (baseMsg) {
      usernameAvailable = null;
      return;
    }

    clearTimeout(debounceTimer);
    const v = normalize(username.value);
    debounceTimer = setTimeout(() => runUsernameCheck(v), 400);
  }

  async function runUsernameCheck(v) {
    if (abortCtrl) abortCtrl.abort();
    abortCtrl = new AbortController();

    usernameAvailable = null;

    const box = fieldBox(username);
    box && box.classList.add("is-checking");

    try {
      const url = new URL(checkUrl, window.location.origin);
      url.searchParams.set("username", v);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: abortCtrl.signal,
      });

      if (!res.ok) throw new Error("Bad response");

      const data = await res.json();
      usernameAvailable = data && data.available === true;
    } catch (e) {
      if (e.name !== "AbortError") usernameAvailable = null;
    } finally {
      box && box.classList.remove("is-checking");
      updateAll();
    }
  }

  // ---------- Password rules UI ----------
  function passwordRules(pw, uname) {
    const u = normalize(uname).toLowerCase();
    const p = pw || "";
    return {
      len: p.length >= 8,
      notNumeric: p.length ? !/^\d+$/.test(p) : false,
      mix: /[A-Za-z]/.test(p) && /\d/.test(p),
      notSimilar: u ? !p.toLowerCase().includes(u) : true,
    };
  }

  function renderRules(pw) {
    if (!rulesWrap) return;
    if (!touched.p1 || !pw) {
      rulesWrap.hidden = true;
      return;
    }

    rulesWrap.hidden = false;

    const r = passwordRules(pw, username.value);
    ["len", "notNumeric", "mix", "notSimilar"].forEach((key) => {
      const item = rulesWrap.querySelector(`[data-rule="${key}"]`);
      if (!item) return;
      item.classList.toggle("is-ok", !!r[key]);
      item.classList.toggle("is-bad", !r[key]);
    });
  }

  // ---------- Strength ----------
  function scorePassword(pw) {
    let s = 0;
    if (!pw) return 0;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    if (/[a-z]/.test(pw)) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return Math.min(s, 6);
  }

  function renderStrength(pw) {
    if (!strengthWrap || !strengthFill || !strengthText) return;
    if (!touched.p1 || !pw) {
      strengthWrap.hidden = true;
      return;
    }

    strengthWrap.hidden = false;

    const score = scorePassword(pw);
    const percent = Math.round((score / 6) * 100);
    strengthFill.style.width = `${percent}%`;

    let label = "Weak";
    if (score >= 5) label = "Strong";
    else if (score >= 3) label = "Medium";

    strengthText.textContent = `Strength: ${label}`;
  }

  // ---------- Password validation ----------
  function validatePw1() {
    const u = normalize(username.value);
    const p = pw1.value || "";

    if (!p) return "Password is required.";
    if (p.length < 8) return "Password must be at least 8 characters.";
    if (/^\d+$/.test(p)) return "Password can’t be entirely numeric.";
    if (u && p.toLowerCase().includes(u.toLowerCase())) return "Password is too similar to username.";
    if (!(/[A-Za-z]/.test(p) && /\d/.test(p))) return "Use a mix of letters and numbers.";

    return "";
  }

  function validatePw2() {
    const a = pw1.value || "";
    const b = pw2.value || "";

    if (!b) return "Password confirmation is required.";
    if (a !== b) return "Passwords do not match.";

    return "";
  }

  function updateAll() {
    const uMsg = validateUsername();
    const p1Msg = validatePw1();
    const p2Msg = validatePw2();

    setState(username, usernameError, uMsg, touched.u);
    setState(pw1, pw1Error, p1Msg, touched.p1);
    setState(pw2, pw2Error, p2Msg, touched.p2);

    const pw = pw1.value || "";
    renderRules(pw);
    renderStrength(pw);

    const waitingForCheck = !!checkUrl && touched.u && !uMsg && usernameAvailable === null;
    btn.disabled = !!(uMsg || p1Msg || p2Msg || waitingForCheck);
  }

  // Events
  username.addEventListener("input", () => {
    touched.u = true;
    usernameAvailable = null;
    updateAll();
    scheduleUsernameCheck();
  });

  username.addEventListener("blur", () => {
    touched.u = true;
    updateAll();
    scheduleUsernameCheck();
  });

  pw1.addEventListener("input", () => {
    touched.p1 = true;
    if ((pw2.value || "").length > 0) touched.p2 = true;
    updateAll();
  });

  pw2.addEventListener("input", () => {
    touched.p2 = true;
    updateAll();
  });

  form.addEventListener("submit", (e) => {
    touched.u = true;
    touched.p1 = true;
    touched.p2 = true;
    updateAll();
    if (btn.disabled) e.preventDefault();
  });

  updateAll();
});
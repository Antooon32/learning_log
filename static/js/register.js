(() => {
    const $ = (sel, root = document) => root.querySelector(sel);

    const form = $(".register__form");
    if (!form) return;

    const username = $("#id_username");
    const pw1 = $("#id_password1");
    const pw2 = $("#id_password2");

    function ensureFieldUI(input, name, extraBuilder) {
        const p = input?.closest("p");
        if (!p) return null;

        if (!p.classList.contains("field")) p.classList.add("field");

        let status = $(`.field__status[data-for="${name}"]`, p);
        if (!status) {
            status = document.createElement("div");
            status.className = "field__status";
            status.setAttribute("data-for", name);
            status.setAttribute("aria-live", "polite");
            status.innerHTML = `
        <span class="status status--ok is-hidden" data-ok>✓ OK</span>
        <span class="status status--bad is-hidden" data-bad>✕ Fix</span>
      `;
            p.appendChild(status);
        }

        let errors = $(`ul.field__errors[data-for="${name}"]`, p);
        if (!errors) {
            errors = document.createElement("ul");
            errors.className = "field__errors is-hidden";
            errors.setAttribute("data-for", name);
            p.appendChild(errors);
        }

        if (typeof extraBuilder === "function") extraBuilder(p);

        return { p, status, errors };
    }

    function wrapPasswordWithToggle(p) {
        const input = $("input", p);
        if (!input) return;

        let wrap = $(".password", p);
        if (!wrap) {
            wrap = document.createElement("div");
            wrap.className = "password";
            input.parentNode.insertBefore(wrap, input);
            wrap.appendChild(input);

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "password__toggle";
            btn.textContent = "👁";
            btn.setAttribute("aria-label", "Show password");
            wrap.appendChild(btn);

            btn.addEventListener("click", () => {
                const isPw = input.type === "password";
                input.type = isPw ? "text" : "password";
                btn.setAttribute("aria-label", isPw ? "Hide password" : "Show password");
            });
        }
    }

    function passwordExtrasBuilder(p) {
        wrapPasswordWithToggle(p);

        if (!$(".reveal", p)) {
            const reveal = document.createElement("div");
            reveal.className = "reveal";
            reveal.innerHTML = `
        <div class="reveal__bar">
          <span class="reveal__text" id="pw1-reveal"></span>
        </div>
      `;
            p.appendChild(reveal);
        }

        if (!$(".strength", p)) {
            const strength = document.createElement("div");
            strength.className = "strength";
            strength.innerHTML = `
        <div class="strength__track">
          <div class="strength__fill" id="pw-strength-fill"></div>
        </div>
        <div class="strength__label" id="pw-strength-label">Strength: —</div>
      `;
            p.appendChild(strength);
        }

        if (!$(".rules", p)) {
            const rules = document.createElement("div");
            rules.className = "rules";
            rules.id = "pw-rules";
            rules.innerHTML = `
        <div class="rules__title">Password rules:</div>
        <ul class="rules__list">
          <li data-rule="len">At least 8 characters</li>
          <li data-rule="upper">Has uppercase letter</li>
          <li data-rule="lower">Has lowercase letter</li>
          <li data-rule="digit">Has a number</li>
          <li data-rule="special">Has a special character</li>
          <li data-rule="notnumeric">Not entirely numeric</li>
          <li data-rule="common">Not a common password</li>
        </ul>
      `;
            p.appendChild(rules);
        }
    }

    const uiUsername = ensureFieldUI(username, "username");
    const uiPw1 = ensureFieldUI(pw1, "password1", passwordExtrasBuilder);
    const uiPw2 = ensureFieldUI(pw2, "password2", (p) => wrapPasswordWithToggle(p));

    const revealText = $("#pw1-reveal");
    const strengthFill = $("#pw-strength-fill");
    const strengthLabel = $("#pw-strength-label");
    const rulesBox = $("#pw-rules");

    const common = new Set([
        "password", "12345678", "qwerty", "11111111", "letmein", "admin", "welcome", "iloveyou", "123456789", "00000000"
    ]);

    function setErrors(ui, messages) {
        if (!ui) return;
        ui.errors.innerHTML = "";
        if (!messages || messages.length === 0) {
            ui.errors.classList.add("is-hidden");
            return;
        }
        ui.errors.classList.remove("is-hidden");
        for (const msg of messages) {
            const li = document.createElement("li");
            li.textContent = msg;
            ui.errors.appendChild(li);
        }
    }

    function setStatus(ui, ok) {
        if (!ui) return;
        const okEl = $('[data-ok]', ui.status);
        const badEl = $('[data-bad]', ui.status);
        okEl.classList.toggle("is-hidden", !ok);
        badEl.classList.toggle("is-hidden", ok);

        ui.p.classList.toggle("is-valid", ok);
        ui.p.classList.toggle("is-invalid", !ok);
    }

    function validateUsername() {
        const v = (username.value || "").trim();
        const errors = [];
        if (!v) errors.push("This field is required.");
        if (v.length > 150) errors.push("Must be 150 characters or fewer.");
        if (v && !/^[\w.@+-]+$/.test(v)) errors.push("Letters, digits and @/./+/-/_ only.");

        const ok = errors.length === 0;
        setErrors(uiUsername, errors);
        setStatus(uiUsername, ok);
        return ok;
    }

    function passwordRules(pw) {
        return {
            len: pw.length >= 8,
            upper: /[A-Z]/.test(pw),
            lower: /[a-z]/.test(pw),
            digit: /\d/.test(pw),
            special: /[^A-Za-z0-9]/.test(pw),
            notnumeric: pw.length > 0 && !/^\d+$/.test(pw),
            common: pw.length > 0 && !common.has(pw.toLowerCase()),
        };
    }

    function updateRulesUI(r) {
        if (!rulesBox) return;
        rulesBox.querySelectorAll("li[data-rule]").forEach(li => {
            const key = li.getAttribute("data-rule");
            const pass = !!r[key];
            li.classList.toggle("is-pass", pass);
            li.classList.toggle("is-fail", !pass);
        });
    }

    function strength(r) {
        let score = 0;
        if (r.len) score += 2;
        if (r.lower) score += 1;
        if (r.upper) score += 1;
        if (r.digit) score += 1;
        if (r.special) score += 2;
        if (r.notnumeric) score += 1;
        if (r.common) score += 1;

        const pct = Math.max(0, Math.min(100, Math.round((score / 9) * 100)));

        let level = "weak";
        let label = "Weak";
        if (pct >= 35 && pct < 65) { level = "medium"; label = "Medium"; }
        if (pct >= 65) { level = "strong"; label = pct >= 85 ? "Very strong" : "Strong"; }

        return { pct, level, label };
    }

    function validatePw1() {
        const pw = pw1.value || "";
        if (revealText) revealText.textContent = pw;

        const r = passwordRules(pw);
        updateRulesUI(r);

        const s = strength(r);
        if (strengthFill) {
            strengthFill.style.width = `${s.pct}%`;
            strengthFill.classList.remove("weak", "medium", "strong");
            strengthFill.classList.add(s.level);
        }
        if (strengthLabel) strengthLabel.textContent = `Strength: ${s.label}`;

        const errors = [];
        if (!pw) errors.push("This field is required.");
        if (pw && !r.len) errors.push("Your password must contain at least 8 characters.");
        if (pw && !r.common) errors.push("Your password can’t be a commonly used password.");
        if (pw && !r.notnumeric) errors.push("Your password can’t be entirely numeric.");

        const ok = errors.length === 0 && s.pct >= 55;
        setErrors(uiPw1, errors);
        setStatus(uiPw1, ok);
        return ok;
    }

    function validatePw2() {
        const a = pw1.value || "";
        const b = pw2.value || "";
        const errors = [];
        if (!b) errors.push("This field is required.");
        if (b && a !== b) errors.push("The two password fields didn’t match.");

        const ok = errors.length === 0;
        setErrors(uiPw2, errors);
        setStatus(uiPw2, ok);
        return ok;
    }

    username?.addEventListener("input", validateUsername);
    pw1?.addEventListener("input", () => { validatePw1(); validatePw2(); });
    pw2?.addEventListener("input", validatePw2);

    form.addEventListener("submit", (e) => {
        const ok = (validateUsername() & validatePw1() & validatePw2());
        if (!ok) e.preventDefault();
    });

    validateUsername();
    validatePw1();
    validatePw2();
})();
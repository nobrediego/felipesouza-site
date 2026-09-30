"use strict";

const header = document.querySelector("#site-header");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-nav");

function setMenu(open) {
  if (!navigation || !menuButton) return;
  navigation.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  document.body.classList.toggle("menu-open", open);
}

menuButton?.addEventListener("click", () => {
  setMenu(!navigation.classList.contains("open"));
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

document.addEventListener("click", (event) => {
  if (!navigation || !menuButton) return;
  const clickedOutside = !navigation.contains(event.target) && !menuButton.contains(event.target);
  if (clickedOutside && navigation.classList.contains("open")) setMenu(false);
});

function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", () => {
  updateHeader();
  const progress = document.querySelector(".reading-progress");
  if (progress) {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = available > 0 ? (window.scrollY / available) * 100 : 0;
    progress.style.width = `${Math.min(percentage, 100)}%`;
  }
}, { passive: true });

updateHeader();

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      entry.target.style.setProperty("--delay", `${delay}ms`);
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -35px" });

revealItems.forEach((item) => revealObserver.observe(item));

const counterElements = document.querySelectorAll("[data-counter]");
if (counterElements.length) {
  const countersObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.counter);
      const duration = 1200;
      const startTime = performance.now();

      function animateCounter(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.floor(target * eased);
        if (progress < 1) window.requestAnimationFrame(animateCounter);
      }

      window.requestAnimationFrame(animateCounter);
      observer.unobserve(element);
    });
  }, { threshold: 0.65 });

  counterElements.forEach((counter) => countersObserver.observe(counter));
}

if (window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".project-card, .news-card, .proposta-card, .archive-card, .realizacao-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
      card.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
    });
  });

  const portrait = document.querySelector(".portrait-shell");
  const heroVisual = document.querySelector(".hero-visual");

  heroVisual?.addEventListener("pointermove", (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 4;
    const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -3;
    portrait.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  heroVisual?.addEventListener("pointerleave", () => {
    portrait.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
  });
}

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  const phoneInput = document.querySelector("#phone");
  const privacyInput = contactForm.querySelector("[name='privacy']");
  const privacyError = contactForm.querySelector(".privacy-error");
  const formStatus = contactForm.querySelector(".form-status");

  phoneInput?.addEventListener("input", () => {
    const digits = phoneInput.value.replace(/\D/g, "").slice(0, 11);
    let formatted = digits;
    if (digits.length > 2) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length > 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    phoneInput.value = formatted;
  });

  const validators = {
    name: (value) => value.trim().length >= 3 ? "" : "Informe seu nome completo.",
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Informe um e-mail válido.",
    subject: (value) => value ? "" : "Selecione um assunto.",
    message: (value) => value.trim().length >= 10 ? "" : "Escreva uma mensagem com pelo menos 10 caracteres."
  };

  function validateField(field) {
    const validator = validators[field.name];
    if (!validator) return true;
    const error = validator(field.value);
    const fieldWrap = field.closest(".field");
    fieldWrap.classList.toggle("invalid", Boolean(error));
    fieldWrap.querySelector(".field-error").textContent = error;
    return !error;
  }

  Object.keys(validators).forEach((name) => {
    const field = contactForm.elements[name];
    field?.addEventListener("blur", () => validateField(field));
    field?.addEventListener("input", () => {
      if (field.closest(".field").classList.contains("invalid")) validateField(field);
    });
  });

  privacyInput?.addEventListener("change", () => {
    if (privacyError) privacyError.textContent = privacyInput.checked ? "" : "Confirme a autorização para continuar.";
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (formStatus) formStatus.textContent = "";

    const fieldsAreValid = Object.keys(validators)
      .map((name) => validateField(contactForm.elements[name]))
      .every(Boolean);

    const privacyIsValid = privacyInput?.checked || false;
    if (privacyError) privacyError.textContent = privacyIsValid ? "" : "Confirme a autorização para continuar.";

    if (!fieldsAreValid || !privacyIsValid) {
      const firstInvalid = contactForm.querySelector(".invalid input, .invalid select, .invalid textarea, input[name='privacy']:not(:checked)");
      firstInvalid?.focus();
      return;
    }

    const subjectField = contactForm.elements.subject;
    const subjectText = subjectField.options[subjectField.selectedIndex].text;
    const phoneValue = contactForm.elements.phone?.value?.trim();
    const lines = [
      `Olá! Meu nome é ${contactForm.elements.name.value.trim()}.`,
      `Assunto: ${subjectText}`,
      contactForm.elements.message.value.trim(),
      `E-mail: ${contactForm.elements.email.value.trim()}`
    ];
    if (phoneValue) lines.push(`Telefone: ${phoneValue}`);
    window.open("https://wa.me/559294698262?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
    contactForm.reset();
    if (formStatus) formStatus.textContent = "Abrimos seu WhatsApp com a mensagem pronta — é só enviar.";
  });
}

const currentYearElements = document.querySelectorAll("#current-year, [data-current-year]");
currentYearElements.forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const filterButtons = document.querySelectorAll("[data-filter]");
const archiveCards = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    archiveCards.forEach((card) => {
      card.hidden = filter !== "todas" && card.dataset.category !== filter;
    });
  });
});

const copyButton = document.querySelector("[data-copy-link]");
const toast = document.querySelector(".toast");

copyButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    toast?.classList.add("show");
    window.setTimeout(() => toast?.classList.remove("show"), 2200);
  } catch {
    copyButton.textContent = "Copie o endereço do navegador";
  }
});

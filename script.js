const focusItems = [
  "conversational AI architecture",
  "Vertex AI and Dialogflow bot flows",
  "agentic LLM orchestration",
  "cloud-native microservices",
  "responsible AI-assisted delivery"
];

const typedText = document.querySelector("#typed-text");
let focusIndex = 0;
let characterIndex = focusItems[0].length;
let deleting = false;

function rotateFocus() {
  if (!typedText) return;
  const current = focusItems[focusIndex];
  typedText.textContent = current.slice(0, characterIndex);

  if (!deleting && characterIndex < current.length) {
    characterIndex += 1;
    window.setTimeout(rotateFocus, 43);
    return;
  }

  if (!deleting) {
    deleting = true;
    window.setTimeout(rotateFocus, 1550);
    return;
  }

  if (characterIndex > 0) {
    characterIndex -= 1;
    window.setTimeout(rotateFocus, 22);
    return;
  }

  deleting = false;
  focusIndex = (focusIndex + 1) % focusItems.length;
  window.setTimeout(rotateFocus, 170);
}

window.setTimeout(rotateFocus, 1300);

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.13 }
);

document.querySelectorAll(".reveal").forEach(node => revealObserver.observe(node));

function animateMetric(node) {
  const target = Number(node.dataset.count);
  const decimals = Number(node.dataset.decimals || 0);
  const prefix = node.dataset.prefix || "";
  const suffix = node.dataset.suffix || "";
  const start = performance.now();
  const duration = 1200;

  function render(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    const formatted = decimals ? value.toFixed(decimals) : Math.round(value).toString();
    node.textContent = `${prefix}${formatted}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(render);
    } else {
      node.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
    }
  }

  requestAnimationFrame(render);
}

const metricObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateMetric(entry.target);
      metricObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.45 }
);

document.querySelectorAll("[data-count]").forEach(node => metricObserver.observe(node));

const filterButtons = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    projectCards.forEach(card => {
      const visible = filter === "all" || card.dataset.tags.split(" ").includes(filter);
      card.classList.toggle("hidden", !visible);
    });
  });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const hero = document.querySelector(".hero");
const heroImage = document.querySelector(".hero-image");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (hero && heroImage && !reducedMotion.matches) {
  hero.addEventListener("pointermove", event => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroImage.style.transform = `scale(1.055) translate(${x * -8}px, ${y * -6}px)`;
  });
  hero.addEventListener("pointerleave", () => {
    heroImage.style.transform = "scale(1.035)";
  });
}

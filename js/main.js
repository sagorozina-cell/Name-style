/* ============================================================
   NameForge — UI wiring
   Connects the input field, mood chips and result grid to engine.js
   ============================================================ */

const els = {
  input: document.getElementById("nameInput"),
  forgeBtn: document.getElementById("forgeBtn"),
  results: document.getElementById("results"),
  empty: document.getElementById("emptyState"),
  chips: document.querySelectorAll(".chip"),
  toast: document.getElementById("toast"),
};

let activeMood = "all";

els.chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    els.chips.forEach((c) => c.classList.remove("chip--active"));
    chip.classList.add("chip--active");
    activeMood = chip.dataset.mood;
    if (els.input.value.trim()) render();
  });
});

function render() {
  const name = els.input.value.trim();

  if (!name) {
    els.results.innerHTML = "";
    els.empty.style.display = "block";
    return;
  }

  els.empty.style.display = "none";
  const variants = generateStyles(name, 24, activeMood);

  els.results.innerHTML = variants
    .map(
      (v, i) => `
      <button class="tile" data-value="${encodeURIComponent(v)}" style="--i:${i}">
        <span class="tile__glyph">${v}</span>
        <span class="tile__copy">Copy</span>
      </button>`
    )
    .join("");
}

els.forgeBtn.addEventListener("click", render);

els.input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") render();
});

els.results.addEventListener("click", (e) => {
  const tile = e.target.closest(".tile");
  if (!tile) return;
  const value = decodeURIComponent(tile.dataset.value);
  navigator.clipboard.writeText(value).then(() => showToast());
});

function showToast() {
  els.toast.classList.add("toast--show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => els.toast.classList.remove("toast--show"), 1600);
}

// Seed the page with a starter word so the grid never looks broken on load.
els.input.value = "";

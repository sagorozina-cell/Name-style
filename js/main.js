/* NameForge — UI */

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("nameInput");
  const forgeBtn = document.getElementById("forgeBtn");
  const results = document.getElementById("results");
  const emptyState = document.getElementById("emptyState");
  const toast = document.getElementById("toast");
  const chips = document.querySelectorAll(".chip");

  let activeMood = "all";

  function showToast(message = "Copied to clipboard") {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("toast--show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
      toast.classList.remove("toast--show");
    }, 1600);
  }

  function render() {
    const name = input.value.trim();

    if (!name) {
      results.innerHTML = "";
      emptyState.style.display = "block";
      return;
    }

    const variants = generateStyles(name, 24, activeMood);

    emptyState.style.display = "none";

    results.innerHTML = variants
      .map((value, index) => {
        const encoded = encodeURIComponent(value);

        return `
          <button
            type="button"
            class="tile"
            data-value="${encoded}"
            style="--i:${index}"
          >
            <span class="tile__glyph">${value}</span>
            <span class="tile__copy">Copy</span>
          </button>
        `;
      })
      .join("");
  }

  forgeBtn.addEventListener("click", render);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      render();
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((item) => {
        item.classList.remove("chip--active");
      });

      chip.classList.add("chip--active");

      activeMood = chip.dataset.mood || "all";

      if (input.value.trim()) {
        render();
      }
    });
  });

  results.addEventListener("click", async (event) => {
    const tile = event.target.closest(".tile");

    if (!tile) return;

    const value = decodeURIComponent(tile.dataset.value);

    try {
      await navigator.clipboard.writeText(value);
      showToast();
    } catch (error) {
      // Fallback for browsers where clipboard API is unavailable
      const textarea = document.createElement("textarea");

      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);

      textarea.select();

      try {
        document.execCommand("copy");
        showToast();
      } catch (copyError) {
        showToast("Copy failed");
      }

      textarea.remove();
    }
  });

  // Keep the input empty when the page first loads.
  input.value = "";
});

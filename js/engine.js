/* ============================================================
   NameForge — Engine
   Builds fresh name-style combinations from the data in data.js.
   Pure functions: no DOM access here, so it stays easy to test.
   ============================================================ */

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Apply one font map to a raw string, character by character.
function applyFont(text, map) {
  const lowerAlpha = "abcdefghijklmnopqrstuvwxyz";
  const upperAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let out = "";
  for (const ch of text) {
    const li = lowerAlpha.indexOf(ch);
    const ui = upperAlpha.indexOf(ch);
    if (li !== -1) out += map.a[li] || ch;
    else if (ui !== -1) out += map.A[ui] || ch;
    else out += ch;
  }
  return out;
}

// Build a single styled variant. `mood` narrows which decoration set is used.
function buildVariant(rawName, mood) {
  const font = pick(FONT_MAPS);
  const set = DECORATIONS[mood] || pick(Object.values(DECORATIONS));
  const styledName = applyFont(rawName, font);

  const pattern = Math.floor(Math.random() * 5);
  const left = pick(set);
  const right = pick(set);

  switch (pattern) {
    case 0:
      return `${left} ${styledName} ${right}`;
    case 1:
      return `${left}${styledName}${right}`;
    case 2:
      return `${left}${right} ${styledName} ${right}${left}`;
    case 3:
      return `${styledName} ${left}${right}`;
    default:
      return `${left}${styledName}`;
  }
}

// Public entry point: generate `count` unique-ish variants for a name.
function generateStyles(rawName, count = 24, mood = "all") {
  const clean = rawName.trim();
  if (!clean) return [];

  const results = new Set();
  const moods = mood === "all" ? MOOD_NAMES : [mood];
  let guard = 0;

  while (results.size < count && guard < count * 8) {
    const m = pick(moods);
    results.add(buildVariant(clean, m));
    guard++;
  }

  return Array.from(results);
}

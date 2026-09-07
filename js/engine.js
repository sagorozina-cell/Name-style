/* NameForge — Engine */

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function applyFont(text, map) {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let output = "";

  for (const char of text) {
    const lowerIndex = lower.indexOf(char);
    const upperIndex = upper.indexOf(char);

    if (lowerIndex >= 0) {
      output += map.a[lowerIndex] || char;
    } else if (upperIndex >= 0) {
      output += map.A[upperIndex] || char;
    } else {
      output += char;
    }
  }

  return output;
}

function buildVariant(name, mood) {
  const font = pick(FONT_MAPS);
  const decorations =
    mood === "all"
      ? pick(Object.values(DECORATIONS))
      : DECORATIONS[mood];

  const styled = applyFont(name, font);

  const left = pick(decorations);
  const right = pick(decorations);
  const pattern = Math.floor(Math.random() * 6);

  switch (pattern) {
    case 0:
      return `${left} ${styled} ${right}`;

    case 1:
      return `${left}${styled}${right}`;

    case 2:
      return `${left} ${right} ${styled} ${right} ${left}`;

    case 3:
      return `${styled} ${left}${right}`;

    case 4:
      return `${left}${styled}`;

    case 5:
      return `${styled}${right}`;

    default:
      return styled;
  }
}

function generateStyles(rawName, count = 24, mood = "all") {
  const name = String(rawName || "").trim();

  if (!name) {
    return [];
  }

  const results = new Set();

  let attempts = 0;
  const maxAttempts = count * 20;

  while (results.size < count && attempts < maxAttempts) {
    results.add(buildVariant(name, mood));
    attempts++;
  }

  return Array.from(results);
}

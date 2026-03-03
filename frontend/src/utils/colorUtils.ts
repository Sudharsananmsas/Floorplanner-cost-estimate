const hslToHex = (h: number, s: number, l: number) => {
  const sPct = s / 100,
    lPct = l / 100;
  const a = sPct * Math.min(lPct, 1 - lPct);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = lPct - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const getColorFromId = (id: number) =>
  hslToHex((id * 137) % 360, 70, 50);

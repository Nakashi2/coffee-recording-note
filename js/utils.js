function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// "1:30" や "90" を秒数に変換
function parseTimeStr(s) {
  if (!s) return 0;
  s = String(s).trim();
  if (s.includes(":")) {
    const [m, sec] = s.split(":");
    return (parseInt(m) || 0) * 60 + (parseInt(sec) || 0);
  }
  return parseInt(s) || 0;
}

// 豆と湯の比率（例 "1:15.0"）。どちらか欠けていれば null
function ratio(dose, water) {
  const d = parseFloat(dose), w = parseFloat(water);
  if (!d || !w) return null;
  return `1:${(w / d).toFixed(1)}`;
}

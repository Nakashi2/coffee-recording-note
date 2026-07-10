// 豆の形のアイコン（評価用）
function Bean({ filled, size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
      <ellipse
        cx="12" cy="12" rx="7.5" ry="10"
        transform="rotate(28 12 12)"
        fill={filled ? C.accent : "none"}
        stroke={filled ? C.accent : C.accentDim}
        strokeWidth="1.6"
      />
      <path
        d="M9.5 4.5 C13 9, 11 15, 14.5 19.5"
        fill="none"
        stroke={filled ? C.bg : C.accentDim}
        strokeWidth="1.4"
        strokeLinecap="round"
        transform="rotate(28 12 12)"
      />
    </svg>
  );
}

window.Bean = Bean;

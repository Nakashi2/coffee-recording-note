// 画面をまたいで使い回すインラインスタイル
const input = {
  width: "100%",
  boxSizing: "border-box",
  background: C.bg,
  border: `1px solid ${C.cardLine}`,
  borderRadius: 10,
  padding: "12px 14px",
  color: C.text,
  fontSize: 16,
  outline: "none",
};

const label = {
  fontSize: 11,
  letterSpacing: "0.14em",
  color: C.muted,
  marginBottom: 6,
  display: "block",
};

const chip = (active) => ({
  padding: "8px 12px", borderRadius: 999, fontSize: 13, cursor: "pointer",
  border: `1px solid ${active ? C.accent : C.cardLine}`,
  background: active ? C.accent : "transparent",
  color: active ? C.bg : C.muted,
  fontWeight: active ? 700 : 400,
});

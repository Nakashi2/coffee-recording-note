// ── デザイントークン：ミルクの白とカラメルの琥珀 ──
const C = {
  bg: "#F6F1E7",
  card: "#FFFFFF",
  cardLine: "#E4D9C6",
  accent: "#B8791F",
  accentDim: "#D9B87B",
  text: "#2E2014",
  muted: "#8A7A64",
  danger: "#C0552F",
};

const STORAGE_KEY = "coffee-brews";
const MILLS_KEY = "coffee-mills";
const DEFAULT_MILLS = ["タイムモア C3", "コマンダンテ C40", "1Zpresso", "ポーレックス", "ハリオ"];

const EMPTY = {
  bean: "",
  dose: "",
  water: "",
  temp: "",
  mill: "",
  millCustom: "",
  clicks: "",
  time: 0,
  timeStr: "",
  pours: [],
  pourTarget: 5,
  style: "hot",
  ice: "",
  note: "",
  rating: 0,
};

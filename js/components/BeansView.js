// 豆の一覧（フォルダ）
function BeansView({ loaded, groups, onSelectBean }) {
  return (
    <main style={{ paddingTop: 16 }}>
      {loaded && groups.length === 0 && (
        <div style={{ textAlign: "center", padding: "56px 12px", color: C.muted }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16 }}>
            <Bean filled size={30} /><Bean size={30} /><Bean size={30} />
          </div>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            まだ記録がありません。<br />最初の一杯を淹れたら「記録する」から。
          </p>
        </div>
      )}

      {groups.map((g) => (
        <button key={g.name}
          onClick={() => onSelectBean(g.name)}
          style={{
            display: "block", width: "100%", textAlign: "left", cursor: "pointer",
            background: C.card, border: `1px solid ${C.cardLine}`,
            borderRadius: 14, padding: "16px", marginBottom: 12,
            color: C.text, fontFamily: "inherit",
          }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontSize: 17 }}>{g.name}</strong>
            <span style={{ color: C.accentDim, fontSize: 18 }}>›</span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            marginTop: 8, fontSize: 13, color: C.muted,
          }}>
            <span><b style={{ color: C.text }}>{g.items.length}</b> 杯</span>
            {g.items.some((i) => i.fav) && (
              <span style={{ color: C.accent }}>★ {g.items.filter((i) => i.fav).length}</span>
            )}
            {g.avg !== null && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Bean filled size={14} />
                平均 <b style={{ color: C.accent }}>{g.avg.toFixed(1)}</b>
              </span>
            )}
            <span style={{ marginLeft: "auto" }}>{g.items[0].date}</span>
          </div>
        </button>
      ))}
    </main>
  );
}

window.BeansView = BeansView;

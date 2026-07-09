// 1杯分の記録カード
function EntryCard({ entry: e, onToggleFav, onEdit, onRemove }) {
  return (
    <article style={{
      background: C.card,
      border: `1px solid ${C.cardLine}`,
      borderRadius: 14,
      padding: "14px 16px",
      marginBottom: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3, 4, 5].map((n) => <Bean key={n} filled={n <= e.rating} size={18} />)}
          </div>
          {e.style && (
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
              padding: "3px 8px", borderRadius: 999,
              background: e.style === "ice" ? "#DCEEF6" : "#F3E3C4",
              color: e.style === "ice" ? "#2A6E8E" : "#8A5A16",
            }}>
              {e.style === "ice" ? `ICE${e.ice ? ` 氷${e.ice}g` : ""}` : "HOT"}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: C.muted }}>{e.date}</span>
          <button onClick={() => onToggleFav(e.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 20, padding: 0, lineHeight: 1,
            color: e.fav ? C.accent : C.accentDim,
          }}>
            {e.fav ? "★" : "☆"}
          </button>
        </div>
      </div>

      <div style={{
        display: "flex", flexWrap: "wrap", gap: "6px 14px",
        fontSize: 13, color: C.muted, margin: "10px 0 0",
      }}>
        {e.dose && <span>豆 <b style={{ color: C.text }}>{e.dose}g</b></span>}
        {e.water && <span>湯 <b style={{ color: C.text }}>{e.water}g</b></span>}
        {ratio(e.dose, e.water) && <span>比率 <b style={{ color: C.accent }}>{ratio(e.dose, e.water)}</b></span>}
        {e.time > 0 && <span>抽出 <b style={{ color: C.text }}>{fmtTime(e.time)}</b></span>}
        {e.mill && (
          <span>{e.mill}{e.clicks && <> <b style={{ color: C.text }}>{e.clicks}クリック</b></>}</span>
        )}
        {!e.mill && e.grind && <span>{e.grind}</span>}
      </div>

      {e.pours && e.pours.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {e.pours.map((p, i) => {
            const t = typeof p === "number" ? p : p.t;
            const g = typeof p === "object" && p.g ? p.g : null;
            return (
              <span key={i} style={{
                fontSize: 12, padding: "4px 9px", borderRadius: 999,
                border: `1px solid ${C.cardLine}`, color: C.muted,
                fontVariantNumeric: "tabular-nums",
              }}>
                {i + 1}回目 <b style={{ color: C.text }}>{fmtTime(t)}</b>
                {g && <> ・<b style={{ color: C.accent }}>{g}g</b></>}
              </span>
            );
          })}
        </div>
      )}

      {e.note && <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.7 }}>{e.note}</p>}

      <div style={{ display: "flex", gap: 18, marginTop: 10 }}>
        <button onClick={() => onEdit(e)} style={{
          background: "none", border: "none",
          color: C.accent, fontSize: 12, padding: 0, cursor: "pointer", fontFamily: "inherit",
        }}>
          編集
        </button>
        <button onClick={() => onRemove(e.id)} style={{
          background: "none", border: "none",
          color: C.danger, fontSize: 12, padding: 0, cursor: "pointer", fontFamily: "inherit",
        }}>
          削除
        </button>
      </div>
    </article>
  );
}

window.EntryCard = EntryCard;

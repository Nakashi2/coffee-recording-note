// 豆の詳細（記録一覧＋ソート）
function BeanDetail({
  bean, items, sortBy, setSortBy, favOnly, setFavOnly,
  onBack, onToggleFav, onEdit, onRemove,
}) {
  return (
    <main style={{ paddingTop: 14 }}>
      <button onClick={onBack} style={{
        background: "none", border: "none", color: C.accent,
        fontSize: 14, padding: "4px 0", cursor: "pointer", fontFamily: "inherit",
      }}>
        ‹ 豆の一覧へ
      </button>
      <h2 style={{ margin: "8px 0 12px", fontSize: 20 }}>{bean}</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button style={chip(sortBy === "new")} onClick={() => setSortBy("new")}>新着順</button>
        <button style={chip(sortBy === "rating")} onClick={() => setSortBy("rating")}>高評価順</button>
        <button style={chip(favOnly)} onClick={() => setFavOnly(!favOnly)}>★ お気に入り</button>
      </div>

      {favOnly && items.length === 0 && (
        <p style={{ color: C.muted, fontSize: 14, textAlign: "center", padding: "32px 0" }}>
          この豆にお気に入りの記録はまだありません。<br />記録の ☆ をタップして登録できます。
        </p>
      )}

      {items.map((e) => (
        <EntryCard key={e.id} entry={e}
          onToggleFav={onToggleFav} onEdit={onEdit} onRemove={onRemove} />
      ))}
    </main>
  );
}

window.BeanDetail = BeanDetail;

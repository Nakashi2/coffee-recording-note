// 記録フォーム（タイマー・注湯記録を含む）
function BrewForm({
  form, setForm, beanNames, editingId,
  mills, millEdit, setMillEdit, newMill, setNewMill, addMill, removeMill,
  running, elapsed, toggleTimer, recordPour, updatePour, addPour, removePour,
  save, cancel,
}) {
  return (
    <main style={{ paddingTop: 18, display: "grid", gap: 16 }}>
      <div>
        <span style={label}>豆の名前</span>
        {beanNames.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            {beanNames.map((b) => (
              <button key={b} style={chip(form.bean === b)}
                onClick={() => setForm({ ...form, bean: b })}>
                {b}
              </button>
            ))}
          </div>
        )}
        <input style={input} value={form.bean} placeholder="エチオピア イルガチェフェ"
          onChange={(ev) => setForm({ ...form, bean: ev.target.value })} />
        <p style={{ fontSize: 12, color: C.muted, margin: "6px 0 0" }}>
          同じ名前で記録すると、同じ豆としてまとまります。
        </p>
      </div>

      <div>
        <span style={label}>スタイル</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button style={chip(form.style === "hot")}
            onClick={() => setForm({ ...form, style: "hot", ice: "" })}>
            ☕ ホット
          </button>
          <button style={chip(form.style === "ice")}
            onClick={() => setForm({ ...form, style: "ice" })}>
            🧊 アイス
          </button>
          {form.style === "ice" && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
              <input style={{ ...input, textAlign: "center" }} inputMode="decimal"
                value={form.ice} placeholder="氷の量"
                onChange={(ev) => setForm({ ...form, ice: ev.target.value })} />
              <span style={{ fontSize: 13, color: C.muted }}>g</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <span style={label}>豆の量 (g)</span>
          <input style={input} inputMode="decimal" value={form.dose} placeholder="15"
            onChange={(ev) => setForm({ ...form, dose: ev.target.value })} />
        </div>
        <div>
          <span style={label}>湯量 (g)</span>
          <input style={input} inputMode="decimal" value={form.water} placeholder="225"
            onChange={(ev) => setForm({ ...form, water: ev.target.value })} />
        </div>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <span style={label}>コーヒーミル</span>
          <button onClick={() => { setMillEdit(!millEdit); setNewMill(""); }} style={{
            background: "none", border: "none", cursor: "pointer",
            color: C.accent, fontSize: 12, fontFamily: "inherit", padding: 0,
          }}>
            {millEdit ? "完了" : "ミルを編集"}
          </button>
        </div>

        {!millEdit && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            {mills.map((m) => (
              <button key={m} style={chip(form.mill === m)}
                onClick={() => setForm({ ...form, mill: m })}>
                {m}
              </button>
            ))}
            <button style={chip(form.mill === "その他")}
              onClick={() => setForm({ ...form, mill: "その他" })}>
              その他
            </button>
          </div>
        )}

        {millEdit && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              {mills.map((m) => (
                <button key={m} onClick={() => removeMill(m)} style={{
                  ...chip(false), borderColor: C.danger, color: C.danger,
                }}>
                  {m} ✕
                </button>
              ))}
              {mills.length === 0 && (
                <span style={{ fontSize: 13, color: C.muted }}>登録されたミルはありません</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...input, flex: 1 }} value={newMill}
                placeholder="新しいミルの名前"
                onChange={(ev) => setNewMill(ev.target.value)} />
              <button onClick={addMill} disabled={!newMill.trim()} style={{
                padding: "0 18px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                cursor: newMill.trim() ? "pointer" : "default", border: "none",
                background: newMill.trim() ? C.accent : C.cardLine,
                color: newMill.trim() ? C.bg : C.muted, fontFamily: "inherit",
              }}>
                追加
              </button>
            </div>
            <p style={{ fontSize: 12, color: C.muted, margin: "8px 0 0" }}>
              ✕ の付いたミルをタップすると一覧から削除します。過去の記録は消えません。
            </p>
          </div>
        )}

        {form.mill === "その他" && (
          <input style={{ ...input, marginBottom: 10 }} value={form.millCustom}
            placeholder="ミルの名前を入力"
            onChange={(ev) => setForm({ ...form, millCustom: ev.target.value })} />
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setForm({ ...form, clicks: String(Math.max(0, (parseInt(form.clicks) || 0) - 1)) })}
            style={{
              width: 44, height: 44, borderRadius: 12, fontSize: 20, cursor: "pointer",
              border: `1px solid ${C.cardLine}`, background: "transparent", color: C.accent,
            }}>−</button>
          <input style={{ ...input, textAlign: "center", flex: 1 }} inputMode="numeric"
            value={form.clicks} placeholder="クリック数"
            onChange={(ev) => setForm({ ...form, clicks: ev.target.value.replace(/[^0-9]/g, "") })} />
          <button onClick={() => setForm({ ...form, clicks: String((parseInt(form.clicks) || 0) + 1) })}
            style={{
              width: 44, height: 44, borderRadius: 12, fontSize: 20, cursor: "pointer",
              border: `1px solid ${C.cardLine}`, background: "transparent", color: C.accent,
            }}>＋</button>
          <span style={{ fontSize: 13, color: C.muted, whiteSpace: "nowrap" }}>クリック</span>
        </div>
      </div>

      {/* 抽出タイマー */}
      <div style={{
        background: C.card, border: `1px solid ${C.cardLine}`,
        borderRadius: 14, padding: 18, textAlign: "center",
      }}>
        <span style={label}>抽出タイマー</span>
        <div style={{
          fontSize: 44, fontVariantNumeric: "tabular-nums",
          fontWeight: 200, letterSpacing: "0.04em",
          color: running ? C.accent : C.text, margin: "4px 0 12px",
        }}>
          {fmtTime(running ? elapsed : form.time)}
        </div>

        {/* 注湯回数の設定 */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 12, marginBottom: 14, fontSize: 13, color: C.muted,
        }}>
          <span>注湯回数</span>
          <button onClick={() => setForm({ ...form, pourTarget: Math.max(1, form.pourTarget - 1) })}
            style={{
              width: 32, height: 32, borderRadius: 8, fontSize: 16, cursor: "pointer",
              border: `1px solid ${C.cardLine}`, background: "transparent", color: C.accent,
            }}>−</button>
          <b style={{ color: C.text, fontSize: 16, minWidth: 40 }}>{form.pourTarget} 回</b>
          <button onClick={() => setForm({ ...form, pourTarget: form.pourTarget + 1 })}
            style={{
              width: 32, height: 32, borderRadius: 8, fontSize: 16, cursor: "pointer",
              border: `1px solid ${C.cardLine}`, background: "transparent", color: C.accent,
            }}>＋</button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 14, alignItems: "center" }}>
          <button onClick={toggleTimer} style={{
            width: running ? 84 : 104, height: running ? 84 : 104, borderRadius: "50%", cursor: "pointer",
            border: running ? `2px solid ${C.danger}` : "none",
            background: running ? "transparent" : C.accent,
            color: running ? C.danger : C.bg,
            fontSize: 15, fontWeight: 700,
            boxShadow: running ? "none" : "0 4px 18px rgba(184,121,31,0.3)",
          }}>
            {running ? "終了" : <>開始<br /><span style={{ fontSize: 11, fontWeight: 400 }}>＝1回目の注湯</span></>}
          </button>
          {running && (
            <button onClick={recordPour} style={{
              width: 104, height: 104, borderRadius: "50%", cursor: "pointer",
              border: "none", background: C.accent, color: C.bg,
              fontSize: 16, fontWeight: 700,
              boxShadow: "0 4px 18px rgba(184,121,31,0.3)",
            }}>
              注湯<br />
              <span style={{ fontSize: 12, fontWeight: 400 }}>
                {form.pours.length + 1}回目
              </span>
            </button>
          )}
        </div>

        {/* 注湯の記録（手動編集可） */}
        {form.pours.length > 0 && (
          <div style={{ marginTop: 16, textAlign: "left" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "52px 1fr 1fr 32px",
              gap: 8, alignItems: "center", fontSize: 12, color: C.muted,
              padding: "0 2px 6px",
            }}>
              <span></span><span style={{ textAlign: "center" }}>時間</span>
              <span style={{ textAlign: "center" }}>湯量 (g)</span><span></span>
            </div>
            {form.pours.map((p, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "52px 1fr 1fr 32px",
                gap: 8, alignItems: "center", marginBottom: 8,
              }}>
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: i < form.pourTarget ? C.accent : C.muted,
                }}>
                  {i + 1}回目
                </span>
                <input style={{ ...input, padding: "9px 8px", textAlign: "center" }}
                  value={p.tStr} placeholder="0:30" inputMode="numeric"
                  onChange={(ev) => updatePour(i, "tStr", ev.target.value)} />
                <input style={{ ...input, padding: "9px 8px", textAlign: "center" }}
                  value={p.g} placeholder="50" inputMode="decimal"
                  onChange={(ev) => updatePour(i, "g", ev.target.value.replace(/[^0-9.]/g, ""))} />
                <button onClick={() => removePour(i)} style={{
                  background: "none", border: "none", color: C.danger,
                  fontSize: 16, cursor: "pointer", padding: 4,
                }}>✕</button>
              </div>
            ))}
          </div>
        )}
        <button onClick={addPour} style={{
          marginTop: form.pours.length > 0 ? 2 : 12,
          background: "none", border: `1px dashed ${C.accentDim}`,
          borderRadius: 10, color: C.accent, fontSize: 13,
          padding: "8px 14px", cursor: "pointer", fontFamily: "inherit",
        }}>
          ＋ 注湯を手動で追加
        </button>

        {/* 抽出時間の手動編集 */}
        {!running && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, marginTop: 14, fontSize: 13, color: C.muted,
          }}>
            <span>抽出時間</span>
            <input style={{ ...input, width: 88, padding: "9px 8px", textAlign: "center" }}
              value={form.timeStr} placeholder="2:30" inputMode="numeric"
              onChange={(ev) => setForm({ ...form, timeStr: ev.target.value })} />
            <span style={{ fontSize: 12 }}>（手動で修正できます）</span>
          </div>
        )}

        <p style={{ fontSize: 12, color: C.muted, margin: "12px 0 0" }}>
          「開始」を押した瞬間が1回目の注湯として記録されます。以降はお湯を注ぐたびに「注湯」をタップ。時間は「1:30」のように分:秒で入力できます。
        </p>
      </div>

      <div>
        <span style={label}>評価</span>
        <div style={{ display: "flex", gap: 8 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setForm({ ...form, rating: n })}
              style={{ background: "none", border: "none", padding: 2, cursor: "pointer" }}>
              <Bean filled={n <= form.rating} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <span style={label}>味の感想</span>
        <textarea style={{ ...input, minHeight: 88, resize: "vertical" }}
          value={form.note} placeholder="酸味が明るい。次はもう少し細かく挽く。"
          onChange={(ev) => setForm({ ...form, note: ev.target.value })} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={cancel} style={{
          flex: 1, padding: "14px 0", borderRadius: 12, fontSize: 15, cursor: "pointer",
          background: "transparent", border: `1px solid ${C.cardLine}`, color: C.muted,
          fontFamily: "inherit",
        }}>
          やめる
        </button>
        <button onClick={save} disabled={!form.bean.trim()} style={{
          flex: 2, padding: "14px 0", borderRadius: 12, fontSize: 15, fontWeight: 700,
          cursor: form.bean.trim() ? "pointer" : "default",
          background: form.bean.trim() ? C.accent : C.cardLine,
          border: "none", color: form.bean.trim() ? C.bg : C.muted,
          fontFamily: "inherit",
        }}>
          {editingId ? "更新する" : "保存する"}
        </button>
      </div>
    </main>
  );
}

window.BrewForm = BrewForm;

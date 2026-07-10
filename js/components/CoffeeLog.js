// アプリ本体：状態と保存処理をここで持ち、各画面コンポーネントに渡す
function CoffeeLog() {
  const { useState, useEffect, useRef } = React;

  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("beans"); // beans | detail | form
  const [selectedBean, setSelectedBean] = useState(null);
  const [sortBy, setSortBy] = useState("new"); // new | rating
  const [favOnly, setFavOnly] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);

  // ミルの管理
  const [mills, setMills] = useState(DEFAULT_MILLS);
  const [millEdit, setMillEdit] = useState(false);
  const [newMill, setNewMill] = useState("");

  // タイマー
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        if (r && r.value) setEntries(JSON.parse(r.value));
      } catch (e) {
        // 初回はキーが無いので何もしない
      }
      try {
        const m = await window.storage.get(MILLS_KEY);
        if (m && m.value) setMills(JSON.parse(m.value));
      } catch (e) {
        // 初回は既定のミル一覧を使う
      }
      setLoaded(true);
    })();
    return () => clearInterval(timerRef.current);
  }, []);

  const persistMills = async (next) => {
    setMills(next);
    try {
      await window.storage.set(MILLS_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("保存に失敗しました", e);
    }
  };

  const addMill = () => {
    const name = newMill.trim();
    if (!name || mills.includes(name)) return;
    persistMills([...mills, name]);
    setForm((f) => ({ ...f, mill: name }));
    setNewMill("");
  };

  const removeMill = (m) => {
    persistMills(mills.filter((x) => x !== m));
    if (form.mill === m) setForm((f) => ({ ...f, mill: "" }));
  };

  const persist = async (next) => {
    setEntries(next);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("保存に失敗しました", e);
    }
  };

  const toggleTimer = () => {
    if (running) {
      clearInterval(timerRef.current);
      setRunning(false);
      setForm((f) => ({ ...f, time: elapsed, timeStr: fmtTime(elapsed) }));
    } else {
      setElapsed(0);
      // 開始 = 1回目の注湯。0:00 で自動記録する
      setForm((f) => ({ ...f, time: 0, timeStr: "", pours: [{ tStr: "0:00", g: "" }] }));
      setRunning(true);
      const t0 = Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - t0) / 1000));
      }, 250);
    }
  };

  const recordPour = () => {
    if (!running) return;
    setForm((f) => ({ ...f, pours: [...f.pours, { tStr: fmtTime(elapsed), g: "" }] }));
  };

  const updatePour = (i, key, val) => {
    setForm((f) => {
      const pours = f.pours.map((p, j) => (j === i ? { ...p, [key]: val } : p));
      return { ...f, pours };
    });
  };

  const addPour = () => {
    setForm((f) => ({ ...f, pours: [...f.pours, { tStr: "", g: "" }] }));
  };

  const removePour = (i) => {
    setForm((f) => ({ ...f, pours: f.pours.filter((_, j) => j !== i) }));
  };

  const save = () => {
    if (!form.bean.trim()) return;
    const beanName = form.bean.trim();
    const entry = {
      ...form,
      bean: beanName,
      mill: form.mill === "その他" ? (form.millCustom.trim() || "その他") : form.mill,
      time: running ? elapsed : (parseTimeStr(form.timeStr) || form.time),
      pours: form.pours
        .filter((p) => p.tStr !== "" || p.g !== "")
        .map((p) => ({ t: parseTimeStr(p.tStr), g: p.g }))
        .sort((a, b) => a.t - b.t),
    };
    if (running) { clearInterval(timerRef.current); setRunning(false); }

    if (editingId) {
      // 既存の記録を更新（日時とお気に入りは元のまま）
      persist(entries.map((e) =>
        e.id === editingId ? { ...entry, id: e.id, date: e.date, fav: e.fav } : e
      ));
    } else {
      persist([{
        ...entry,
        id: Date.now(),
        fav: false,
        date: new Date().toLocaleDateString("ja-JP", {
          month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
        }),
      }, ...entries]);
    }

    setForm(EMPTY);
    setElapsed(0);
    setEditingId(null);
    setSelectedBean(beanName);
    setView("detail");
  };

  const cancelForm = () => {
    if (running) { toggleTimer(); }
    setForm(EMPTY);
    setEditingId(null);
    setView(selectedBean ? "detail" : "beans");
  };

  const toggleFav = (id) => {
    persist(entries.map((e) => (e.id === id ? { ...e, fav: !e.fav } : e)));
  };

  const startEdit = (e) => {
    setForm({
      bean: e.bean,
      dose: e.dose || "",
      water: e.water || "",
      temp: e.temp || "",
      mill: !e.mill ? "" : mills.includes(e.mill) ? e.mill : "その他",
      millCustom: e.mill && !mills.includes(e.mill) && e.mill !== "その他" ? e.mill : "",
      clicks: e.clicks || "",
      time: e.time || 0,
      timeStr: e.time ? fmtTime(e.time) : "",
      pours: (e.pours || []).map((p) =>
        typeof p === "number"
          ? { tStr: fmtTime(p), g: "" }
          : { tStr: fmtTime(p.t), g: p.g || "" }
      ),
      pourTarget: e.pourTarget || 5,
      style: e.style || "hot",
      ice: e.ice || "",
      note: e.note || "",
      rating: e.rating || 0,
    });
    setEditingId(e.id);
    setView("form");
  };

  const remove = (id) => {
    const next = entries.filter((e) => e.id !== id);
    persist(next);
    // 削除でその豆の記録が空になったら一覧に戻る
    if (selectedBean && !next.some((e) => e.bean === selectedBean)) {
      setSelectedBean(null);
      setView("beans");
    }
  };

  // 豆ごとにグループ化
  const groups = [];
  for (const e of entries) {
    let g = groups.find((x) => x.name === e.bean);
    if (!g) {
      g = { name: e.bean, items: [], latest: 0 };
      groups.push(g);
    }
    g.items.push(e);
    g.latest = Math.max(g.latest, e.id);
  }
  groups.sort((a, b) => b.latest - a.latest);
  for (const g of groups) {
    const rated = g.items.filter((e) => e.rating > 0);
    g.avg = rated.length ? rated.reduce((s, e) => s + e.rating, 0) / rated.length : null;
    g.best = Math.max(...g.items.map((e) => e.rating));
  }

  const beanNames = groups.map((g) => g.name);

  const detailItems = selectedBean
    ? entries
        .filter((e) => e.bean === selectedBean)
        .filter((e) => !favOnly || e.fav)
        .sort((a, b) => sortBy === "rating" ? (b.rating - a.rating) || (b.id - a.id) : b.id - a.id)
    : [];

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      color: C.text,
      fontFamily: "'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif",
      maxWidth: 480,
      margin: "0 auto",
      padding: "0 16px 96px",
    }}>
      {/* ヘッダー */}
      <header style={{ padding: "28px 4px 18px", borderBottom: `1px solid ${C.cardLine}` }}>
        <div style={{ fontSize: 11, letterSpacing: "0.28em", color: C.accent }}>BREW LOG</div>
        <h1 style={{ margin: "6px 0 0", fontSize: 24, fontWeight: 700 }}>抽出ノート</h1>
      </header>

      {view === "beans" && (
        <BeansView
          loaded={loaded}
          groups={groups}
          onSelectBean={(name) => {
            setSelectedBean(name);
            setSortBy("new");
            setFavOnly(false);
            setView("detail");
          }}
        />
      )}

      {view === "detail" && selectedBean && (
        <BeanDetail
          bean={selectedBean}
          items={detailItems}
          sortBy={sortBy} setSortBy={setSortBy}
          favOnly={favOnly} setFavOnly={setFavOnly}
          onBack={() => { setView("beans"); setSelectedBean(null); }}
          onToggleFav={toggleFav}
          onEdit={startEdit}
          onRemove={remove}
        />
      )}

      {view === "form" && (
        <BrewForm
          form={form} setForm={setForm}
          beanNames={beanNames} editingId={editingId}
          mills={mills} millEdit={millEdit} setMillEdit={setMillEdit}
          newMill={newMill} setNewMill={setNewMill}
          addMill={addMill} removeMill={removeMill}
          running={running} elapsed={elapsed}
          toggleTimer={toggleTimer} recordPour={recordPour}
          updatePour={updatePour} addPour={addPour} removePour={removePour}
          save={save} cancel={cancelForm}
        />
      )}

      {/* 記録ボタン */}
      {view !== "form" && (
        <button onClick={() => {
          setForm({ ...EMPTY, bean: selectedBean || "", mill: mills[0] || "" });
          setMillEdit(false);
          setView("form");
        }} style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          padding: "16px 40px", borderRadius: 999, border: "none", cursor: "pointer",
          background: C.accent, color: C.bg, fontSize: 16, fontWeight: 700,
          boxShadow: "0 6px 24px rgba(184,121,31,0.28)",
          fontFamily: "inherit",
        }}>
          ＋ 記録する
        </button>
      )}
    </div>
  );
}

window.CoffeeLog = CoffeeLog;

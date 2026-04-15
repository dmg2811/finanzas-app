import { useState, useEffect, useCallback, useMemo } from "react";

// ─── ICONS (inline SVG components) ───────────────────────────────────────────
const Icon = ({ name, size = 20, className = "" }) => {
  const icons = {
    plus: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />,
    minus: <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    edit: <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
    home: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    list: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />,
    settings: <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
    chart: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    x: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
    download: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
    upload: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
    arrow_up: <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />,
    arrow_down: <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />,
    wallet: <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
    tag: <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />,
    calendar: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    chevron_right: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />,
    trending_up: <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      {icons[name] || icons.tag}
    </svg>
  );
};

// ─── EMOJI ICONS FOR CATEGORIES ──────────────────────────────────────────────
const EMOJI_OPTIONS = ["🏠","🚗","🍔","🛒","💊","🎮","✈️","👗","📱","💡","🎓","🐶","🏋️","☕","🎬","🎁","💰","📈","💼","🏦","💳","🔧","🎵","📚","🌿","🍺","🎯","💎","🧴","🧾"];

// ─── DEFAULT DATA ─────────────────────────────────────────────────────────────
const DEFAULT_STATE = {
  categories: {
    income: [
      { id: "inc-1", name: "Salario", icon: "💼", color: "#22d3ee" },
      { id: "inc-2", name: "Freelance", icon: "💻", color: "#34d399" },
      { id: "inc-3", name: "Inversiones", icon: "📈", color: "#a78bfa" },
    ],
    expense: [
      { id: "exp-1", name: "Alimentación", icon: "🍔", color: "#f472b6" },
      { id: "exp-2", name: "Transporte", icon: "🚗", color: "#fb923c" },
      { id: "exp-3", name: "Servicios", icon: "💡", color: "#facc15" },
      { id: "exp-4", name: "Entretenimiento", icon: "🎮", color: "#60a5fa" },
      { id: "exp-5", name: "Salud", icon: "💊", color: "#f87171" },
    ],
  },
  transactions: [],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const genId = () => Math.random().toString(36).slice(2, 10);
const fmt = (n) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

const getPeriodRange = (period) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === "weekly") {
    const day = today.getDay();
    const start = new Date(today); start.setDate(today.getDate() - day);
    const end = new Date(start); end.setDate(start.getDate() + 6);
    return { start, end };
  }
  if (period === "biweekly") {
    const d = today.getDate();
    if (d <= 15) {
      return { start: new Date(today.getFullYear(), today.getMonth(), 1), end: new Date(today.getFullYear(), today.getMonth(), 15) };
    } else {
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { start: new Date(today.getFullYear(), today.getMonth(), 16), end: last };
    }
  }
  // monthly
  return { start: new Date(today.getFullYear(), today.getMonth(), 1), end: new Date(today.getFullYear(), today.getMonth() + 1, 0) };
};

const filterByPeriod = (transactions, period) => {
  const { start, end } = getPeriodRange(period);
  return transactions.filter((t) => {
    const d = new Date(t.date + "T00:00:00");
    return d >= start && d <= end;
  });
};

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const load = () => {
  try { const s = localStorage.getItem("financeapp_v2"); return s ? JSON.parse(s) : DEFAULT_STATE; }
  catch { return DEFAULT_STATE; }
};
const save = (state) => { try { localStorage.setItem("financeapp_v2", JSON.stringify(state)); } catch {} };

// ─── DONUT CHART ──────────────────────────────────────────────────────────────
const DonutChart = ({ data, total }) => {
  if (!data.length || total === 0) return (
    <div className="flex items-center justify-center h-40 text-gray-600 text-sm">Sin datos en este periodo</div>
  );
  let cumulative = 0;
  const r = 54, cx = 64, cy = 64, circumference = 2 * Math.PI * r;
  const segments = data.map((d) => {
    const pct = d.value / total;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const offset = circumference - cumulative * circumference;
    cumulative += pct;
    return { ...d, dash, gap, offset };
  });
  return (
    <div className="flex items-center gap-4">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="18" />
        {segments.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth="18"
            strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={s.offset}
            style={{ transition: "stroke-dasharray 0.6s ease", transformOrigin: "center", transform: "rotate(-90deg)" }} />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">TOTAL</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#f1f5f9" fontSize="10" fontWeight="bold" fontFamily="monospace">{fmt(total).replace("MX$","$")}</text>
      </svg>
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {data.slice(0, 6).map((d, i) => (
          <div key={i} className="flex items-center gap-2 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-xs text-slate-400 truncate flex-1">{d.icon} {d.name}</span>
            <span className="text-xs font-mono text-slate-300 flex-shrink-0">{Math.round(d.value / total * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── BAR CHART ────────────────────────────────────────────────────────────────
const BarChart = ({ data, max }) => (
  <div className="flex flex-col gap-2">
    {data.map((d, i) => (
      <div key={i} className="flex items-center gap-2">
        <span className="text-sm w-6 text-center">{d.icon}</span>
        <div className="flex-1 bg-slate-800 rounded-full h-5 overflow-hidden">
          <div className="h-full rounded-full flex items-center px-2 transition-all duration-700 ease-out"
            style={{ width: `${max ? (d.value / max) * 100 : 0}%`, background: d.color, minWidth: d.value > 0 ? "2rem" : 0 }}>
            <span className="text-xs font-mono text-white/90 truncate">{fmt(d.value).replace("MX$","$")}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─── MODAL ────────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full sm:max-w-md bg-slate-900 border border-slate-700/60 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

// ─── TRANSACTION FORM ─────────────────────────────────────────────────────────
const TransactionForm = ({ categories, onSave, onClose, initial }) => {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    type: initial?.type || "expense",
    categoryId: initial?.categoryId || "",
    amount: initial?.amount || "",
    description: initial?.description || "",
    date: initial?.date || today,
  });

  const cats = categories[form.type] || [];

  useEffect(() => {
    if (!initial && cats.length > 0) setForm(f => ({ ...f, categoryId: cats[0].id }));
  }, [form.type]);

  const handleSubmit = () => {
    if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) return;
    if (!form.categoryId) return;
    onSave({ ...form, amount: parseFloat(form.amount), id: initial?.id || genId() });
    onClose();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Type Toggle */}
      <div className="flex gap-2 bg-slate-800 rounded-xl p-1">
        {["expense","income"].map(t => (
          <button key={t} onClick={() => setForm(f => ({ ...f, type: t, categoryId: "" }))}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${form.type === t ? t === "expense" ? "bg-rose-500 text-white shadow" : "bg-emerald-500 text-white shadow" : "text-slate-400"}`}>
            {t === "expense" ? "💸 Gasto" : "💰 Ingreso"}
          </button>
        ))}
      </div>
      {/* Amount */}
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Monto</label>
        <input type="number" inputMode="decimal" placeholder="0.00" value={form.amount}
          onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-xl font-mono focus:outline-none focus:border-cyan-500 transition-colors" />
      </div>
      {/* Category */}
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Categoría</label>
        <div className="grid grid-cols-3 gap-2">
          {cats.map(c => (
            <button key={c.id} onClick={() => setForm(f => ({ ...f, categoryId: c.id }))}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs transition-all ${form.categoryId === c.id ? "border-cyan-500 bg-cyan-500/10 text-cyan-300" : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"}`}>
              <span className="text-xl">{c.icon}</span>
              <span className="truncate w-full text-center">{c.name}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Date */}
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Fecha</label>
        <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
      </div>
      {/* Description */}
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Descripción (opcional)</label>
        <input type="text" placeholder="Nota rápida..." value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
      </div>
      <button onClick={handleSubmit}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-lg hover:opacity-90 active:scale-95 transition-all">
        {initial ? "Guardar Cambios" : "Registrar"}
      </button>
    </div>
  );
};

// ─── CATEGORY MANAGER ─────────────────────────────────────────────────────────
const CategoryManager = ({ categories, onChange }) => {
  const [editType, setEditType] = useState("expense");
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("🏠");
  const [editId, setEditId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const cats = categories[editType];

  const addOrUpdate = () => {
    if (!newName.trim()) return;
    const color = `hsl(${Math.floor(Math.random() * 360)},70%,60%)`;
    if (editId) {
      onChange({ ...categories, [editType]: cats.map(c => c.id === editId ? { ...c, name: newName.trim(), icon: newIcon } : c) });
    } else {
      onChange({ ...categories, [editType]: [...cats, { id: genId(), name: newName.trim(), icon: newIcon, color }] });
    }
    setNewName(""); setNewIcon("🏠"); setEditId(null);
  };

  const startEdit = (c) => { setEditId(c.id); setNewName(c.name); setNewIcon(c.icon); };
  const remove = (id) => onChange({ ...categories, [editType]: cats.filter(c => c.id !== id) });
  const cancel = () => { setEditId(null); setNewName(""); setNewIcon("🏠"); };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 bg-slate-800 rounded-xl p-1">
        {["expense","income"].map(t => (
          <button key={t} onClick={() => { setEditType(t); cancel(); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${editType === t ? "bg-slate-700 text-white" : "text-slate-400"}`}>
            {t === "expense" ? "💸 Gastos" : "💰 Ingresos"}
          </button>
        ))}
      </div>

      {/* Add/Edit form */}
      <div className="flex gap-2">
        <div className="relative">
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="w-12 h-12 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-xl text-xl hover:border-cyan-500 transition-colors">
            {newIcon}
          </button>
          {showEmojiPicker && (
            <div className="absolute top-14 left-0 z-10 bg-slate-800 border border-slate-700 rounded-xl p-2 grid grid-cols-6 gap-1 shadow-xl w-48">
              {EMOJI_OPTIONS.map(e => (
                <button key={e} onClick={() => { setNewIcon(e); setShowEmojiPicker(false); }}
                  className="w-7 h-7 flex items-center justify-center text-lg hover:bg-slate-700 rounded-lg transition-colors">
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
        <input type="text" placeholder="Nombre de categoría..." value={newName}
          onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && addOrUpdate()}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
        <button onClick={addOrUpdate}
          className="px-3 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-400 transition-colors font-medium text-sm">
          {editId ? "✓" : "+"}
        </button>
        {editId && <button onClick={cancel} className="px-3 py-2 bg-slate-700 text-white rounded-xl text-sm">✕</button>}
      </div>

      {/* Category list */}
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {cats.map(c => (
          <div key={c.id} className="flex items-center gap-3 bg-slate-800/60 rounded-xl px-3 py-2.5">
            <span className="text-xl">{c.icon}</span>
            <span className="flex-1 text-sm text-slate-300">{c.name}</span>
            <div className="flex gap-1.5">
              <button onClick={() => startEdit(c)} className="p-1.5 text-slate-500 hover:text-cyan-400 transition-colors"><Icon name="edit" size={14} /></button>
              <button onClick={() => remove(c.id)} className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"><Icon name="trash" size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── PERIOD LABEL ─────────────────────────────────────────────────────────────
const PeriodLabel = ({ period }) => {
  const { start, end } = getPeriodRange(period);
  const opts = { day: "numeric", month: "short" };
  return (
    <span className="text-xs text-slate-500">
      {start.toLocaleDateString("es-MX", opts)} — {end.toLocaleDateString("es-MX", opts)}
    </span>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function FinanceApp() {
  const [state, setState] = useState(load);
  const [period, setPeriod] = useState("monthly");
  const [tab, setTab] = useState("home");
  const [modal, setModal] = useState(null); // null | "add" | "edit" | "settings" | "category"
  const [editTx, setEditTx] = useState(null);
  const [filterType, setFilterType] = useState("all");

  // Persist on change
  useEffect(() => { save(state); }, [state]);

  const filtered = useMemo(() => filterByPeriod(state.transactions, period), [state.transactions, period]);

  const totalIncome = useMemo(() => filtered.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0), [filtered]);
  const totalExpense = useMemo(() => filtered.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0), [filtered]);
  const savings = totalIncome - totalExpense;

  const allCategories = useMemo(() => [...state.categories.income, ...state.categories.expense], [state.categories]);

  const getCat = (id) => allCategories.find(c => c.id === id) || { name: "Sin categoría", icon: "❓", color: "#64748b" };

  // Chart data
  const expenseByCategory = useMemo(() => {
    const map = {};
    filtered.filter(t => t.type === "expense").forEach(t => {
      map[t.categoryId] = (map[t.categoryId] || 0) + t.amount;
    });
    return Object.entries(map).map(([id, value]) => ({ ...getCat(id), value })).sort((a, b) => b.value - a.value);
  }, [filtered, allCategories]);

  const incomeByCategory = useMemo(() => {
    const map = {};
    filtered.filter(t => t.type === "income").forEach(t => {
      map[t.categoryId] = (map[t.categoryId] || 0) + t.amount;
    });
    return Object.entries(map).map(([id, value]) => ({ ...getCat(id), value })).sort((a, b) => b.value - a.value);
  }, [filtered, allCategories]);

  const saveTx = useCallback((tx) => {
    setState(s => ({
      ...s,
      transactions: s.transactions.find(t => t.id === tx.id)
        ? s.transactions.map(t => t.id === tx.id ? tx : t)
        : [tx, ...s.transactions],
    }));
  }, []);

  const deleteTx = useCallback((id) => {
    setState(s => ({ ...s, transactions: s.transactions.filter(t => t.id !== id) }));
  }, []);

  const saveCategories = useCallback((cats) => {
    setState(s => ({ ...s, categories: cats }));
  }, []);

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `finanzas_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const importBackup = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { try { const data = JSON.parse(ev.target.result); setState(data); } catch {} };
    reader.readAsText(file);
  };

  const visibleTx = useMemo(() => {
    let list = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (filterType !== "all") list = list.filter(t => t.type === filterType);
    return list;
  }, [filtered, filterType]);

  const periodLabels = { weekly: "Semanal", biweekly: "Quincenal", monthly: "Mensual" };

  return (
    <div className="min-h-screen bg-[#080d17] text-white font-sans select-none" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 99px; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.4); }
        .font-mono { font-family: 'DM Mono', monospace; }
        .glass { background: rgba(15,23,42,0.8); backdrop-filter: blur(12px); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .animate-fade-up { animation: fadeUp 0.4s ease both; }
        @keyframes pulse-ring { 0%,100% { transform: scale(1); opacity:1; } 50% { transform: scale(1.08); opacity:.8; } }
        .pulse { animation: pulse-ring 2s infinite; }
      `}</style>

      {/* TOP BAR */}
      <header className="sticky top-0 z-30 glass border-b border-slate-800/60 px-4 pt-safe">
        <div className="flex items-center justify-between h-14 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Icon name="wallet" size={14} />
            </div>
            <span className="font-semibold text-sm tracking-tight">FinanzasPRO</span>
          </div>
          {/* Period Selector */}
          <div className="flex gap-0.5 bg-slate-800/80 rounded-xl p-1">
            {Object.entries(periodLabels).map(([k, v]) => (
              <button key={k} onClick={() => setPeriod(k)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === k ? "bg-slate-600 text-white shadow" : "text-slate-500 hover:text-slate-300"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-md mx-auto pb-28">

        {/* ── HOME TAB ── */}
        {tab === "home" && (
          <div className="animate-fade-up">
            {/* Period + date */}
            <div className="px-4 pt-5 pb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{periodLabels[period]}</h2>
              <PeriodLabel period={period} />
            </div>

            {/* Summary Cards */}
            <div className="px-4 grid grid-cols-3 gap-3 mb-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3">
                <p className="text-[10px] text-emerald-400/70 mb-1 uppercase tracking-wider">Ingresos</p>
                <p className="text-sm font-mono font-semibold text-emerald-400 leading-tight">{fmt(totalIncome).replace("MX$","$")}</p>
              </div>
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-3">
                <p className="text-[10px] text-rose-400/70 mb-1 uppercase tracking-wider">Gastos</p>
                <p className="text-sm font-mono font-semibold text-rose-400 leading-tight">{fmt(totalExpense).replace("MX$","$")}</p>
              </div>
              <div className={`${savings >= 0 ? "bg-cyan-500/10 border-cyan-500/20" : "bg-orange-500/10 border-orange-500/20"} border rounded-2xl p-3`}>
                <p className={`text-[10px] mb-1 uppercase tracking-wider ${savings >= 0 ? "text-cyan-400/70" : "text-orange-400/70"}`}>Ahorro</p>
                <p className={`text-sm font-mono font-semibold leading-tight ${savings >= 0 ? "text-cyan-400" : "text-orange-400"}`}>{fmt(savings).replace("MX$","$")}</p>
              </div>
            </div>

            {/* Savings Progress */}
            {totalIncome > 0 && (
              <div className="px-4 mb-5">
                <div className="bg-slate-800/60 rounded-2xl p-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Tasa de ahorro</span>
                    <span className={savings >= 0 ? "text-cyan-400" : "text-rose-400"}>{totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(0, Math.min(100, (savings / totalIncome) * 100))}%`, background: savings >= 0 ? "linear-gradient(90deg,#22d3ee,#3b82f6)" : "#f43f5e" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Donut Chart */}
            {expenseByCategory.length > 0 && (
              <div className="px-4 mb-4">
                <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Gastos por categoría</p>
                  <DonutChart data={expenseByCategory} total={totalExpense} />
                </div>
              </div>
            )}

            {/* Recent Transactions */}
            <div className="px-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Recientes</p>
              {visibleTx.length === 0 ? (
                <div className="text-center py-10 text-slate-600">
                  <p className="text-3xl mb-2">💸</p>
                  <p className="text-sm">Sin transacciones en este periodo</p>
                </div>
              ) : visibleTx.slice(0, 5).map((t, i) => {
                const cat = getCat(t.categoryId);
                return (
                  <div key={t.id} className="flex items-center gap-3 py-3 border-b border-slate-800/60 last:border-0 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: cat.color + "22" }}>
                      {cat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{cat.name}</p>
                      <p className="text-xs text-slate-600 truncate">{t.description || t.date}</p>
                    </div>
                    <span className={`text-sm font-mono font-semibold ${t.type === "income" ? "text-emerald-400" : "text-rose-400"}`}>
                      {t.type === "income" ? "+" : "-"}{fmt(t.amount).replace("MX$","$")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TRANSACTIONS TAB ── */}
        {tab === "transactions" && (
          <div className="animate-fade-up px-4 pt-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Transacciones</h2>
              <div className="flex gap-1 bg-slate-800 rounded-xl p-1">
                {[["all","Todos"],["income","Ingresos"],["expense","Gastos"]].map(([v,l]) => (
                  <button key={v} onClick={() => setFilterType(v)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${filterType === v ? "bg-slate-600 text-white" : "text-slate-500"}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            {visibleTx.length === 0 ? (
              <div className="text-center py-16 text-slate-600">
                <p className="text-4xl mb-3">🗂️</p>
                <p className="text-sm">No hay registros</p>
              </div>
            ) : visibleTx.map((t, i) => {
              const cat = getCat(t.categoryId);
              return (
                <div key={t.id} className="flex items-center gap-3 bg-slate-800/40 rounded-2xl p-3 mb-2.5 animate-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: cat.color + "22" }}>
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{cat.name}</p>
                    <p className="text-xs text-slate-500">{t.date}{t.description ? ` · ${t.description}` : ""}</p>
                  </div>
                  <span className={`text-sm font-mono font-semibold mr-2 ${t.type === "income" ? "text-emerald-400" : "text-rose-400"}`}>
                    {t.type === "income" ? "+" : "-"}{fmt(t.amount).replace("MX$","$")}
                  </span>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => { setEditTx(t); setModal("edit"); }} className="p-1.5 text-slate-600 hover:text-cyan-400 transition-colors"><Icon name="edit" size={14} /></button>
                    <button onClick={() => deleteTx(t.id)} className="p-1.5 text-slate-600 hover:text-rose-400 transition-colors"><Icon name="trash" size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── CHARTS TAB ── */}
        {tab === "charts" && (
          <div className="animate-fade-up px-4 pt-5">
            <h2 className="text-lg font-semibold mb-4">Análisis</h2>
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Gastos por categoría</p>
              {expenseByCategory.length > 0 ? (
                <>
                  <DonutChart data={expenseByCategory} total={totalExpense} />
                  <div className="mt-5">
                    <BarChart data={expenseByCategory} max={expenseByCategory[0]?.value} />
                  </div>
                </>
              ) : <p className="text-sm text-slate-600 text-center py-6">Sin gastos en este periodo</p>}
            </div>
            {incomeByCategory.length > 0 && (
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 mb-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Ingresos por categoría</p>
                <DonutChart data={incomeByCategory} total={totalIncome} />
                <div className="mt-5">
                  <BarChart data={incomeByCategory} max={incomeByCategory[0]?.value} />
                </div>
              </div>
            )}
            {/* Summary comparison */}
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Resumen {periodLabels[period]}</p>
              <div className="space-y-3">
                {[{ label: "Ingresos", value: totalIncome, color: "#34d399", pct: 100 },
                  { label: "Gastos", value: totalExpense, color: "#f87171", pct: totalIncome > 0 ? (totalExpense/totalIncome)*100 : 0 },
                  { label: "Ahorro", value: Math.abs(savings), color: savings>=0?"#22d3ee":"#fb923c", pct: totalIncome > 0 ? Math.abs(savings/totalIncome)*100 : 0 }
                ].map(row => (
                  <div key={row.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{row.label}</span>
                      <span className="font-mono" style={{ color: row.color }}>{fmt(row.value).replace("MX$","$")}</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, row.pct)}%`, background: row.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === "settings" && (
          <div className="animate-fade-up px-4 pt-5">
            <h2 className="text-lg font-semibold mb-4">Configuración</h2>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Categorías</p>
              <CategoryManager categories={state.categories} onChange={saveCategories} />
            </div>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Datos</p>
              <div className="flex flex-col gap-3">
                <button onClick={exportBackup}
                  className="flex items-center gap-3 p-3 bg-slate-700/60 rounded-xl hover:bg-slate-700 transition-colors">
                  <Icon name="download" size={18} className="text-cyan-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Exportar Backup</p>
                    <p className="text-xs text-slate-500">Descarga un .json con todos tus datos</p>
                  </div>
                </button>
                <label className="flex items-center gap-3 p-3 bg-slate-700/60 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer">
                  <Icon name="upload" size={18} className="text-emerald-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Importar Backup</p>
                    <p className="text-xs text-slate-500">Restaura desde un archivo .json</p>
                  </div>
                  <input type="file" accept=".json" className="hidden" onChange={importBackup} />
                </label>
                <button onClick={() => { if (confirm("¿Borrar todos los datos?")) setState(DEFAULT_STATE); }}
                  className="flex items-center gap-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 transition-colors">
                  <Icon name="trash" size={18} className="text-rose-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-rose-400">Borrar todo</p>
                    <p className="text-xs text-rose-500/70">Esta acción no se puede deshacer</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-slate-700 pb-4">FinanzasPRO · localStorage · v2.0</div>
          </div>
        )}
      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 glass border-t border-slate-800/60 pb-safe">
        <div className="max-w-md mx-auto flex items-center h-16 px-2">
          {[
            { id: "home", icon: "home", label: "Inicio" },
            { id: "transactions", icon: "list", label: "Registros" },
            { id: "fab", icon: "plus", label: "" },
            { id: "charts", icon: "chart", label: "Análisis" },
            { id: "settings", icon: "settings", label: "Config" },
          ].map(item => {
            if (item.id === "fab") return (
              <div key="fab" className="flex-1 flex justify-center">
                <button onClick={() => setModal("add")}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-transform pulse -mt-5">
                  <Icon name="plus" size={24} />
                </button>
              </div>
            );
            const active = tab === item.id;
            return (
              <button key={item.id} onClick={() => setTab(item.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-1 transition-colors ${active ? "text-cyan-400" : "text-slate-600 hover:text-slate-400"}`}>
                <Icon name={item.icon} size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ADD MODAL */}
      <Modal open={modal === "add"} onClose={() => setModal(null)} title="Nueva Transacción">
        <TransactionForm categories={state.categories} onSave={saveTx} onClose={() => setModal(null)} />
      </Modal>

      {/* EDIT MODAL */}
      <Modal open={modal === "edit"} onClose={() => { setModal(null); setEditTx(null); }} title="Editar Transacción">
        {editTx && <TransactionForm categories={state.categories} onSave={saveTx} onClose={() => { setModal(null); setEditTx(null); }} initial={editTx} />}
      </Modal>
    </div>
  );
}

import { useState, useEffect, useCallback, useMemo } from "react";

// ================================================================
// © 2025 Dylan Miramontes Gomez — Todos los derechos reservados.
// Prohibida su copia, redistribución, modificación o venta
// sin autorización expresa y por escrito del autor.
// FinanzasPRO (Miramontes) — Uso bajo licencia personal únicamente.
// ================================================================

// ── AUTH CONFIG ─────────────────────────────────────────────────
// Contraseña real : Miramontes2025
// Lo que vive aquí es solo el hash SHA-256 — irreversible.
const CORRECT_HASH = "1c8406215ad95df29779fd7a5fb13130c190a2640dc356ef44058fce2993abef";
const DEVICE_KEY   = "fp_miramontes_activated";
const ATTEMPT_KEY  = "fp_attempts";
const MAX_ATTEMPTS = 5;

async function hashPassword(pw) {
  const enc  = new TextEncoder();
  const data = enc.encode(pw.trim().toLowerCase() + "miramontes_salt_2025");
  const buf  = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// ── ICONS ────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, className = "" }) => {
  const p = {
    plus:     "M12 4v16m8-8H4",
    trash:    "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    edit:     "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    home:     "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    list:     "M4 6h16M4 10h16M4 14h16M4 18h16",
    settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    chart:    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    x:        "M6 18L18 6M6 6l12 12",
    lock:     "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    shield:   "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    download: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
    upload:   "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
    wallet:   "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    tag:      "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
  };
  const eyePath = name === "eye"
    ? <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
    : null;
  const eyeOffPath = name === "eye_off"
    ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
    : null;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      {eyePath || eyeOffPath || (p[name] && <path strokeLinecap="round" strokeLinejoin="round" d={p[name]}/>)}
    </svg>
  );
};

// ── CONSTANTS ────────────────────────────────────────────────────
const EMOJIS = ["🏠","🚗","🍔","🛒","💊","🎮","✈️","👗","📱","💡","🎓","🐶","🏋️","☕","🎬","🎁","💰","📈","💼","🏦","💳","🔧","🎵","📚","🌿","🍺","🎯","💎","🧴","🧾"];

const DEFAULT_STATE = {
  categories: {
    income: [
      { id: "i1", name: "Salario",     icon: "💼", color: "#22d3ee" },
      { id: "i2", name: "Freelance",   icon: "💻", color: "#34d399" },
      { id: "i3", name: "Inversiones", icon: "📈", color: "#a78bfa" },
    ],
    expense: [
      { id: "e1", name: "Alimentación",    icon: "🍔", color: "#f472b6" },
      { id: "e2", name: "Transporte",      icon: "🚗", color: "#fb923c" },
      { id: "e3", name: "Servicios",       icon: "💡", color: "#facc15" },
      { id: "e4", name: "Entretenimiento", icon: "🎮", color: "#60a5fa" },
      { id: "e5", name: "Salud",           icon: "💊", color: "#f87171" },
    ],
  },
  transactions: [],
};

// ── HELPERS ──────────────────────────────────────────────────────
const genId = () => Math.random().toString(36).slice(2, 10);
const fmt   = n  => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

const getPeriodRange = period => {
  const today = new Date(); today.setHours(0,0,0,0);
  if (period === "weekly") {
    const s = new Date(today); s.setDate(today.getDate() - today.getDay());
    const e = new Date(s);    e.setDate(s.getDate() + 6);
    return { start: s, end: e };
  }
  if (period === "biweekly") {
    const d = today.getDate();
    if (d <= 15) return { start: new Date(today.getFullYear(), today.getMonth(), 1), end: new Date(today.getFullYear(), today.getMonth(), 15) };
    return { start: new Date(today.getFullYear(), today.getMonth(), 16), end: new Date(today.getFullYear(), today.getMonth() + 1, 0) };
  }
  return { start: new Date(today.getFullYear(), today.getMonth(), 1), end: new Date(today.getFullYear(), today.getMonth() + 1, 0) };
};

const filterByPeriod = (txs, period) => {
  const { start, end } = getPeriodRange(period);
  return txs.filter(t => { const d = new Date(t.date + "T00:00:00"); return d >= start && d <= end; });
};

const load = () => { try { const s = localStorage.getItem("fp_data_v3"); return s ? JSON.parse(s) : DEFAULT_STATE; } catch { return DEFAULT_STATE; } };
const persist = s => { try { localStorage.setItem("fp_data_v3", JSON.stringify(s)); } catch {} };

// ── LOGIN SCREEN ─────────────────────────────────────────────────
const LoginScreen = ({ onSuccess }) => {
  const [pw,       setPw]       = useState("");
  const [show,     setShow]     = useState(false);
  const [err,      setErr]      = useState("");
  const [loading,  setLoading]  = useState(false);
  const [attempts, setAttempts] = useState(() => { try { return parseInt(localStorage.getItem(ATTEMPT_KEY) || "0"); } catch { return 0; } });

  const blocked = attempts >= MAX_ATTEMPTS;

  const login = async () => {
    if (!pw.trim() || loading || blocked) return;
    setLoading(true); setErr("");
    try {
      const hash = await hashPassword(pw);
      if (hash === CORRECT_HASH) {
        localStorage.setItem(DEVICE_KEY, "1");
        localStorage.removeItem(ATTEMPT_KEY);
        onSuccess();
      } else {
        const n = attempts + 1;
        setAttempts(n);
        localStorage.setItem(ATTEMPT_KEY, String(n));
        setErr(n >= MAX_ATTEMPTS
          ? "Dispositivo bloqueado. Contacta a Dylan Miramontes."
          : `Contraseña incorrecta. ${MAX_ATTEMPTS - n} intentos restantes.`);
      }
    } catch { setErr("Error al verificar. Intenta de nuevo."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="min-h-screen bg-[#080d17] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box}body{margin:0}`}</style>

      {/* background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(34,211,238,0.09) 0%, transparent 70%)" }} />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)", boxShadow: "0 8px 32px rgba(34,211,238,0.25)" }}>
            <Icon name="wallet" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">FinanzasPRO</h1>
          <p className="text-sm mt-0.5" style={{ fontFamily: "'DM Mono',monospace", color: "rgba(34,211,238,0.55)" }}>Miramontes</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-7 shadow-2xl" style={{ background: "rgba(15,23,42,0.85)", backdropFilter: "blur(16px)", border: "0.5px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2 mb-5">
            <Icon name="lock" size={15} className="text-cyan-400" />
            <p className="text-sm text-slate-400">Acceso con licencia personal</p>
          </div>

          {blocked ? (
            <div className="text-center py-6">
              <p className="text-4xl mb-3">🔒</p>
              <p className="text-rose-400 text-sm font-semibold mb-1">Dispositivo bloqueado</p>
              <p className="text-xs text-slate-500">Demasiados intentos fallidos.<br />Contacta a Dylan Miramontes para soporte.</p>
            </div>
          ) : (
            <>
              <div className="relative mb-3">
                <input
                  type={show ? "text" : "password"}
                  placeholder="Contraseña de acceso"
                  value={pw}
                  onChange={e => { setPw(e.target.value); setErr(""); }}
                  onKeyDown={e => e.key === "Enter" && login()}
                  className="w-full rounded-xl px-4 py-3.5 pr-12 text-white text-sm focus:outline-none transition-colors"
                  style={{ background: "#1e293b", border: err ? "1px solid #f87171" : "1px solid #334155" }}
                />
                <button onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 transition-colors">
                  <Icon name={show ? "eye_off" : "eye"} size={16} />
                </button>
              </div>

              {err && <p className="text-rose-400 text-xs mb-3 text-center">{err}</p>}

              <button onClick={login} disabled={loading || !pw.trim()}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)", boxShadow: "0 4px 20px rgba(34,211,238,0.2)" }}>
                {loading ? "Verificando…" : "Ingresar"}
              </button>
            </>
          )}
        </div>

        {/* Footer copyright */}
        <div className="mt-6 text-center space-y-1">
          <p className="text-xs text-slate-700" style={{ fontFamily: "'DM Mono',monospace" }}>© 2025 Dylan Miramontes Gomez</p>
          <p className="text-xs text-slate-800" style={{ fontFamily: "'DM Mono',monospace" }}>Uso bajo licencia · Prohibida su redistribución</p>
        </div>
      </div>
    </div>
  );
};

// ── DONUT CHART ──────────────────────────────────────────────────
const DonutChart = ({ data, total }) => {
  if (!data.length || total === 0)
    return <div className="flex items-center justify-center h-36 text-slate-600 text-sm">Sin datos en este periodo</div>;
  let cum = 0;
  const R = 54, cx = 64, cy = 64, C = 2 * Math.PI * R;
  const segs = data.map(d => {
    const pct = d.value / total, dash = pct * C, gap = C - dash, offset = C - cum * C;
    cum += pct;
    return { ...d, dash, gap, offset };
  });
  return (
    <div className="flex items-center gap-4">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#1e293b" strokeWidth="18" />
        {segs.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={R} fill="none" stroke={s.color} strokeWidth="18"
            strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={s.offset}
            style={{ transition: "stroke-dasharray .6s ease", transformOrigin: "center", transform: "rotate(-90deg)" }} />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">TOTAL</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#f1f5f9" fontSize="10" fontWeight="bold" fontFamily="monospace">
          {fmt(total).replace("MX$", "$")}
        </text>
      </svg>
      <div className="flex flex-col gap-2 flex-1 min-w-0">
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

// ── BAR CHART — montos SIEMPRE visibles afuera ───────────────────
const BarChart = ({ data, max }) => (
  <div className="flex flex-col gap-2.5">
    {data.map((d, i) => (
      <div key={i} className="flex items-center gap-2">
        <span className="text-base w-6 text-center flex-shrink-0">{d.icon}</span>
        <div className="flex-1 bg-slate-800 rounded-full h-5 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${max ? Math.max(2, (d.value / max) * 100) : 0}%`, background: d.color }} />
        </div>
        <span className="text-xs font-mono text-slate-300 flex-shrink-0 w-24 text-right">
          {fmt(d.value).replace("MX$", "$")}
        </span>
      </div>
    ))}
  </div>
);

// ── MODAL ────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full sm:max-w-md bg-slate-900 border border-slate-700/60 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

// ── TRANSACTION FORM ─────────────────────────────────────────────
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

  const submit = () => {
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0 || !form.categoryId) return;
    onSave({ ...form, amount: amt, id: initial?.id || genId() });
    onClose();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Type toggle */}
      <div className="flex gap-2 bg-slate-800 rounded-xl p-1">
        {["expense", "income"].map(t => (
          <button key={t} onClick={() => setForm(f => ({ ...f, type: t, categoryId: "" }))}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${form.type === t ? t === "expense" ? "bg-rose-500 text-white" : "bg-emerald-500 text-white" : "text-slate-400"}`}>
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
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs transition-all ${form.categoryId === c.id ? "border-cyan-500 bg-cyan-500/10 text-cyan-300" : "border-slate-700 bg-slate-800 text-slate-400"}`}>
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
        <input type="text" placeholder="Nota rápida…" value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
      </div>

      <button onClick={submit}
        className="w-full py-3.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all"
        style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)" }}>
        {initial ? "Guardar cambios" : "Registrar"}
      </button>
    </div>
  );
};

// ── CATEGORY MANAGER ─────────────────────────────────────────────
const CategoryManager = ({ categories, onChange }) => {
  const [type,      setType]      = useState("expense");
  const [name,      setName]      = useState("");
  const [icon,      setIcon]      = useState("🏠");
  const [editId,    setEditId]    = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const cats = categories[type];

  const commit = () => {
    if (!name.trim()) return;
    const color = `hsl(${Math.floor(Math.random() * 360)},70%,60%)`;
    onChange(editId
      ? { ...categories, [type]: cats.map(c => c.id === editId ? { ...c, name: name.trim(), icon } : c) }
      : { ...categories, [type]: [...cats, { id: genId(), name: name.trim(), icon, color }] });
    setName(""); setIcon("🏠"); setEditId(null);
  };

  const startEdit = c => { setEditId(c.id); setName(c.name); setIcon(c.icon); };
  const cancel    = ()  => { setEditId(null); setName(""); setIcon("🏠"); };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 bg-slate-800 rounded-xl p-1">
        {["expense", "income"].map(t => (
          <button key={t} onClick={() => { setType(t); cancel(); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${type === t ? "bg-slate-700 text-white" : "text-slate-400"}`}>
            {t === "expense" ? "💸 Gastos" : "💰 Ingresos"}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="relative">
          <button onClick={() => setShowEmoji(!showEmoji)}
            className="w-12 h-12 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-xl text-xl hover:border-cyan-500 transition-colors">
            {icon}
          </button>
          {showEmoji && (
            <div className="absolute top-14 left-0 z-20 bg-slate-800 border border-slate-700 rounded-xl p-2 grid grid-cols-6 gap-1 shadow-2xl w-48">
              {EMOJIS.map(e => (
                <button key={e} onClick={() => { setIcon(e); setShowEmoji(false); }}
                  className="w-7 h-7 flex items-center justify-center text-lg hover:bg-slate-700 rounded-lg transition-colors">{e}</button>
              ))}
            </div>
          )}
        </div>
        <input type="text" placeholder="Nombre de categoría…" value={name}
          onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && commit()}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
        <button onClick={commit} className="px-3 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-400 transition-colors font-medium text-sm">{editId ? "✓" : "+"}</button>
        {editId && <button onClick={cancel} className="px-3 py-2 bg-slate-700 text-white rounded-xl text-sm">✕</button>}
      </div>

      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
        {cats.map(c => (
          <div key={c.id} className="flex items-center gap-3 bg-slate-800/60 rounded-xl px-3 py-2.5">
            <span className="text-xl">{c.icon}</span>
            <span className="flex-1 text-sm text-slate-300">{c.name}</span>
            <div className="flex gap-1.5">
              <button onClick={() => startEdit(c)} className="p-1.5 text-slate-500 hover:text-cyan-400 transition-colors"><Icon name="edit" size={14} /></button>
              <button onClick={() => onChange({ ...categories, [type]: cats.filter(x => x.id !== c.id) })} className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"><Icon name="trash" size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── PERIOD LABEL ─────────────────────────────────────────────────
const PeriodLabel = ({ period }) => {
  const { start, end } = getPeriodRange(period);
  const o = { day: "numeric", month: "short" };
  return <span className="text-xs text-slate-500">{start.toLocaleDateString("es-MX", o)} — {end.toLocaleDateString("es-MX", o)}</span>;
};

// ── MAIN APP ─────────────────────────────────────────────────────
export default function FinanceApp() {
  // Auth
  const [authed, setAuthed] = useState(() => { try { return localStorage.getItem(DEVICE_KEY) === "1"; } catch { return false; } });

  // State
  const [state,      setState]      = useState(load);
  const [period,     setPeriod]     = useState("monthly");
  const [tab,        setTab]        = useState("home");
  const [modal,      setModal]      = useState(null);
  const [editTx,     setEditTx]     = useState(null);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => { persist(state); }, [state]);

  // Derived
  const filtered     = useMemo(() => filterByPeriod(state.transactions, period), [state.transactions, period]);
  const totalIncome  = useMemo(() => filtered.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0),  [filtered]);
  const totalExpense = useMemo(() => filtered.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0), [filtered]);
  const savings      = totalIncome - totalExpense;
  const allCats      = useMemo(() => [...state.categories.income, ...state.categories.expense], [state.categories]);
  const getCat       = id => allCats.find(c => c.id === id) || { name: "Sin categoría", icon: "❓", color: "#64748b" };

  const expByCat = useMemo(() => {
    const m = {};
    filtered.filter(t => t.type === "expense").forEach(t => { m[t.categoryId] = (m[t.categoryId] || 0) + t.amount; });
    return Object.entries(m).map(([id, value]) => ({ ...getCat(id), value })).sort((a, b) => b.value - a.value);
  }, [filtered, allCats]);

  const incByCat = useMemo(() => {
    const m = {};
    filtered.filter(t => t.type === "income").forEach(t => { m[t.categoryId] = (m[t.categoryId] || 0) + t.amount; });
    return Object.entries(m).map(([id, value]) => ({ ...getCat(id), value })).sort((a, b) => b.value - a.value);
  }, [filtered, allCats]);

  const visibleTx = useMemo(() => {
    let list = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (filterType !== "all") list = list.filter(t => t.type === filterType);
    return list;
  }, [filtered, filterType]);

  // Actions
  const saveTx   = useCallback(tx => setState(s => ({ ...s, transactions: s.transactions.find(t => t.id === tx.id) ? s.transactions.map(t => t.id === tx.id ? tx : t) : [tx, ...s.transactions] })), []);
  const delTx    = useCallback(id => setState(s => ({ ...s, transactions: s.transactions.filter(t => t.id !== id) })), []);
  const saveCats = useCallback(cats => setState(s => ({ ...s, categories: cats })), []);

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `finanzas_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const importBackup = e => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader();
    r.onload = ev => { try { setState(JSON.parse(ev.target.result)); } catch {} };
    r.readAsText(file);
  };

  const PL = { weekly: "Semanal", biweekly: "Quincenal", monthly: "Mensual" };

  // ── Gate: show login if not authenticated ──
  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;

  // ── Main UI ──
  return (
    <div className="min-h-screen bg-[#080d17] text-white select-none"
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#334155;border-radius:99px}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(1)opacity(.4)}
        .mono{font-family:'DM Mono',monospace}
        @keyframes fu{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fu .4s ease both}
        @keyframes pr{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        .pulse{animation:pr 2s infinite}
      `}</style>

      {/* ── TOP BAR ── */}
      <header className="sticky top-0 z-30 border-b border-slate-800/60 px-4"
        style={{ background: "rgba(8,13,23,0.92)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center justify-between h-14 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)" }}>
              <Icon name="wallet" size={14} />
            </div>
            <div className="leading-none">
              <span className="font-semibold text-sm tracking-tight">FinanzasPRO</span>
              <span className="text-[10px] ml-1 mono" style={{ color: "rgba(34,211,238,0.55)" }}>Miramontes</span>
            </div>
          </div>
          <div className="flex gap-0.5 bg-slate-800/80 rounded-xl p-1">
            {Object.entries(PL).map(([k, v]) => (
              <button key={k} onClick={() => setPeriod(k)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === k ? "bg-slate-600 text-white" : "text-slate-500 hover:text-slate-300"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto pb-28">

        {/* ════ HOME ════ */}
        {tab === "home" && (
          <div className="fu">
            <div className="px-4 pt-5 pb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{PL[period]}</h2>
              <PeriodLabel period={period} />
            </div>

            {/* Summary cards */}
            <div className="px-4 grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Ingresos", val: totalIncome,  cls: "emerald" },
                { label: "Gastos",   val: totalExpense,  cls: "rose"    },
                { label: "Ahorro",   val: savings,       cls: savings >= 0 ? "cyan" : "orange" },
              ].map(({ label, val, cls }) => (
                <div key={label} className={`bg-${cls}-500/10 border border-${cls}-500/20 rounded-2xl p-3`}>
                  <p className={`text-[10px] text-${cls}-400/70 mb-1 uppercase tracking-wider`}>{label}</p>
                  <p className={`text-sm mono font-semibold text-${cls}-400`}>{fmt(val).replace("MX$", "$")}</p>
                </div>
              ))}
            </div>

            {/* Savings bar */}
            {totalIncome > 0 && (
              <div className="px-4 mb-5">
                <div className="bg-slate-800/60 rounded-2xl p-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Tasa de ahorro</span>
                    <span className={savings >= 0 ? "text-cyan-400" : "text-rose-400"}>
                      {Math.round((savings / totalIncome) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(0, Math.min(100, (savings / totalIncome) * 100))}%`, background: savings >= 0 ? "linear-gradient(90deg,#22d3ee,#3b82f6)" : "#f43f5e" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Donut */}
            {expByCat.length > 0 && (
              <div className="px-4 mb-4">
                <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Gastos por categoría</p>
                  <DonutChart data={expByCat} total={totalExpense} />
                </div>
              </div>
            )}

            {/* Recent */}
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
                  <div key={t.id} className="flex items-center gap-3 py-3 border-b border-slate-800/60 last:border-0 fu" style={{ animationDelay: `${i * .05}s` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: cat.color + "22" }}>{cat.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{cat.name}</p>
                      <p className="text-xs text-slate-600 truncate">{t.description || t.date}</p>
                    </div>
                    <span className={`text-sm mono font-semibold ${t.type === "income" ? "text-emerald-400" : "text-rose-400"}`}>
                      {t.type === "income" ? "+" : "-"}{fmt(t.amount).replace("MX$", "$")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════ TRANSACTIONS ════ */}
        {tab === "transactions" && (
          <div className="fu px-4 pt-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Transacciones</h2>
              <div className="flex gap-1 bg-slate-800 rounded-xl p-1">
                {[["all","Todos"],["income","Ingresos"],["expense","Gastos"]].map(([v, l]) => (
                  <button key={v} onClick={() => setFilterType(v)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${filterType === v ? "bg-slate-600 text-white" : "text-slate-500"}`}>{l}</button>
                ))}
              </div>
            </div>
            {visibleTx.length === 0 ? (
              <div className="text-center py-16 text-slate-600"><p className="text-4xl mb-3">🗂️</p><p className="text-sm">No hay registros</p></div>
            ) : visibleTx.map((t, i) => {
              const cat = getCat(t.categoryId);
              return (
                <div key={t.id} className="flex items-center gap-3 bg-slate-800/40 rounded-2xl p-3 mb-2.5 fu" style={{ animationDelay: `${i * .04}s` }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: cat.color + "22" }}>{cat.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{cat.name}</p>
                    <p className="text-xs text-slate-500">{t.date}{t.description ? ` · ${t.description}` : ""}</p>
                  </div>
                  <span className={`text-sm mono font-semibold mr-2 ${t.type === "income" ? "text-emerald-400" : "text-rose-400"}`}>
                    {t.type === "income" ? "+" : "-"}{fmt(t.amount).replace("MX$", "$")}
                  </span>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => { setEditTx(t); setModal("edit"); }} className="p-1.5 text-slate-600 hover:text-cyan-400 transition-colors"><Icon name="edit" size={14} /></button>
                    <button onClick={() => delTx(t.id)} className="p-1.5 text-slate-600 hover:text-rose-400 transition-colors"><Icon name="trash" size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ════ CHARTS ════ */}
        {tab === "charts" && (
          <div className="fu px-4 pt-5">
            <h2 className="text-lg font-semibold mb-4">Análisis</h2>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Gastos por categoría</p>
              {expByCat.length > 0 ? (
                <><DonutChart data={expByCat} total={totalExpense} /><div className="mt-5"><BarChart data={expByCat} max={expByCat[0]?.value} /></div></>
              ) : <p className="text-sm text-slate-600 text-center py-6">Sin gastos en este periodo</p>}
            </div>

            {incByCat.length > 0 && (
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 mb-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Ingresos por categoría</p>
                <DonutChart data={incByCat} total={totalIncome} />
                <div className="mt-5"><BarChart data={incByCat} max={incByCat[0]?.value} /></div>
              </div>
            )}

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Resumen {PL[period]}</p>
              <div className="space-y-3">
                {[
                  { label: "Ingresos", value: totalIncome,       color: "#34d399", pct: 100 },
                  { label: "Gastos",   value: totalExpense,       color: "#f87171", pct: totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0 },
                  { label: "Ahorro",   value: Math.abs(savings),  color: savings >= 0 ? "#22d3ee" : "#fb923c", pct: totalIncome > 0 ? Math.abs(savings / totalIncome) * 100 : 0 },
                ].map(row => (
                  <div key={row.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{row.label}</span>
                      <span className="mono" style={{ color: row.color }}>{fmt(row.value).replace("MX$", "$")}</span>
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

        {/* ════ SETTINGS ════ */}
        {tab === "settings" && (
          <div className="fu px-4 pt-5">
            <h2 className="text-lg font-semibold mb-4">Configuración</h2>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Categorías</p>
              <CategoryManager categories={state.categories} onChange={saveCats} />
            </div>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Datos</p>
              <div className="flex flex-col gap-3">
                <button onClick={exportBackup} className="flex items-center gap-3 p-3 bg-slate-700/60 rounded-xl hover:bg-slate-700 transition-colors">
                  <Icon name="download" size={18} className="text-cyan-400" />
                  <div className="text-left"><p className="text-sm font-medium">Exportar Backup</p><p className="text-xs text-slate-500">Descarga un .json con todos tus datos</p></div>
                </button>
                <label className="flex items-center gap-3 p-3 bg-slate-700/60 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer">
                  <Icon name="upload" size={18} className="text-emerald-400" />
                  <div className="text-left"><p className="text-sm font-medium">Importar Backup</p><p className="text-xs text-slate-500">Restaura desde un archivo .json</p></div>
                  <input type="file" accept=".json" className="hidden" onChange={importBackup} />
                </label>
                <button onClick={() => { if (confirm("¿Borrar todos los datos?")) setState(DEFAULT_STATE); }}
                  className="flex items-center gap-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 transition-colors">
                  <Icon name="trash" size={18} className="text-rose-400" />
                  <div className="text-left"><p className="text-sm font-medium text-rose-400">Borrar todo</p><p className="text-xs text-rose-500/70">Esta acción no se puede deshacer</p></div>
                </button>
              </div>
            </div>

            {/* ── COPYRIGHT NOTICE ── */}
            <div className="bg-slate-900 border border-slate-700/40 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="shield" size={14} className="text-cyan-400" />
                <p className="text-xs text-slate-400 uppercase tracking-wider mono">Licencia de uso</p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                © 2025 <span className="text-white font-semibold">Dylan Miramontes Gomez</span>. Todos los derechos reservados.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Esta aplicación es propiedad exclusiva de su autor. Queda estrictamente prohibida su copia,
                redistribución, modificación o venta sin autorización expresa y por escrito del titular.
                El uso no autorizado constituye una violación a los derechos de autor.
              </p>
            </div>

            <p className="text-center text-xs text-slate-800 pb-4 mono">FinanzasPRO · Miramontes · v3.0 · Uso bajo licencia</p>
          </div>
        )}
      </main>

      {/* ── BOTTOM NAV ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-800/60"
        style={{ background: "rgba(8,13,23,0.93)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-md mx-auto flex items-center h-16 px-2">
          {[
            { id: "home",         icon: "home",     label: "Inicio"   },
            { id: "transactions", icon: "list",     label: "Registros"},
            { id: "fab",          icon: "plus",     label: ""         },
            { id: "charts",       icon: "chart",    label: "Análisis" },
            { id: "settings",     icon: "settings", label: "Config"   },
          ].map(item => {
            if (item.id === "fab") return (
              <div key="fab" className="flex-1 flex justify-center">
                <button onClick={() => setModal("add")}
                  className="w-14 h-14 rounded-full flex items-center justify-center pulse -mt-5 hover:scale-105 active:scale-95 transition-transform"
                  style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)", boxShadow: "0 8px 24px rgba(34,211,238,0.3)" }}>
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

      {/* ── MODALS ── */}
      <Modal open={modal === "add"} onClose={() => setModal(null)} title="Nueva Transacción">
        <TransactionForm categories={state.categories} onSave={saveTx} onClose={() => setModal(null)} />
      </Modal>
      <Modal open={modal === "edit"} onClose={() => { setModal(null); setEditTx(null); }} title="Editar Transacción">
        {editTx && <TransactionForm categories={state.categories} onSave={saveTx} onClose={() => { setModal(null); setEditTx(null); }} initial={editTx} />}
      </Modal>
    </div>
  );
}

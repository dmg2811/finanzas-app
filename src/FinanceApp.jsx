import { useState, useEffect, useCallback, useMemo } from "react";

// ================================================================
// © 2025 Dylan Miramontes Gomez — Todos los derechos reservados.
// Prohibida su copia, redistribución, modificación o venta
// sin autorización expresa y por escrito del autor.
// FinanzasPRO (Miramontes) — Uso bajo licencia personal únicamente.
// ================================================================

const CORRECT_HASH = "1c8406215ad95df29779fd7a5fb13130c190a2640dc356ef44058fce2993abef";
const DEVICE_KEY   = "fp_miramontes_activated";
const ATTEMPT_KEY  = "fp_attempts";
const MAX_ATTEMPTS = 5;

async function hashPassword(pw) {
  const data = new TextEncoder().encode(pw.trim().toLowerCase() + "miramontes_salt_2025");
  const buf  = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
}

// ── GLOBAL CSS ───────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { overflow-x: hidden; }
  body { background: #080d17; color: #f1f5f9; font-family: 'DM Sans', sans-serif; overflow-x: hidden; -webkit-font-smoothing: antialiased; width: 100%; }
  #root { width: 100%; max-width: 100vw; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
  input[type=date]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(.4); }
  input[type=number]::-webkit-inner-spin-button { display: none; }
  .mono { font-family: 'DM Mono', monospace; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .fu { animation: fadeUp .3s ease both; }
  @keyframes pop { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
  .pop { animation: pop 2s ease-in-out infinite; }
  button { font-family: 'DM Sans', sans-serif; }
`;

// ── ICONS ────────────────────────────────────────────────────────
const D = {
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

const Ico = ({ n, s=20, c="", st={} }) => {
  if (n==="eye") return <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={c} style={st}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>;
  if (n==="eye_off") return <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={c} style={st}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>;
  return <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={c} style={st}>{D[n]&&<path strokeLinecap="round" strokeLinejoin="round" d={D[n]}/>}</svg>;
};

// ── EMOJIS & DATA ────────────────────────────────────────────────
const EMOJIS = ["🏠","🚗","🍔","🛒","💊","🎮","✈️","👗","📱","💡","🎓","🐶","🏋️","☕","🎬","🎁","💰","📈","💼","🏦","💳","🔧","🎵","📚","🌿","🍺","🎯","💎","🧴","🧾","🐱","⚽","🎸","🏖️","🛵","🎪"];

const DEFAULT = {
  categories: {
    income:  [{id:"i1",name:"Salario",icon:"💼",color:"#22d3ee"},{id:"i2",name:"Freelance",icon:"💻",color:"#34d399"},{id:"i3",name:"Inversiones",icon:"📈",color:"#a78bfa"}],
    expense: [{id:"e1",name:"Alimentación",icon:"🍔",color:"#f472b6"},{id:"e2",name:"Transporte",icon:"🚗",color:"#fb923c"},{id:"e3",name:"Servicios",icon:"💡",color:"#facc15"},{id:"e4",name:"Entretenimiento",icon:"🎮",color:"#60a5fa"},{id:"e5",name:"Salud",icon:"💊",color:"#f87171"}],
  },
  transactions: [],
};

// ── UTILS ────────────────────────────────────────────────────────
const uid  = () => Math.random().toString(36).slice(2,10);
const fmx  = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(n).replace("MX$","$");
const fmxS = n => { const a=Math.abs(n); if(a>=1e6) return `$${(n/1e6).toFixed(1)}M`; if(a>=1e4) return `$${(n/1000).toFixed(1)}k`; return fmx(n); };

const range = p => {
  const t=new Date(); t.setHours(0,0,0,0);
  if(p==="weekly"){ const s=new Date(t); s.setDate(t.getDate()-t.getDay()); const e=new Date(s); e.setDate(s.getDate()+6); return{start:s,end:e}; }
  if(p==="biweekly"){ const d=t.getDate(); if(d<=15) return{start:new Date(t.getFullYear(),t.getMonth(),1),end:new Date(t.getFullYear(),t.getMonth(),15)}; return{start:new Date(t.getFullYear(),t.getMonth(),16),end:new Date(t.getFullYear(),t.getMonth()+1,0)}; }
  return{start:new Date(t.getFullYear(),t.getMonth(),1),end:new Date(t.getFullYear(),t.getMonth()+1,0)};
};
const byPeriod = (txs,p) => { const{start,end}=range(p); return txs.filter(t=>{const d=new Date(t.date+"T00:00:00");return d>=start&&d<=end;}); };
const load  = () => { try{ const s=localStorage.getItem("fp_v5"); return s?JSON.parse(s):DEFAULT; }catch{ return DEFAULT; } };
const save  = s => { try{ localStorage.setItem("fp_v5",JSON.stringify(s)); }catch{} };

// ── DONUT ────────────────────────────────────────────────────────
const Donut = ({ data, total }) => {
  if (!data.length||!total) return <div style={{textAlign:"center",padding:"24px 0",color:"#334155",fontSize:13}}>Sin datos este periodo</div>;
  let cum=0;
  const R=42, cx=50, cy=50, C=2*Math.PI*R;
  const segs=data.map(d=>{ const pct=d.value/total,dash=pct*C,gap=C-dash,off=C-cum*C; cum+=pct; return{...d,dash,gap,off}; });
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,width:"100%"}}>
      <svg width="100" height="100" viewBox="0 0 100 100" style={{flexShrink:0}}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#1e293b" strokeWidth="13"/>
        {segs.map((s,i)=>(
          <circle key={i} cx={cx} cy={cy} r={R} fill="none" stroke={s.color} strokeWidth="13"
            strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={s.off}
            style={{transition:"stroke-dasharray .5s ease",transformOrigin:"center",transform:"rotate(-90deg)"}}/>
        ))}
        <text x={cx} y={cy-6} textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">TOTAL</text>
        <text x={cx} y={cy+7} textAnchor="middle" fill="#f1f5f9" fontSize="8" fontWeight="bold" fontFamily="monospace">{fmxS(total)}</text>
      </svg>
      <div style={{display:"flex",flexDirection:"column",gap:5,flex:1,minWidth:0}}>
        {data.slice(0,6).map((d,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,minWidth:0}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:d.color,flexShrink:0}}/>
            <span style={{fontSize:11,color:"#94a3b8",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.icon} {d.name}</span>
            <span className="mono" style={{fontSize:10,color:"#cbd5e1",flexShrink:0}}>{Math.round(d.value/total*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── BAR CHART ────────────────────────────────────────────────────
const Bars = ({ data, max }) => (
  <div style={{display:"flex",flexDirection:"column",gap:8}}>
    {data.map((d,i)=>(
      <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:14,width:22,textAlign:"center",flexShrink:0}}>{d.icon}</span>
        <div style={{flex:1,background:"#1e293b",borderRadius:99,height:18,overflow:"hidden"}}>
          <div style={{height:"100%",borderRadius:99,background:d.color,width:`${max?(d.value/max)*100:0}%`,minWidth:d.value>0?3:0,transition:"width .5s ease"}}/>
        </div>
        <span className="mono" style={{fontSize:11,color:"#94a3b8",flexShrink:0,minWidth:72,textAlign:"right"}}>{fmx(d.value)}</span>
      </div>
    ))}
  </div>
);

// ── MODAL ────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"flex-end"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(6px)"}}/>
      <div style={{position:"relative",width:"100%",background:"#0f172a",borderRadius:"20px 20px 0 0",maxHeight:"88vh",overflowY:"auto",border:"0.5px solid rgba(255,255,255,0.08)",boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:36,height:4,background:"#334155",borderRadius:99,margin:"10px auto 0"}}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px 12px",borderBottom:"0.5px solid rgba(255,255,255,0.06)"}}>
          <span style={{fontSize:16,fontWeight:600,color:"#f1f5f9"}}>{title}</span>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.05)",border:"none",borderRadius:8,padding:6,cursor:"pointer",color:"#94a3b8",display:"flex",lineHeight:0}}>
            <Ico n="x" s={15}/>
          </button>
        </div>
        <div style={{padding:"16px 16px 20px"}}>{children}</div>
      </div>
    </div>
  );
};

// ── TX FORM ──────────────────────────────────────────────────────
const TxForm = ({ categories, onSave, onClose, initial }) => {
  const today = new Date().toISOString().split("T")[0];
  const [f, setF] = useState({type:initial?.type||"expense",categoryId:initial?.categoryId||"",amount:initial?.amount||"",description:initial?.description||"",date:initial?.date||today});
  const cats = categories[f.type]||[];
  useEffect(()=>{ if(!initial&&cats.length>0) setF(x=>({...x,categoryId:cats[0].id})); },[f.type]);

  const submit = () => {
    const amt=parseFloat(f.amount);
    if(!amt||amt<=0||!f.categoryId) return;
    onSave({...f,amount:amt,id:initial?.id||uid()});
    onClose();
  };

  const inp = {background:"#1e293b",border:"0.5px solid #334155",borderRadius:12,padding:"12px 14px",color:"#f1f5f9",fontSize:15,outline:"none",width:"100%",fontFamily:"'DM Sans',sans-serif"};

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* type */}
      <div style={{display:"flex",gap:6,background:"#1e293b",borderRadius:12,padding:3}}>
        {["expense","income"].map(t=>(
          <button key={t} onClick={()=>setF(x=>({...x,type:t,categoryId:""}))}
            style={{flex:1,padding:"10px 0",borderRadius:9,border:"none",cursor:"pointer",fontWeight:600,fontSize:14,transition:"all .15s",
              background:f.type===t?t==="expense"?"linear-gradient(135deg,#f43f5e,#e11d48)":"linear-gradient(135deg,#10b981,#059669)":"transparent",
              color:f.type===t?"white":"#64748b"}}>
            {t==="expense"?"💸 Gasto":"💰 Ingreso"}
          </button>
        ))}
      </div>
      {/* amount */}
      <div>
        <label style={{fontSize:11,color:"#64748b",display:"block",marginBottom:5}}>Monto</label>
        <input type="number" inputMode="decimal" placeholder="0.00" value={f.amount} onChange={e=>setF(x=>({...x,amount:e.target.value}))}
          style={{...inp,fontSize:26,fontFamily:"'DM Mono',monospace",fontWeight:700,letterSpacing:-0.5}}/>
      </div>
      {/* category */}
      <div>
        <label style={{fontSize:11,color:"#64748b",display:"block",marginBottom:8}}>Categoría</label>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
          {cats.map(c=>(
            <button key={c.id} onClick={()=>setF(x=>({...x,categoryId:c.id}))}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"8px 4px",borderRadius:12,border:`1.5px solid ${f.categoryId===c.id?"#22d3ee":"rgba(255,255,255,0.06)"}`,background:f.categoryId===c.id?"rgba(34,211,238,0.08)":"rgba(255,255,255,0.02)",cursor:"pointer",transition:"all .15s"}}>
              <span style={{fontSize:20}}>{c.icon}</span>
              <span style={{fontSize:10,color:f.categoryId===c.id?"#22d3ee":"#64748b",textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",width:"90%"}}>{c.name}</span>
            </button>
          ))}
        </div>
      </div>
      {/* date */}
      <div>
        <label style={{fontSize:11,color:"#64748b",display:"block",marginBottom:5}}>Fecha</label>
        <input type="date" value={f.date} onChange={e=>setF(x=>({...x,date:e.target.value}))} style={inp}/>
      </div>
      {/* description */}
      <div>
        <label style={{fontSize:11,color:"#64748b",display:"block",marginBottom:5}}>Descripción (opcional)</label>
        <input type="text" placeholder="Nota rápida…" value={f.description} onChange={e=>setF(x=>({...x,description:e.target.value}))} style={inp}/>
      </div>
      <button onClick={submit}
        style={{width:"100%",padding:"14px 0",borderRadius:12,background:"linear-gradient(135deg,#22d3ee,#3b82f6)",border:"none",color:"white",fontWeight:700,fontSize:15,cursor:"pointer",boxShadow:"0 4px 16px rgba(34,211,238,0.2)"}}>
        {initial?"Guardar cambios":"Registrar"}
      </button>
    </div>
  );
};

// ── CATEGORY MANAGER ─────────────────────────────────────────────
const CatManager = ({ categories, onChange }) => {
  const [type,setType]=useState("expense");
  const [name,setName]=useState("");
  const [icon,setIcon]=useState("🏠");
  const [editId,setEditId]=useState(null);
  const [showEm,setShowEm]=useState(false);
  const cats=categories[type];

  const commit=()=>{
    if(!name.trim()) return;
    const color=`hsl(${Math.floor(Math.random()*360)},65%,55%)`;
    onChange(editId
      ?{...categories,[type]:cats.map(c=>c.id===editId?{...c,name:name.trim(),icon}:c)}
      :{...categories,[type]:[...cats,{id:uid(),name:name.trim(),icon,color}]});
    setName(""); setIcon("🏠"); setEditId(null);
  };
  const cancel=()=>{setEditId(null);setName("");setIcon("🏠");};
  const inp={flex:1,background:"#1e293b",border:"0.5px solid #334155",borderRadius:10,padding:"10px 12px",color:"#f1f5f9",fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif"};

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",gap:4,background:"#1e293b",borderRadius:12,padding:3}}>
        {["expense","income"].map(t=>(
          <button key={t} onClick={()=>{setType(t);cancel();}}
            style={{flex:1,padding:"8px 0",borderRadius:9,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:type===t?"#334155":"transparent",color:type===t?"#f1f5f9":"#64748b",transition:"all .15s"}}>
            {t==="expense"?"💸 Gastos":"💰 Ingresos"}
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <div style={{position:"relative"}}>
          <button onClick={()=>setShowEm(!showEm)} style={{width:44,height:44,borderRadius:10,background:"#1e293b",border:"0.5px solid #334155",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{icon}</button>
          {showEm&&(
            <div style={{position:"absolute",top:50,left:0,zIndex:30,background:"#1e293b",border:"0.5px solid #334155",borderRadius:12,padding:8,display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:3,boxShadow:"0 8px 32px rgba(0,0,0,0.6)",width:210}}>
              {EMOJIS.map(e=><button key={e} onClick={()=>{setIcon(e);setShowEm(false);}} style={{width:28,height:28,fontSize:15,background:"none",border:"none",cursor:"pointer",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>{e}</button>)}
            </div>
          )}
        </div>
        <input type="text" placeholder="Nombre…" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&commit()} style={inp}/>
        <button onClick={commit} style={{padding:"0 14px",height:44,background:"#22d3ee",color:"#080d17",border:"none",borderRadius:10,fontWeight:700,fontSize:18,cursor:"pointer"}}>{editId?"✓":"+"}</button>
        {editId&&<button onClick={cancel} style={{padding:"0 12px",height:44,background:"#334155",color:"#f1f5f9",border:"none",borderRadius:10,fontSize:15,cursor:"pointer"}}>✕</button>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:220,overflowY:"auto"}}>
        {cats.map(c=>(
          <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.02)",borderRadius:12,padding:"9px 12px",border:"0.5px solid rgba(255,255,255,0.05)"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:c.color,flexShrink:0}}/>
            <span style={{fontSize:18}}>{c.icon}</span>
            <span style={{flex:1,fontSize:13,color:"#cbd5e1"}}>{c.name}</span>
            <button onClick={()=>{setEditId(c.id);setName(c.name);setIcon(c.icon);}} style={{background:"none",border:"none",cursor:"pointer",color:"#334155",padding:4,display:"flex"}}
              onMouseEnter={e=>e.currentTarget.style.color="#22d3ee"} onMouseLeave={e=>e.currentTarget.style.color="#334155"}>
              <Ico n="edit" s={14}/>
            </button>
            <button onClick={()=>onChange({...categories,[type]:cats.filter(x=>x.id!==c.id)})} style={{background:"none",border:"none",cursor:"pointer",color:"#334155",padding:4,display:"flex"}}
              onMouseEnter={e=>e.currentTarget.style.color="#f87171"} onMouseLeave={e=>e.currentTarget.style.color="#334155"}>
              <Ico n="trash" s={14}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── LOGIN ────────────────────────────────────────────────────────
const Login = ({ onSuccess }) => {
  const [pw,setPw]=useState(""); const [show,setShow]=useState(false);
  const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  const [tries,setTries]=useState(()=>{ try{ return parseInt(localStorage.getItem(ATTEMPT_KEY)||"0"); }catch{ return 0; } });
  const blocked=tries>=MAX_ATTEMPTS;

  const go=async()=>{
    if(!pw.trim()||loading||blocked) return;
    setLoading(true); setErr("");
    try {
      const hash=await hashPassword(pw);
      if(hash===CORRECT_HASH){ localStorage.setItem(DEVICE_KEY,"1"); localStorage.removeItem(ATTEMPT_KEY); onSuccess(); }
      else { const n=tries+1; setTries(n); localStorage.setItem(ATTEMPT_KEY,String(n)); setErr(n>=MAX_ATTEMPTS?"Dispositivo bloqueado. Contacta a Dylan Miramontes.":`Contraseña incorrecta. ${MAX_ATTEMPTS-n} intento${MAX_ATTEMPTS-n!==1?"s":""} restante${MAX_ATTEMPTS-n!==1?"s":""}.`); }
    }catch{ setErr("Error. Intenta de nuevo."); }
    finally{ setLoading(false); }
  };

  return (
    <div style={{minHeight:"100vh",background:"#080d17",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 20px",position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",height:"60%",background:"radial-gradient(ellipse 80% 60% at 50% 0%,rgba(34,211,238,0.08) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{width:"100%",maxWidth:360,position:"relative"}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:32}}>
          <div style={{width:60,height:60,borderRadius:18,background:"linear-gradient(135deg,#22d3ee,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,boxShadow:"0 8px 28px rgba(34,211,238,0.22)"}}>
            <Ico n="wallet" s={26}/>
          </div>
          <h1 style={{fontSize:24,fontWeight:700,color:"#f1f5f9",margin:0,letterSpacing:-0.5}}>FinanzasPRO</h1>
          <p className="mono" style={{fontSize:12,color:"rgba(34,211,238,0.55)",marginTop:3}}>Miramontes</p>
        </div>
        <div style={{background:"rgba(15,23,42,0.95)",border:"0.5px solid rgba(255,255,255,0.07)",borderRadius:22,padding:24,backdropFilter:"blur(20px)",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:18}}>
            <Ico n="lock" s={14} st={{color:"#22d3ee"}}/>
            <span style={{fontSize:13,color:"#64748b"}}>Acceso con licencia personal</span>
          </div>
          {blocked?(
            <div style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{fontSize:36,marginBottom:10}}>🔒</div>
              <p style={{color:"#f87171",fontSize:14,fontWeight:600,marginBottom:4}}>Dispositivo bloqueado</p>
              <p style={{color:"#475569",fontSize:12}}>Contacta a Dylan Miramontes para soporte.</p>
            </div>
          ):(
            <>
              <div style={{position:"relative",marginBottom:err?6:14}}>
                <input type={show?"text":"password"} placeholder="Contraseña de acceso" value={pw}
                  onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()}
                  style={{width:"100%",background:"#1e293b",border:`1px solid ${err?"#f87171":"#334155"}`,borderRadius:12,padding:"13px 44px 13px 14px",color:"#f1f5f9",fontSize:15,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
                <button onClick={()=>setShow(!show)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#475569",display:"flex",padding:4}}>
                  <Ico n={show?"eye_off":"eye"} s={16}/>
                </button>
              </div>
              {err&&<p style={{color:"#f87171",fontSize:12,textAlign:"center",marginBottom:12}}>{err}</p>}
              <button onClick={go} disabled={loading||!pw.trim()}
                style={{width:"100%",padding:"14px 0",borderRadius:12,background:"linear-gradient(135deg,#22d3ee,#3b82f6)",border:"none",color:"white",fontWeight:700,fontSize:15,cursor:loading||!pw.trim()?"not-allowed":"pointer",opacity:loading||!pw.trim()?0.45:1,transition:"opacity .2s"}}>
                {loading?"Verificando…":"Ingresar"}
              </button>
            </>
          )}
        </div>
        <p className="mono" style={{textAlign:"center",fontSize:10,color:"#1e293b",marginTop:16}}>© 2025 Dylan Miramontes Gomez · Uso bajo licencia</p>
      </div>
    </div>
  );
};

// ── SECTION WRAPPER ───────────────────────────────────────────────
const Section = ({ label, children }) => (
  <div style={{background:"rgba(255,255,255,0.03)",border:"0.5px solid rgba(255,255,255,0.06)",borderRadius:18,padding:"14px 14px",marginBottom:12}}>
    {label&&<p style={{fontSize:10,color:"#475569",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>{label}</p>}
    {children}
  </div>
);

// ── PERIOD LABEL ─────────────────────────────────────────────────
const PLabel = ({ period }) => {
  const{start,end}=range(period);
  const o={day:"numeric",month:"short"};
  return <span style={{fontSize:11,color:"#475569"}}>{start.toLocaleDateString("es-MX",o)} — {end.toLocaleDateString("es-MX",o)}</span>;
};

// ── MAIN ─────────────────────────────────────────────────────────
export default function App() {
  const [authed,setAuthed]=useState(()=>{ try{ return localStorage.getItem(DEVICE_KEY)==="1"; }catch{ return false; } });
  const [state,setState]=useState(load);
  const [period,setPeriod]=useState("monthly");
  const [tab,setTab]=useState("home");
  const [modal,setModal]=useState(null);
  const [editTx,setEditTx]=useState(null);
  const [filter,setFilter]=useState("all");

  useEffect(()=>{ save(state); },[state]);

  const filtered = useMemo(()=>byPeriod(state.transactions,period),[state.transactions,period]);
  const totInc   = useMemo(()=>filtered.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0),[filtered]);
  const totExp   = useMemo(()=>filtered.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0),[filtered]);
  const sav      = totInc-totExp;
  const allCats  = useMemo(()=>[...state.categories.income,...state.categories.expense],[state.categories]);
  const getCat   = id=>allCats.find(c=>c.id===id)||{name:"Sin categoría",icon:"❓",color:"#475569"};

  const expByCat = useMemo(()=>{ const m={}; filtered.filter(t=>t.type==="expense").forEach(t=>{m[t.categoryId]=(m[t.categoryId]||0)+t.amount;}); return Object.entries(m).map(([id,value])=>({...getCat(id),value})).sort((a,b)=>b.value-a.value); },[filtered,allCats]);
  const incByCat = useMemo(()=>{ const m={}; filtered.filter(t=>t.type==="income").forEach(t=>{m[t.categoryId]=(m[t.categoryId]||0)+t.amount;}); return Object.entries(m).map(([id,value])=>({...getCat(id),value})).sort((a,b)=>b.value-a.value); },[filtered,allCats]);

  const visTx = useMemo(()=>{ let l=[...filtered].sort((a,b)=>new Date(b.date)-new Date(a.date)); if(filter!=="all") l=l.filter(t=>t.type===filter); return l; },[filtered,filter]);

  const saveTx   = useCallback(tx=>setState(s=>({...s,transactions:s.transactions.find(t=>t.id===tx.id)?s.transactions.map(t=>t.id===tx.id?tx:t):[tx,...s.transactions]})),[]);
  const delTx    = useCallback(id=>setState(s=>({...s,transactions:s.transactions.filter(t=>t.id!==id)})),[]);
  const saveCats = useCallback(cats=>setState(s=>({...s,categories:cats})),[]);

  const exportB  = () => { const b=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}); const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`finanzas_${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(u); };
  const importB  = e => { const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>{try{setState(JSON.parse(ev.target.result));}catch{}}; r.readAsText(f); };

  const PL = { weekly:"Semanal", biweekly:"Quincenal", monthly:"Mensual" };
  const savPct = totInc>0?Math.max(0,Math.min(100,Math.round((sav/totInc)*100))):0;

  if (!authed) return <Login onSuccess={()=>setAuthed(true)}/>;

  return (
    <div style={{minHeight:"100vh",background:"#080d17",color:"#f1f5f9",width:"100%",maxWidth:"100vw",overflowX:"hidden"}}>
      <style>{CSS}</style>

      {/* ── HEADER ── */}
      <header style={{position:"sticky",top:0,zIndex:100,background:"rgba(8,13,23,0.96)",backdropFilter:"blur(16px)",borderBottom:"0.5px solid rgba(255,255,255,0.05)",width:"100%"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:52,padding:"0 14px",maxWidth:480,margin:"0 auto"}}>
          {/* logo — compact */}
          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#22d3ee,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Ico n="wallet" s={15}/>
            </div>
            <div style={{lineHeight:1.1}}>
              <span style={{fontSize:14,fontWeight:700,color:"#f1f5f9",letterSpacing:-0.3,display:"block"}}>FinanzasPRO</span>
              <span className="mono" style={{fontSize:9,color:"rgba(34,211,238,0.5)"}}>Miramontes</span>
            </div>
          </div>
          {/* period — 3 compact pills */}
          <div style={{display:"flex",gap:2,background:"rgba(255,255,255,0.04)",borderRadius:10,padding:3,flexShrink:0}}>
            {Object.entries(PL).map(([k,v])=>(
              <button key={k} onClick={()=>setPeriod(k)}
                style={{padding:"5px 9px",borderRadius:7,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,transition:"all .15s",background:period===k?"rgba(255,255,255,0.12)":"transparent",color:period===k?"#f1f5f9":"#475569"}}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main style={{maxWidth:480,margin:"0 auto",padding:"0 12px 90px"}}>

        {/* ══ HOME ══ */}
        {tab==="home"&&(
          <div className="fu">
            {/* period title row */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 2px 10px"}}>
              <h2 style={{fontSize:18,fontWeight:700,margin:0}}>{PL[period]}</h2>
              <PLabel period={period}/>
            </div>

            {/* 3 summary pills */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
              {[
                {label:"Ingresos",val:totInc,color:"#34d399",bg:"rgba(16,185,129,0.08)",border:"rgba(16,185,129,0.18)"},
                {label:"Gastos",  val:totExp, color:"#f87171",bg:"rgba(244,63,94,0.08)",  border:"rgba(244,63,94,0.18)"},
                {label:"Ahorro",  val:sav,    color:sav>=0?"#22d3ee":"#fb923c",bg:sav>=0?"rgba(34,211,238,0.08)":"rgba(251,146,60,0.08)",border:sav>=0?"rgba(34,211,238,0.18)":"rgba(251,146,60,0.18)"},
              ].map(({label,val,color,bg,border})=>(
                <div key={label} style={{background:bg,border:`1px solid ${border}`,borderRadius:14,padding:"10px 8px"}}>
                  <p style={{fontSize:9,color,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5,opacity:0.8}}>{label}</p>
                  <p className="mono" style={{fontSize:13,fontWeight:700,color,lineHeight:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fmxS(val)}</p>
                </div>
              ))}
            </div>

            {/* savings bar */}
            {totInc>0&&(
              <div style={{background:"rgba(255,255,255,0.03)",border:"0.5px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"11px 14px",marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                  <span style={{fontSize:12,color:"#64748b"}}>Tasa de ahorro</span>
                  <span className="mono" style={{fontSize:12,fontWeight:600,color:sav>=0?"#22d3ee":"#f87171"}}>{savPct}%</span>
                </div>
                <div style={{height:5,background:"#1e293b",borderRadius:99,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${savPct}%`,borderRadius:99,background:sav>=0?"linear-gradient(90deg,#22d3ee,#3b82f6)":"#f43f5e",transition:"width .5s ease"}}/>
                </div>
              </div>
            )}

            {/* donut */}
            {expByCat.length>0&&(
              <Section label="Gastos por categoría">
                <Donut data={expByCat} total={totExp}/>
              </Section>
            )}

            {/* recent */}
            <p style={{fontSize:10,color:"#475569",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Recientes</p>
            {visTx.length===0?(
              <div style={{textAlign:"center",padding:"32px 0",color:"#334155"}}>
                <p style={{fontSize:32,marginBottom:8}}>💸</p>
                <p style={{fontSize:13}}>Sin transacciones en este periodo</p>
              </div>
            ):visTx.slice(0,5).map((t,i)=>{ const cat=getCat(t.categoryId); return (
              <div key={t.id} className="fu" style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"0.5px solid rgba(255,255,255,0.04)",animationDelay:`${i*.05}s`}}>
                <div style={{width:38,height:38,borderRadius:12,background:cat.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{cat.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:13,fontWeight:500,color:"#e2e8f0",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cat.name}</p>
                  <p style={{fontSize:11,color:"#475569",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.description||t.date}</p>
                </div>
                <span className="mono" style={{fontSize:13,fontWeight:700,color:t.type==="income"?"#34d399":"#f87171",flexShrink:0}}>
                  {t.type==="income"?"+":"-"}{fmxS(t.amount)}
                </span>
              </div>
            );})}
          </div>
        )}

        {/* ══ TRANSACTIONS ══ */}
        {tab==="transactions"&&(
          <div className="fu">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 2px 12px"}}>
              <h2 style={{fontSize:18,fontWeight:700,margin:0}}>Transacciones</h2>
              <div style={{display:"flex",gap:3,background:"rgba(255,255,255,0.04)",borderRadius:10,padding:3}}>
                {[["all","Todos"],["income","Ing."],["expense","Gas."]].map(([v,l])=>(
                  <button key={v} onClick={()=>setFilter(v)}
                    style={{padding:"5px 9px",borderRadius:7,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,transition:"all .15s",background:filter===v?"rgba(255,255,255,0.12)":"transparent",color:filter===v?"#f1f5f9":"#475569"}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            {visTx.length===0?(
              <div style={{textAlign:"center",padding:"48px 0",color:"#334155"}}><p style={{fontSize:36,marginBottom:8}}>🗂️</p><p style={{fontSize:13}}>No hay registros</p></div>
            ):visTx.map((t,i)=>{ const cat=getCat(t.categoryId); return (
              <div key={t.id} className="fu" style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.025)",borderRadius:16,padding:"11px 12px",marginBottom:8,border:"0.5px solid rgba(255,255,255,0.05)",animationDelay:`${i*.04}s`}}>
                <div style={{width:40,height:40,borderRadius:13,background:cat.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{cat.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:13,fontWeight:500,color:"#e2e8f0",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cat.name}</p>
                  <p style={{fontSize:11,color:"#475569",margin:0}}>{t.date}{t.description?` · ${t.description}`:""}</p>
                </div>
                <span className="mono" style={{fontSize:13,fontWeight:700,color:t.type==="income"?"#34d399":"#f87171",flexShrink:0,marginRight:6}}>
                  {t.type==="income"?"+":"-"}{fmxS(t.amount)}
                </span>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>
                  <button onClick={()=>{setEditTx(t);setModal("edit");}} style={{background:"none",border:"none",cursor:"pointer",color:"#334155",padding:4,display:"flex",lineHeight:0}}
                    onMouseEnter={e=>e.currentTarget.style.color="#22d3ee"} onMouseLeave={e=>e.currentTarget.style.color="#334155"}><Ico n="edit" s={13}/></button>
                  <button onClick={()=>delTx(t.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#334155",padding:4,display:"flex",lineHeight:0}}
                    onMouseEnter={e=>e.currentTarget.style.color="#f87171"} onMouseLeave={e=>e.currentTarget.style.color="#334155"}><Ico n="trash" s={13}/></button>
                </div>
              </div>
            );})}
          </div>
        )}

        {/* ══ CHARTS ══ */}
        {tab==="charts"&&(
          <div className="fu">
            <h2 style={{fontSize:18,fontWeight:700,margin:"14px 2px 12px"}}>Análisis</h2>

            <Section label="Gastos por categoría">
              {expByCat.length>0?(
                <><Donut data={expByCat} total={totExp}/><div style={{marginTop:16}}><Bars data={expByCat} max={expByCat[0]?.value}/></div></>
              ):<p style={{textAlign:"center",color:"#334155",fontSize:13,padding:"16px 0"}}>Sin gastos este periodo</p>}
            </Section>

            {incByCat.length>0&&(
              <Section label="Ingresos por categoría">
                <Donut data={incByCat} total={totInc}/>
                <div style={{marginTop:16}}><Bars data={incByCat} max={incByCat[0]?.value}/></div>
              </Section>
            )}

            <Section label={`Resumen ${PL[period]}`}>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {[
                  {label:"Ingresos",value:totInc,color:"#34d399",pct:100},
                  {label:"Gastos",  value:totExp, color:"#f87171",pct:totInc>0?(totExp/totInc)*100:0},
                  {label:"Ahorro",  value:Math.abs(sav),color:sav>=0?"#22d3ee":"#fb923c",pct:totInc>0?Math.abs(sav/totInc)*100:0},
                ].map(row=>(
                  <div key={row.label}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:12,color:"#94a3b8"}}>{row.label}</span>
                      <span className="mono" style={{fontSize:12,color:row.color}}>{fmx(row.value)}</span>
                    </div>
                    <div style={{height:5,background:"#1e293b",borderRadius:99,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.min(100,row.pct)}%`,background:row.color,borderRadius:99,transition:"width .5s ease"}}/>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* ══ SETTINGS ══ */}
        {tab==="settings"&&(
          <div className="fu">
            <h2 style={{fontSize:18,fontWeight:700,margin:"14px 2px 12px"}}>Configuración</h2>

            <Section label="Gestionar categorías">
              <CatManager categories={state.categories} onChange={saveCats}/>
            </Section>

            <Section label="Datos y respaldo">
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  {icon:"download",color:"#22d3ee",label:"Exportar Backup",sub:"Descarga un .json con tus datos",onClick:exportB},
                  {icon:"trash",color:"#f87171",label:"Borrar todo",sub:"Elimina todos los registros",onClick:()=>{if(confirm("¿Borrar todos los datos?"))setState(DEFAULT);}},
                ].map(b=>(
                  <button key={b.label} onClick={b.onClick}
                    style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"rgba(255,255,255,0.02)",border:"0.5px solid rgba(255,255,255,0.05)",borderRadius:14,cursor:"pointer",width:"100%",textAlign:"left"}}>
                    <Ico n={b.icon} s={18} st={{color:b.color,flexShrink:0}}/>
                    <div><p style={{fontSize:13,fontWeight:500,color:"#e2e8f0",margin:0}}>{b.label}</p><p style={{fontSize:11,color:"#475569",margin:0}}>{b.sub}</p></div>
                  </button>
                ))}
                <label style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"rgba(255,255,255,0.02)",border:"0.5px solid rgba(255,255,255,0.05)",borderRadius:14,cursor:"pointer"}}>
                  <Ico n="upload" s={18} st={{color:"#34d399",flexShrink:0}}/>
                  <div><p style={{fontSize:13,fontWeight:500,color:"#e2e8f0",margin:0}}>Importar Backup</p><p style={{fontSize:11,color:"#475569",margin:0}}>Restaura desde un archivo .json</p></div>
                  <input type="file" accept=".json" style={{display:"none"}} onChange={importB}/>
                </label>
              </div>
            </Section>

            <Section>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <Ico n="shield" s={14} st={{color:"#22d3ee"}}/>
                <span className="mono" style={{fontSize:10,color:"#22d3ee",textTransform:"uppercase",letterSpacing:"0.1em"}}>Licencia de uso</span>
              </div>
              <p style={{fontSize:12,color:"#64748b",lineHeight:1.6,margin:0}}>© 2025 <strong style={{color:"#f1f5f9"}}>Dylan Miramontes Gomez</strong>. Todos los derechos reservados. Prohibida su copia, redistribución o venta sin autorización expresa del autor.</p>
            </Section>

            <p className="mono" style={{textAlign:"center",fontSize:10,color:"#1e293b",marginTop:4}}>FinanzasPRO · Miramontes · v5.0</p>
          </div>
        )}
      </main>

      {/* ── BOTTOM NAV ── */}
      <nav style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"rgba(8,13,23,0.97)",backdropFilter:"blur(20px)",borderTop:"0.5px solid rgba(255,255,255,0.05)",width:"100%"}}>
        <div style={{display:"flex",alignItems:"center",height:60,maxWidth:480,margin:"0 auto",padding:"0 6px"}}>
          {[{id:"home",icon:"home",label:"Inicio"},{id:"transactions",icon:"list",label:"Registros"},{id:"fab"},{id:"charts",icon:"chart",label:"Análisis"},{id:"settings",icon:"settings",label:"Config"}].map(item=>{
            if(item.id==="fab") return (
              <div key="fab" style={{flex:1,display:"flex",justifyContent:"center"}}>
                <button onClick={()=>setModal("add")} className="pop"
                  style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#22d3ee,#3b82f6)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginTop:-16,boxShadow:"0 6px 20px rgba(34,211,238,0.32)",color:"white",lineHeight:0}}>
                  <Ico n="plus" s={22}/>
                </button>
              </div>
            );
            const active=tab===item.id;
            return (
              <button key={item.id} onClick={()=>setTab(item.id)}
                style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"6px 0",background:"none",border:"none",cursor:"pointer",color:active?"#22d3ee":"#334155",transition:"color .15s",lineHeight:0}}>
                <Ico n={item.icon} s={19}/>
                <span style={{fontSize:9,fontWeight:600,lineHeight:1.2}}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── MODALS ── */}
      <Modal open={modal==="add"} onClose={()=>setModal(null)} title="Nueva Transacción">
        <TxForm categories={state.categories} onSave={saveTx} onClose={()=>setModal(null)}/>
      </Modal>
      <Modal open={modal==="edit"} onClose={()=>{setModal(null);setEditTx(null);}} title="Editar Transacción">
        {editTx&&<TxForm categories={state.categories} onSave={saveTx} onClose={()=>{setModal(null);setEditTx(null);}} initial={editTx}/>}
      </Modal>
    </div>
  );
}
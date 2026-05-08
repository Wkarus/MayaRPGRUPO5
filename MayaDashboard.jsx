import { useState, useEffect, useCallback } from "react";

/* ─── DESIGN TOKENS ─── */
const T = {
  navy: "#0F2236", navy2: "#172E45", navy3: "#1E3A57",
  teal: "#2AACBF", tealDim: "#1D8FA0", tealPale: "#EAF7FA",
  green: "#17B978", greenPale: "#E6F8F2",
  amber: "#F0A500", amberPale: "#FEF6E4",
  red: "#E5484D", redPale: "#FEECEC",
  ink: "#0F1923", ink2: "#3D5066", ink3: "#8A9BB0", ink4: "#BFC9D4",
  paper: "#F0F4F7", surface: "#FFFFFF",
  border: "rgba(0,0,0,0.07)",
};

/* ─── GOOGLE FONTS (inject once) ─── */
if (!document.getElementById("maya-fonts")) {
  const l = document.createElement("link");
  l.id = "maya-fonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

/* ─── SEED DATA ─── */
const TODAY = new Date();
const TODAYS = TODAY.toISOString().split("T")[0];
const MONTHS = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const WDAYS  = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];

const SEED_PATIENTS = [
  { id:1, nome:"Ana Paula Santos",  nasc:"1989-05-10", phone:"(11) 98765-4321", obj:"Dor lombar crônica e postura",        obs:"Trabalha muito sentada.",     ultima:"2025-05-06" },
  { id:2, nome:"Rodrigo Mendes",    nasc:"1985-03-22", phone:"(11) 91234-5678", obj:"Reabilitação pós-cirurgia no ombro", obs:"Cirurgia em Jan/2025.",        ultima:"2025-04-28" },
  { id:3, nome:"Carla Ferreira",    nasc:"1992-07-14", phone:"(11) 99876-5432", obj:"Correção postural e cervical",        obs:"Histórico de ansiedade.",      ultima:"2025-04-25" },
  { id:4, nome:"Fernanda Lima",     nasc:`1991-${TODAYS.slice(5)}`, phone:"(11) 97654-3210", obj:"Joelho e quadril",       obs:"Praticante de corrida.",       ultima:"2025-04-20" },
  { id:5, nome:"Lucas Oliveira",    nasc:"1995-08-30", phone:"(11) 93210-9876", obj:"Escoliose leve",                     obs:"Jovem engajado.",              ultima:"2025-04-15" },
  { id:6, nome:"Beatriz Nunes",     nasc:"1987-11-05", phone:"(11) 96543-2109", obj:"Recuperação pós-parto",             obs:"4 meses pós-parto.",           ultima:"2025-04-10" },
];
const SEED_CONSULTAS = [
  { id:1, data:TODAYS, hora:"08:00", pid:1, proc:"RPG — Coluna Lombar",   status:"Realizada"  },
  { id:2, data:TODAYS, hora:"09:30", pid:2, proc:"RPG — Ombro e Cervical", status:"Confirmado" },
  { id:3, data:TODAYS, hora:"11:00", pid:3, proc:"RPG — Postura Global",   status:"Aguardando" },
  { id:4, data:TODAYS, hora:"14:00", pid:4, proc:"RPG — Joelho e Quadril", status:"Confirmado" },
  { id:5, data:TODAYS, hora:"16:00", pid:5, proc:"RPG — Escoliose",        status:"Aguardando" },
];
const SEED_PRONTUARIOS = [
  { id:1, pid:1, data:"2025-05-06", sessao:8,  ev:"Redução significativa da dor lombar. Mantém postura ereta por mais tempo. Exercícios de core incorporados na rotina.", tags:["melhora da dor","postura melhorada","core fortalecido"] },
  { id:2, pid:2, data:"2025-04-28", sessao:5,  ev:"Amplitude de movimento do ombro melhorou ~20%. Paciente realizando exercícios em casa. Redução do uso de anti-inflamatório.", tags:["amplitude melhorada","aderência"] },
  { id:3, pid:3, data:"2025-04-25", sessao:12, ev:"Excelente evolução. Tensão cervical praticamente resolvida. Melhora na qualidade do sono. Manutenção mensal recomendada.", tags:["tensão resolvida","sono melhorado","alta proximidade"] },
];

/* ─── HELPERS ─── */
const AV_COLORS = [
  { bg: T.tealPale,   fg: T.tealDim },
  { bg: T.greenPale,  fg: "#0DA86A" },
  { bg: "#EDE9FE",    fg: "#5B21B6" },
  { bg: T.amberPale,  fg: "#966200" },
  { bg: T.redPale,    fg: "#991B1B" },
  { bg: "#E0E7FF",    fg: "#3730A3" },
];
const avColor = name => AV_COLORS[name.charCodeAt(0) % AV_COLORS.length];
const avIni   = name => name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
const fmtDate = s => { if (!s) return "—"; const [y,m,d] = s.split("-"); return `${d}/${m}/${y}`; };
const calcAge = s => { const b = new Date(s), t = new Date(); let a = t.getFullYear()-b.getFullYear(); if (t < new Date(t.getFullYear(),b.getMonth(),b.getDate())) a--; return a; };
let _nid = 400;
const uid = () => ++_nid;

/* ─── STYLE INJECTION ─── */
const CSS = `
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Geist',system-ui,sans-serif;background:${T.paper};color:${T.ink};font-size:14px;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(0,0,0,.1);border-radius:10px}
@keyframes fadeUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:scale(.97) translateY(8px)}to{opacity:1;transform:none}}
.page-anim{animation:fadeUp .2s ease}
.modal-anim{animation:slideIn .22s ease}
`;
if (!document.getElementById("maya-css")) {
  const s = document.createElement("style");
  s.id = "maya-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* ═══════════════════════════════
   SMALL ATOMS
═══════════════════════════════ */
function Avatar({ name, size = 30, fontSize = 10 }) {
  const c = avColor(name);
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: c.bg, color: c.fg, display: "flex", alignItems: "center", justifyContent: "center", fontSize, fontWeight: 700, flexShrink: 0 }}>
      {avIni(name)}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    Confirmado: { bg: T.greenPale, fg: "#0D8A5A", dot: T.green },
    Aguardando: { bg: T.amberPale, fg: "#966200", dot: T.amber },
    Realizada:  { bg: T.paper,     fg: T.ink3,    dot: T.ink4  },
  };
  const s = map[status] || map.Realizada;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:s.bg, color:s.fg }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:s.dot, flexShrink:0 }} />
      {status}
    </span>
  );
}

function Btn({ children, onClick, variant="primary", full=false, style:sx={} }) {
  const base = { display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7, border:"none", borderRadius:8, fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit", transition:"all .2s", letterSpacing:".2px", padding:"10px 20px", ...(full ? {width:"100%"} : {}) };
  const variants = {
    primary: { background:T.navy,    color:"#fff" },
    teal:    { background:T.tealDim, color:"#fff" },
    ghost:   { background:"transparent", color:T.ink2, border:`1.5px solid ${T.border}` },
    green:   { background:"#25D366", color:"#fff" },
  };
  return <button style={{ ...base, ...variants[variant], ...sx }} onClick={onClick}>{children}</button>;
}

function FormField({ label, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <label style={{ fontSize:10, fontWeight:600, color:T.ink3, letterSpacing:".5px", textTransform:"uppercase" }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = { padding:"9px 13px", borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:13, fontFamily:"inherit", color:T.ink, background:T.paper, outline:"none", width:"100%", transition:"border-color .15s, box-shadow .15s" };

function Input({ id, type="text", placeholder, value, onChange, onFocus, onBlur }) {
  const [focused, setFocused] = useState(false);
  return (
    <input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange}
      style={{ ...inputStyle, ...(focused ? { borderColor:T.teal, background:"#fff", boxShadow:`0 0 0 3px rgba(42,172,191,.12)` } : {}) }}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
  );
}

function Textarea({ value, onChange, placeholder, rows=3 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      style={{ ...inputStyle, resize:"vertical", minHeight:74, ...(focused ? { borderColor:T.teal, background:"#fff", boxShadow:`0 0 0 3px rgba(42,172,191,.12)` } : {}) }}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
  );
}

function Select({ value, onChange, children }) {
  const [focused, setFocused] = useState(false);
  return (
    <select value={value} onChange={onChange}
      style={{ ...inputStyle, ...(focused ? { borderColor:T.teal, background:"#fff", boxShadow:`0 0 0 3px rgba(42,172,191,.12)` } : {}) }}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
      {children}
    </select>
  );
}

function Card({ children, style:sx={}, pad=false }) {
  return (
    <div style={{ background:T.surface, borderRadius:18, border:`1px solid ${T.border}`, overflow:"hidden", ...(pad ? { padding:"18px 22px" } : {}), ...sx }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, linkLabel, onLink }) {
  return (
    <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:14 }}>
      <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:16, fontStyle:"italic", color:T.ink }}>{title}</div>
      {onLink && (
        <button onClick={onLink} style={{ background:"none", border:"none", fontSize:11, fontWeight:500, color:T.teal, cursor:"pointer", display:"flex", alignItems:"center", gap:3 }}>
          {linkLabel} <i className="ti ti-arrow-right" style={{ fontSize:12 }} />
        </button>
      )}
    </div>
  );
}

/* ─── TOAST SYSTEM ─── */
function ToastContainer({ toasts, remove }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{ background:T.navy, color:"#fff", padding:"12px 16px", borderRadius:12, fontSize:13, display:"flex", alignItems:"center", gap:9, boxShadow:"0 10px 30px rgba(0,0,0,.2)", borderLeft:`3px solid ${t.type==="success"?T.green:t.type==="error"?T.red:T.teal}`, maxWidth:300, animation:"fadeUp .25s ease" }}>
          <i className={`ti ${t.type==="success"?"ti-check":t.type==="error"?"ti-alert-circle":"ti-info-circle"}`} style={{ fontSize:15, flexShrink:0 }} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ─── MODAL WRAPPER ─── */
function Modal({ title, onClose, children, footer }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,25,35,.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, backdropFilter:"blur(4px)", animation:"fadeUp .18s ease" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-anim" style={{ background:T.surface, borderRadius:18, width:"100%", maxWidth:500, boxShadow:"0 30px 70px rgba(0,0,0,.18)", overflow:"hidden" }}>
        <div style={{ padding:"20px 24px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:18, fontStyle:"italic" }}>{title}</div>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:"50%", border:"none", background:T.paper, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:T.ink2, fontSize:17 }}>
            <i className="ti ti-x" />
          </button>
        </div>
        <div style={{ padding:"20px 24px" }}>{children}</div>
        {footer && <div style={{ padding:"14px 24px", borderTop:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"flex-end", gap:8 }}>{footer}</div>}
      </div>
    </div>
  );
}

/* ─── TOGGLE ─── */
function Toggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{ width:42, height:23, borderRadius:12, background:checked ? T.teal : T.ink4, position:"relative", cursor:"pointer", transition:"background .2s", flexShrink:0 }}>
      <div style={{ position:"absolute", width:17, height:17, borderRadius:"50%", background:"#fff", top:3, left:3, transition:"transform .2s", transform:checked ? "translateX(19px)" : "none", boxShadow:"0 1px 4px rgba(0,0,0,.15)" }} />
    </div>
  );
}

/* ─── ICON BUTTON ─── */
function IconBtn({ icon, onClick, danger=false, title }) {
  const [hov, setHov] = useState(false);
  return (
    <button title={title} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width:28, height:28, borderRadius:7, border:`1px solid ${hov ? (danger?"rgba(229,72,77,.3)":"rgba(42,172,191,.3)") : T.border}`, background:hov ? (danger?T.redPale:T.tealPale) : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:hov ? (danger?T.red:T.tealDim) : T.ink3, fontSize:13, transition:"all .15s" }}>
      <i className={`ti ${icon}`} />
    </button>
  );
}

/* ═══════════════════════════════
   DATA TABLE
═══════════════════════════════ */
function DataTable({ columns, rows, emptyIcon="ti-table-off", emptyMsg="Nenhum resultado" }) {
  return (
    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, tableLayout:"fixed" }}>
      <thead>
        <tr>
          {columns.map(c => (
            <th key={c.key} style={{ padding:"10px 18px", fontSize:10, fontWeight:600, color:T.ink3, letterSpacing:".7px", textTransform:"uppercase", background:T.paper, borderBottom:`1px solid ${T.border}`, textAlign:"left", width:c.width }}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={columns.length}>
            <div style={{ padding:"48px 20px", textAlign:"center", color:T.ink3 }}>
              <i className={`ti ${emptyIcon}`} style={{ fontSize:34, opacity:.3, display:"block", marginBottom:10 }} />
              <p style={{ fontSize:13, fontWeight:300 }}>{emptyMsg}</p>
            </div>
          </td></tr>
        ) : rows}
      </tbody>
    </table>
  );
}

/* ═══════════════════════════════
   HOME PAGE
═══════════════════════════════ */
function MetricCard({ icon, value, label, accent, badge, badgeType="up" }) {
  const [hov, setHov] = useState(false);
  const accentMap = {
    teal:  { strip:"linear-gradient(90deg,#2AACBF,#1D8FA0)", iconBg:T.tealPale,  iconFg:T.tealDim },
    green: { strip:"linear-gradient(90deg,#17B978,#0DA86A)", iconBg:T.greenPale, iconFg:"#0DA86A"  },
    amber: { strip:"linear-gradient(90deg,#F0A500,#E09000)", iconBg:T.amberPale, iconFg:"#B87D00"  },
  };
  const a = accentMap[accent] || accentMap.teal;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:T.surface, borderRadius:18, border:`1px solid ${T.border}`, padding:20, position:"relative", overflow:"hidden", transition:"box-shadow .2s, transform .2s", transform:hov ? "translateY(-2px)" : "none", boxShadow:hov ? "0 8px 28px rgba(0,0,0,.07)" : "none" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:a.strip }} />
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
        <div style={{ width:40, height:40, borderRadius:11, background:a.iconBg, color:a.iconFg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19 }}>
          <i className={`ti ${icon}`} />
        </div>
        <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:10, fontWeight:600, padding:"3px 7px", borderRadius:20, background:badgeType==="up" ? T.greenPale : T.paper, color:badgeType==="up" ? "#0D8A5A" : T.ink3 }}>
          {badgeType === "up" && <i className="ti ti-trending-up" style={{ fontSize:10 }} />}
          {badge}
        </span>
      </div>
      <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:34, color:T.ink, lineHeight:1, marginBottom:4, letterSpacing:"-.04em" }}>{value}</div>
      <div style={{ fontSize:12, color:T.ink3, fontWeight:300 }}>{label}</div>
    </div>
  );
}

function AgendaTable({ consultas, patients, onEdit, onView, onDelete }) {
  const sorted = [...consultas].sort((a,b) => a.hora.localeCompare(b.hora));
  const gp = id => patients.find(p => p.id === id);
  const rows = sorted.map(c => {
    const p = gp(c.pid); if (!p) return null;
    return (
      <tr key={c.id} style={{ transition:"background .1s" }}
        onMouseEnter={e => { Array.from(e.currentTarget.cells).forEach(td => td.style.background = "rgba(42,172,191,.03)"); }}
        onMouseLeave={e => { Array.from(e.currentTarget.cells).forEach(td => td.style.background = ""); }}>
        <td style={{ padding:"12px 18px", borderBottom:`1px solid rgba(0,0,0,.04)` }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:T.tealPale, color:T.tealDim, padding:"4px 10px", borderRadius:7, fontSize:11, fontWeight:600 }}>
            <i className="ti ti-clock" style={{ fontSize:11 }} />{c.hora}
          </span>
        </td>
        <td style={{ padding:"12px 18px", borderBottom:`1px solid rgba(0,0,0,.04)` }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <Avatar name={p.nome} />
            <strong>{p.nome}</strong>
          </div>
        </td>
        <td style={{ padding:"12px 18px", borderBottom:`1px solid rgba(0,0,0,.04)`, color:T.ink2 }}>{c.proc}</td>
        <td style={{ padding:"12px 18px", borderBottom:`1px solid rgba(0,0,0,.04)` }}><StatusPill status={c.status} /></td>
        <td style={{ padding:"12px 18px", borderBottom:`1px solid rgba(0,0,0,.04)` }}>
          <div style={{ display:"flex", gap:5 }}>
            <IconBtn icon="ti-edit"           title="Editar"    onClick={() => onEdit(c)} />
            <IconBtn icon="ti-clipboard-text" title="Prontuário" onClick={() => onView(c)} />
            <IconBtn icon="ti-trash"          title="Remover"   onClick={() => onDelete(c.id)} danger />
          </div>
        </td>
      </tr>
    );
  }).filter(Boolean);

  return (
    <DataTable
      columns={[
        { key:"hora",  label:"Horário",    width:110 },
        { key:"pac",   label:"Paciente"              },
        { key:"proc",  label:"Procedimento"          },
        { key:"status",label:"Status",     width:130 },
        { key:"acoes", label:"Ações",      width:90  },
      ]}
      rows={rows}
      emptyIcon="ti-calendar-off"
      emptyMsg="Nenhuma consulta neste dia"
    />
  );
}

function RecentPatients({ patients, onViewAll }) {
  const recent = [...patients].slice(-5).reverse();
  return (
    <>
      <SectionHeader title="Pacientes recentes" linkLabel="Ver todos" onLink={onViewAll} />
      <Card pad>
        {recent.map((p, i) => {
          const isBday = p.nasc && p.nasc.slice(5) === TODAYS.slice(5);
          return (
            <div key={p.id} style={{ display:"flex", alignItems:"center", gap:11, padding:"11px 0", borderBottom: i < recent.length-1 ? `1px solid rgba(0,0,0,.05)` : "none" }}>
              <Avatar name={p.nome} size={36} fontSize={12} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:500, color:T.ink, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.nome}</div>
                <div style={{ fontSize:11, color:T.ink3, marginTop:1 }}>{isBday ? "🎂 Aniversário hoje!" : `Última sessão: ${fmtDate(p.ultima)}`}</div>
              </div>
              <span style={{ fontSize:10, fontWeight:600, padding:"3px 8px", borderRadius:6, background:T.greenPale, color:"#0D8A5A", whiteSpace:"nowrap" }}>Ativo</span>
            </div>
          );
        })}
      </Card>
    </>
  );
}

function QuickAddPatient({ onAdd }) {
  const [form, setForm] = useState({ nome:"", nasc:"", phone:"", obj:"" });
  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = () => {
    if (!form.nome.trim()) return;
    onAdd({ ...form, id: uid(), obs:"", ultima:"" });
    setForm({ nome:"", nasc:"", phone:"", obj:"" });
  };
  return (
    <>
      <SectionHeader title="Novo paciente" />
      <Card pad>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <FormField label="Nome completo">
            <Input value={form.nome} onChange={upd("nome")} placeholder="Ex: João da Silva" />
          </FormField>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <FormField label="Nascimento">
              <Input type="date" value={form.nasc} onChange={upd("nasc")} />
            </FormField>
            <FormField label="WhatsApp">
              <Input value={form.phone} onChange={upd("phone")} placeholder="(11) 9 0000-0000" />
            </FormField>
          </div>
          <FormField label="Objetivo do tratamento">
            <Input value={form.obj} onChange={upd("obj")} placeholder="Ex: Dor lombar crônica…" />
          </FormField>
          <Btn variant="teal" full onClick={submit}>
            <i className="ti ti-user-plus" /> Cadastrar paciente
          </Btn>
        </div>
      </Card>
    </>
  );
}

/* ═══════════════════════════════
   MODALS
═══════════════════════════════ */
function PatientModal({ patient, onSave, onClose }) {
  const [form, setForm] = useState(patient
    ? { nome: patient.nome, nasc: patient.nasc, phone: patient.phone, obj: patient.obj||"", obs: patient.obs||"" }
    : { nome:"", nasc:"", phone:"", obj:"", obs:"" });
  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = () => {
    if (!form.nome || !form.nasc || !form.phone) return;
    onSave(patient ? { ...patient, ...form } : { ...form, id: uid(), ultima:"" });
    onClose();
  };
  return (
    <Modal title={patient ? "Editar paciente" : "Novo paciente"} onClose={onClose}
      footer={<><Btn variant="ghost" onClick={onClose}>Cancelar</Btn><Btn variant="teal" onClick={submit}><i className="ti ti-check" style={{ fontSize:13 }} /> Salvar paciente</Btn></>}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <div style={{ gridColumn:"1/-1" }}>
          <FormField label="Nome completo *"><Input value={form.nome} onChange={upd("nome")} placeholder="Nome completo" /></FormField>
        </div>
        <FormField label="Nascimento *"><Input type="date" value={form.nasc} onChange={upd("nasc")} /></FormField>
        <FormField label="WhatsApp *"><Input value={form.phone} onChange={upd("phone")} placeholder="(11) 9 0000-0000" /></FormField>
        <div style={{ gridColumn:"1/-1" }}>
          <FormField label="Objetivo do tratamento"><Textarea value={form.obj} onChange={upd("obj")} placeholder="Descreva o objetivo principal…" /></FormField>
        </div>
        <div style={{ gridColumn:"1/-1" }}>
          <FormField label="Observações iniciais"><Textarea value={form.obs} onChange={upd("obs")} placeholder="Histórico, limitações, observações…" /></FormField>
        </div>
      </div>
    </Modal>
  );
}

function ConsultaModal({ consulta, patients, defaultDate, onSave, onClose }) {
  const ds = defaultDate || TODAYS;
  const [form, setForm] = useState(consulta
    ? { data: consulta.data, hora: consulta.hora, pid: consulta.pid, proc: consulta.proc, status: consulta.status }
    : { data: ds, hora:"09:00", pid: patients[0]?.id || 0, proc:"RPG — ", status:"Aguardando" });
  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const updN = k => e => setForm(f => ({ ...f, [k]: Number(e.target.value) }));
  const submit = () => {
    if (!form.data || !form.hora || !form.proc) return;
    onSave(consulta ? { ...consulta, ...form } : { ...form, id: uid() });
    onClose();
  };
  return (
    <Modal title={consulta ? "Editar consulta" : "Nova consulta"} onClose={onClose}
      footer={<><Btn variant="ghost" onClick={onClose}>Cancelar</Btn><Btn variant="teal" onClick={submit}><i className="ti ti-check" style={{ fontSize:13 }} /> Agendar consulta</Btn></>}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <FormField label="Data *"><Input type="date" value={form.data} onChange={upd("data")} /></FormField>
        <FormField label="Horário *"><Input type="time" value={form.hora} onChange={upd("hora")} /></FormField>
        <div style={{ gridColumn:"1/-1" }}>
          <FormField label="Paciente *">
            <Select value={form.pid} onChange={updN("pid")}>
              {patients.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </Select>
          </FormField>
        </div>
        <div style={{ gridColumn:"1/-1" }}>
          <FormField label="Procedimento"><Input value={form.proc} onChange={upd("proc")} placeholder="Ex: RPG — Coluna Lombar" /></FormField>
        </div>
        <FormField label="Status">
          <Select value={form.status} onChange={upd("status")}>
            {["Aguardando","Confirmado","Realizada"].map(s => <option key={s}>{s}</option>)}
          </Select>
        </FormField>
      </div>
    </Modal>
  );
}

function ProntuarioModal({ patients, onSave, onClose }) {
  const [form, setForm] = useState({ pid: patients[0]?.id || 0, data: TODAYS, sessao:"", ev:"", tags:"" });
  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const updN = k => e => setForm(f => ({ ...f, [k]: Number(e.target.value) }));
  const submit = () => {
    if (!form.ev) return;
    onSave({ ...form, id: uid(), sessao: Number(form.sessao)||1, tags: form.tags.split(",").map(t=>t.trim()).filter(Boolean) });
    onClose();
  };
  return (
    <Modal title="Nova evolução clínica" onClose={onClose}
      footer={<><Btn variant="ghost" onClick={onClose}>Cancelar</Btn><Btn variant="teal" onClick={submit}><i className="ti ti-check" style={{ fontSize:13 }} /> Salvar evolução</Btn></>}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <div style={{ gridColumn:"1/-1" }}>
          <FormField label="Paciente *">
            <Select value={form.pid} onChange={updN("pid")}>
              {patients.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </Select>
          </FormField>
        </div>
        <FormField label="Data da sessão *"><Input type="date" value={form.data} onChange={upd("data")} /></FormField>
        <FormField label="Sessão nº"><Input type="number" value={form.sessao} onChange={upd("sessao")} placeholder="Ex: 5" /></FormField>
        <div style={{ gridColumn:"1/-1" }}>
          <FormField label="Evolução clínica *"><Textarea value={form.ev} onChange={upd("ev")} placeholder="Descreva a evolução nesta sessão…" rows={4} /></FormField>
        </div>
        <div style={{ gridColumn:"1/-1" }}>
          <FormField label="Tags (separadas por vírgula)"><Input value={form.tags} onChange={upd("tags")} placeholder="melhora postural, dor reduzida…" /></FormField>
        </div>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════
   BIRTHDAY BANNER
═══════════════════════════════ */
function BirthdayBanner({ patients, bdayMsg }) {
  const [dismissed, setDismissed] = useState(false);
  const mmdd = TODAYS.slice(5);
  const bdays = patients.filter(p => p.nasc && p.nasc.slice(5) === mmdd);
  if (!bdays.length || dismissed) return null;
  const p = bdays[0];
  const phone = p.phone.replace(/\D/g,"");
  const msg = (bdayMsg || "Olá {nome}! 🎉 A Maya Yamamoto RPG deseja a você um feliz aniversário! 💙").replace("{nome}", p.nome.split(" ")[0]);
  return (
    <div style={{ background:T.navy, borderRadius:18, padding:"18px 22px", display:"flex", alignItems:"center", gap:16, marginBottom:24, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", right:-30, top:-40, width:160, height:160, background:"radial-gradient(circle,rgba(42,172,191,.2) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />
      <div style={{ width:50, height:50, borderRadius:14, background:"rgba(42,172,191,.15)", border:"1px solid rgba(42,172,191,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>🎂</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:10, fontWeight:600, color:T.teal, letterSpacing:1, textTransform:"uppercase", marginBottom:3 }}>Aniversariante de hoje</div>
        <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:17, color:"#fff", fontStyle:"italic" }}>{p.nome} — {calcAge(p.nasc)} anos</div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", marginTop:2 }}>
          {bdays.length > 1 ? `+${bdays.length-1} outros aniversariantes hoje` : "Envie uma mensagem de carinho!"}
        </div>
      </div>
      <Btn variant="green" onClick={() => window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`, "_blank")}>
        <i className="ti ti-brand-whatsapp" style={{ fontSize:15 }} /> Enviar Parabéns
      </Btn>
      <button onClick={() => setDismissed(true)} style={{ width:26, height:26, borderRadius:"50%", border:"none", background:"rgba(255,255,255,.08)", color:"rgba(255,255,255,.4)", fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <i className="ti ti-x" />
      </button>
    </div>
  );
}

/* ═══════════════════════════════
   PAGE: HOME
═══════════════════════════════ */
function HomePage({ patients, consultas, onNavAgenda, onNavPacientes, onAddPatient, onEditConsulta, onDeleteConsulta }) {
  const todayConsultas = consultas.filter(c => c.data === TODAYS);
  const monthCount = consultas.filter(c => { const d = new Date(c.data); return d.getMonth()===TODAY.getMonth()&&d.getFullYear()===TODAY.getFullYear(); }).length;
  const newCount = Math.max(0, patients.length - 4);
  return (
    <div className="page-anim">
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:26 }}>
        <MetricCard icon="ti-users"          value={patients.length} label="Total de pacientes" accent="teal"  badge={`+${newCount}`} badgeType="up" />
        <MetricCard icon="ti-calendar-check" value={monthCount}      label="Consultas no mês"  accent="green" badge="Este mês"        badgeType="up" />
        <MetricCard icon="ti-user-plus"      value={newCount}        label="Novos cadastros"   accent="amber" badge="30 dias"         badgeType="neutral" />
      </div>

      <SectionHeader title="Agenda de hoje" linkLabel="Ver tudo" onLink={onNavAgenda} />
      <Card style={{ marginBottom:24 }}>
        <AgendaTable consultas={todayConsultas} patients={patients}
          onEdit={onEditConsulta} onView={() => {}} onDelete={onDeleteConsulta} />
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
        <RecentPatients patients={patients} onViewAll={onNavPacientes} />
        <QuickAddPatient onAdd={onAddPatient} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   PAGE: AGENDA
═══════════════════════════════ */
function AgendaPage({ consultas, patients, onAddConsulta, onEditConsulta, onDeleteConsulta }) {
  const [day, setDay] = useState(new Date(TODAYS));
  const dayStr = day.toISOString().split("T")[0];
  const dayConsultas = consultas.filter(c => c.data === dayStr);
  const label = `${WDAYS[day.getDay()]}, ${day.getDate()} de ${MONTHS[day.getMonth()]}`;
  const moveDay = d => setDay(new Date(day.getTime() + d * 86400000));
  const [modal, setModal] = useState(null);

  const handleAdd = () => setModal("new");
  const handleEdit = c => setModal(c);
  const handleSave = data => {
    if (data.id && consultas.find(c => c.id === data.id)) onEditConsulta(data);
    else onAddConsulta(data);
    setModal(null);
  };

  return (
    <div className="page-anim">
      <div style={{ background:T.surface, borderRadius:18, border:`1px solid ${T.border}`, padding:"14px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <DayNavBtn onClick={() => moveDay(-1)} icon="ti-chevron-left" />
          <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:15, fontStyle:"italic", color:T.ink, minWidth:230, textAlign:"center" }}>{label}</div>
          <DayNavBtn onClick={() => moveDay(1)}  icon="ti-chevron-right" />
        </div>
        <Btn variant="teal" onClick={handleAdd}><i className="ti ti-plus" /> Nova consulta</Btn>
      </div>
      <Card>
        <AgendaTable consultas={dayConsultas} patients={patients}
          onEdit={handleEdit} onView={() => {}} onDelete={onDeleteConsulta} />
      </Card>
      {modal && (
        <ConsultaModal
          consulta={modal === "new" ? null : modal}
          patients={patients}
          defaultDate={dayStr}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

function DayNavBtn({ onClick, icon }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width:32, height:32, borderRadius:8, border:`1.5px solid ${hov ? T.teal : T.border}`, background:hov ? T.tealPale : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:hov ? T.teal : T.ink2, fontSize:16, transition:"all .15s" }}>
      <i className={`ti ${icon}`} />
    </button>
  );
}

/* ═══════════════════════════════
   PAGE: PATIENTS
═══════════════════════════════ */
function PacientesPage({ patients, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const filtered = patients.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search));
  const handleSave = data => {
    if (data.id && patients.find(p => p.id === data.id)) onEdit(data);
    else onAdd(data);
    setModal(null);
  };
  const rows = filtered.map(p => (
    <tr key={p.id} style={{ cursor:"pointer" }}
      onMouseEnter={e => Array.from(e.currentTarget.cells).forEach(td => td.style.background = "rgba(42,172,191,.03)")}
      onMouseLeave={e => Array.from(e.currentTarget.cells).forEach(td => td.style.background = "")}>
      <td style={{ padding:"12px 18px", borderBottom:`1px solid rgba(0,0,0,.04)` }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}><Avatar name={p.nome} /><strong>{p.nome}</strong></div>
      </td>
      <td style={{ padding:"12px 18px", borderBottom:`1px solid rgba(0,0,0,.04)`, color:T.ink2 }}>
        {fmtDate(p.nasc)} <span style={{ color:T.ink3, fontSize:11 }}>({calcAge(p.nasc)} anos)</span>
      </td>
      <td style={{ padding:"12px 18px", borderBottom:`1px solid rgba(0,0,0,.04)` }}>
        <a href={`https://wa.me/55${p.phone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer"
          style={{ color:T.teal, textDecoration:"none", display:"flex", alignItems:"center", gap:4 }}>
          <i className="ti ti-brand-whatsapp" style={{ fontSize:14 }} />{p.phone}
        </a>
      </td>
      <td style={{ padding:"12px 18px", borderBottom:`1px solid rgba(0,0,0,.04)`, color:T.ink2 }}>{fmtDate(p.ultima)}</td>
      <td style={{ padding:"12px 18px", borderBottom:`1px solid rgba(0,0,0,.04)` }}>
        <div style={{ display:"flex", gap:5 }}>
          <IconBtn icon="ti-edit"           onClick={() => setModal(p)} title="Editar" />
          <IconBtn icon="ti-clipboard-text" onClick={() => {}}           title="Prontuário" />
          <IconBtn icon="ti-trash"          onClick={() => onDelete(p.id)} title="Remover" danger />
        </div>
      </td>
    </tr>
  ));
  return (
    <div className="page-anim">
      <Card>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:`1px solid rgba(0,0,0,.05)`, gap:12 }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar paciente…" />
          <Btn onClick={() => setModal("new")}><i className="ti ti-user-plus" /> Novo paciente</Btn>
        </div>
        <DataTable
          columns={[
            { key:"nome",   label:"Nome"         },
            { key:"nasc",   label:"Nascimento", width:160 },
            { key:"phone",  label:"Telefone",   width:160 },
            { key:"ultima", label:"Última sessão", width:140 },
            { key:"acoes",  label:"Ações",      width:90  },
          ]}
          rows={rows}
          emptyIcon="ti-users-off"
          emptyMsg="Nenhum paciente encontrado"
        />
      </Card>
      {modal && (
        <PatientModal
          patient={modal === "new" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════
   PAGE: PRONTUÁRIOS
═══════════════════════════════ */
function ProntuariosPage({ prontuarios, patients, onAdd, onDelete }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const gp = id => patients.find(p => p.id === id);
  const filtered = [...prontuarios]
    .filter(p => { const pt = gp(p.pid); return !search || (pt && pt.nome.toLowerCase().includes(search.toLowerCase())) || p.ev.toLowerCase().includes(search.toLowerCase()); })
    .sort((a,b) => b.data.localeCompare(a.data));
  return (
    <div className="page-anim">
      <Card style={{ marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", gap:12 }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por paciente ou conteúdo…" />
          <Btn onClick={() => setModal(true)}><i className="ti ti-plus" /> Nova evolução</Btn>
        </div>
      </Card>
      {filtered.length === 0 ? (
        <div style={{ padding:"48px 20px", textAlign:"center", color:T.ink3 }}>
          <i className="ti ti-clipboard-off" style={{ fontSize:34, opacity:.3, display:"block", marginBottom:10 }} />
          <p style={{ fontSize:13 }}>Nenhum prontuário encontrado</p>
        </div>
      ) : filtered.map(p => {
        const pt = gp(p.pid);
        return (
          <div key={p.id} style={{ background:T.surface, borderRadius:18, border:`1px solid ${T.border}`, padding:"20px 24px", marginBottom:12, transition:"box-shadow .2s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.06)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = ""}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                {pt && <Avatar name={pt.nome} size={36} fontSize={12} />}
                <div>
                  <div style={{ fontSize:14, fontWeight:500, color:T.ink }}>{pt ? pt.nome : "Paciente removido"}</div>
                  <div style={{ fontSize:11, color:T.ink3, fontWeight:300, marginTop:2 }}>Sessão {p.sessao} · {fmtDate(p.data)}</div>
                </div>
              </div>
              <IconBtn icon="ti-trash" onClick={() => onDelete(p.id)} title="Remover" danger />
            </div>
            <div style={{ fontSize:13, lineHeight:1.7, color:T.ink2 }}>{p.ev}</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:12 }}>
              {p.tags.map(t => (
                <span key={t} style={{ fontSize:10, fontWeight:600, padding:"3px 9px", borderRadius:20, background:T.tealPale, color:T.tealDim, letterSpacing:".3px" }}>{t}</span>
              ))}
            </div>
          </div>
        );
      })}
      {modal && <ProntuarioModal patients={patients} onSave={data => { onAdd(data); setModal(false); }} onClose={() => setModal(false)} />}
    </div>
  );
}

/* ═══════════════════════════════
   PAGE: CONFIG
═══════════════════════════════ */
function ConfigPage({ bdayMsg, onBdayMsgChange, onToast }) {
  const [cfg, setCfg] = useState({ birthday:true, reminder:false, summary:true });
  const toggle = k => setCfg(c => ({ ...c, [k]: !c[k] }));
  const [profile, setProfile] = useState({ nome:"Maya Yamamoto", crefito:"3-00000/SP", phone:"(11) 9 9999-0000", email:"maya@yamamoto-rpg.com.br" });
  const upd = k => e => setProfile(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="page-anim">
      <ConfigCard title="Notificações e alertas">
        <ConfigRow label="Alertas de aniversário" sub="Exibir banner quando um paciente faz aniversário hoje"><Toggle checked={cfg.birthday} onChange={() => toggle("birthday")} /></ConfigRow>
        <ConfigRow label="Lembrete via WhatsApp" sub="Notificar paciente 24h antes da sessão"><Toggle checked={cfg.reminder} onChange={() => toggle("reminder")} /></ConfigRow>
        <ConfigRow label="Resumo diário da agenda" sub="Receber resumo toda manhã"><Toggle checked={cfg.summary} onChange={() => toggle("summary")} /></ConfigRow>
      </ConfigCard>
      <ConfigCard title="Perfil profissional">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          <FormField label="Nome completo"><Input value={profile.nome}    onChange={upd("nome")}    /></FormField>
          <FormField label="CREFITO">     <Input value={profile.crefito} onChange={upd("crefito")} /></FormField>
          <FormField label="WhatsApp">    <Input value={profile.phone}   onChange={upd("phone")} type="tel" /></FormField>
          <FormField label="E-mail">      <Input value={profile.email}   onChange={upd("email")} type="email" /></FormField>
        </div>
        <Btn onClick={() => onToast("Perfil atualizado!", "success")}><i className="ti ti-device-floppy" /> Salvar alterações</Btn>
      </ConfigCard>
      <ConfigCard title="Mensagem de aniversário">
        <FormField label="Texto enviado via WhatsApp">
          <Textarea value={bdayMsg} onChange={e => onBdayMsgChange(e.target.value)} rows={3} />
        </FormField>
        <div style={{ marginTop:12 }}>
          <Btn onClick={() => onToast("Mensagem salva!", "success")}><i className="ti ti-device-floppy" /> Salvar mensagem</Btn>
        </div>
      </ConfigCard>
    </div>
  );
}
function ConfigCard({ title, children }) {
  return (
    <div style={{ background:T.surface, borderRadius:18, border:`1px solid ${T.border}`, padding:"22px 24px", marginBottom:16 }}>
      <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:15, fontStyle:"italic", color:T.ink, marginBottom:16, paddingBottom:14, borderBottom:`1px solid rgba(0,0,0,.05)` }}>{title}</div>
      {children}
    </div>
  );
}
function ConfigRow({ label, sub, children }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid rgba(0,0,0,.04)`, gap:24 }}>
      <div>
        <div style={{ fontSize:13, fontWeight:500, color:T.ink }}>{label}</div>
        <div style={{ fontSize:11, color:T.ink3, marginTop:2, fontWeight:300 }}>{sub}</div>
      </div>
      {children}
    </div>
  );
}

/* ─── SEARCH INPUT ─── */
function SearchInput({ value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position:"relative", flex:1, maxWidth:300 }}>
      <i className="ti ti-search" style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:T.ink3, fontSize:15, pointerEvents:"none" }} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ ...inputStyle, paddingLeft:34, ...(focused ? { borderColor:T.teal, background:"#fff", boxShadow:`0 0 0 3px rgba(42,172,191,.12)` } : {}) }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
    </div>
  );
}

/* ═══════════════════════════════
   SIDEBAR
═══════════════════════════════ */
const NAV = [
  { id:"home",        label:"Início",     icon:"ti-layout-dashboard", section:"Painel"  },
  { id:"agenda",      label:"Agenda",     icon:"ti-calendar-event",   section:null      },
  { id:"pacientes",   label:"Pacientes",  icon:"ti-users",            section:"Clínica" },
  { id:"prontuarios", label:"Prontuários",icon:"ti-clipboard-text",   section:null      },
  { id:"config",      label:"Config.",    icon:"ti-settings",         section:"Sistema" },
];

function Sidebar({ active, onNav, agendaBadge }) {
  let lastSection = null;
  return (
    <aside style={{ width:240, flexShrink:0, background:T.navy, display:"flex", flexDirection:"column", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`, pointerEvents:"none", opacity:.5 }} />
      <div style={{ padding:"26px 22px 22px", borderBottom:"1px solid rgba(255,255,255,.06)", position:"relative" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:`linear-gradient(135deg,${T.teal},${T.tealDim})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:17, flexShrink:0, boxShadow:"0 4px 16px rgba(42,172,191,.4)" }}>
            <i className="ti ti-heartbeat" />
          </div>
          <div>
            <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:14, color:"#fff", fontStyle:"italic" }}>Maya Yamamoto</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", letterSpacing:".6px", textTransform:"uppercase", marginTop:2 }}>RPG Terapêutico</div>
          </div>
        </div>
      </div>
      <div style={{ flex:1, padding:"18px 14px", display:"flex", flexDirection:"column", gap:2, overflowY:"auto", position:"relative" }}>
        {NAV.map(item => {
          const showSection = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;
          return (
            <div key={item.id}>
              {showSection && (
                <div style={{ fontSize:9, fontWeight:600, color:"rgba(255,255,255,.22)", letterSpacing:"1.2px", textTransform:"uppercase", padding:"12px 8px 6px" }}>{item.section}</div>
              )}
              <SidebarItem item={item} active={active === item.id} onClick={() => onNav(item.id)}
                badge={item.id === "agenda" ? agendaBadge : null} />
            </div>
          );
        })}
      </div>
      <div style={{ padding:"14px 14px 20px", borderTop:"1px solid rgba(255,255,255,.06)", position:"relative" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 8px", borderRadius:9, cursor:"pointer" }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${T.teal},${T.tealDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, color:"#fff", flexShrink:0 }}>MY</div>
          <div>
            <div style={{ fontSize:12, fontWeight:500, color:"rgba(255,255,255,.8)", lineHeight:1.2 }}>Maya Yamamoto</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.3)" }}>Fisioterapeuta · RPG</div>
          </div>
          <i className="ti ti-logout" style={{ marginLeft:"auto", color:"rgba(255,255,255,.2)", fontSize:15 }} />
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ item, active, onClick, badge }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:9, fontSize:13, fontWeight:400, color: active ? "#fff" : hov ? "rgba(255,255,255,.8)" : "rgba(255,255,255,.45)", cursor:"pointer", transition:"all .15s", background: active ? "rgba(42,172,191,.18)" : hov ? "rgba(255,255,255,.06)" : "transparent", position:"relative", userSelect:"none" }}>
      {active && <span style={{ position:"absolute", left:0, top:"50%", transform:"translateY(-50%)", width:3, height:16, background:T.teal, borderRadius:"0 3px 3px 0" }} />}
      <i className={`ti ${item.icon}`} style={{ fontSize:17, flexShrink:0 }} />
      <span>{item.label}</span>
      {badge > 0 && <span style={{ marginLeft:"auto", minWidth:18, height:18, background:T.teal, color:"#fff", borderRadius:9, fontSize:10, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 5px" }}>{badge}</span>}
    </div>
  );
}

/* ═══════════════════════════════
   TOPBAR
═══════════════════════════════ */
function Topbar({ page, hasBday, onBell }) {
  const titles = { home:"Início", agenda:"Agenda de Consultas", pacientes:"Gestão de Pacientes", prontuarios:"Prontuários e Evolução", config:"Configurações" };
  const date = `${WDAYS[TODAY.getDay()]}, ${TODAY.getDate()} de ${MONTHS[TODAY.getMonth()]} de ${TODAY.getFullYear()}`;
  return (
    <header style={{ height:56, flexShrink:0, background:T.surface, borderBottom:`1px solid rgba(0,0,0,.06)`, padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div>
        <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:18, fontStyle:"italic", color:T.ink, letterSpacing:"-.02em", lineHeight:1 }}>{titles[page]}</div>
        <div style={{ fontSize:11, color:T.ink3, marginTop:2, fontWeight:300 }}>{date}</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <TopbarBtn onClick={onBell} title="Notificações">
          <i className="ti ti-bell" />
          {hasBday && <span style={{ position:"absolute", top:7, right:7, width:6, height:6, background:T.green, borderRadius:"50%", border:`1.5px solid ${T.surface}` }} />}
        </TopbarBtn>
        <TopbarBtn title="Busca"><i className="ti ti-search" /></TopbarBtn>
      </div>
    </header>
  );
}
function TopbarBtn({ children, onClick, title }) {
  const [hov, setHov] = useState(false);
  return (
    <button title={title} onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width:34, height:34, borderRadius:8, border:`1px solid ${hov ? T.teal : "rgba(0,0,0,.08)"}`, background:hov ? T.paper : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:hov ? T.teal : T.ink2, fontSize:17, transition:"all .15s", position:"relative" }}>
      {children}
    </button>
  );
}

/* ═══════════════════════════════
   ROOT APP
═══════════════════════════════ */
export default function MayaDashboard() {
  const [page, setPage]           = useState("home");
  const [patients, setPatients]   = useState(SEED_PATIENTS);
  const [consultas, setConsultas] = useState(SEED_CONSULTAS);
  const [prontuarios, setPronts]  = useState(SEED_PRONTUARIOS);
  const [toasts, setToasts]       = useState([]);
  const [bdayMsg, setBdayMsg]     = useState("Olá {nome}! 🎉 A Maya Yamamoto RPG deseja a você um feliz aniversário! Que este novo ano seja repleto de saúde, bem-estar e alegria. 💙");

  const toast = useCallback((msg, type="") => {
    const id = uid();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);

  const hasBday = patients.some(p => p.nasc && p.nasc.slice(5) === TODAYS.slice(5));
  const agendaBadge = consultas.filter(c => c.data === TODAYS).length;

  /* Patient ops */
  const addPatient  = p => { setPatients(ps => [...ps, p]); toast(`${p.nome} cadastrado(a)!`, "success"); };
  const editPatient = p => { setPatients(ps => ps.map(x => x.id === p.id ? p : x)); toast("Paciente atualizado!", "success"); };
  const delPatient  = id => { if (!window.confirm("Remover este paciente?")) return; setPatients(ps => ps.filter(p => p.id !== id)); toast("Paciente removido.", "success"); };

  /* Consulta ops */
  const addConsulta  = c => { setConsultas(cs => [...cs, c]); toast("Consulta agendada!", "success"); };
  const editConsulta = c => { setConsultas(cs => cs.map(x => x.id === c.id ? c : x)); toast("Consulta atualizada!", "success"); };
  const delConsulta  = id => { if (!window.confirm("Remover esta consulta?")) return; setConsultas(cs => cs.filter(c => c.id !== id)); toast("Consulta removida.", "success"); };

  /* Prontuário ops */
  const addPront = p => {
    setPronts(ps => [...ps, p]);
    setPatients(pts => pts.map(x => x.id === p.pid ? { ...x, ultima: p.data } : x));
    toast("Evolução registrada!", "success");
  };
  const delPront = id => { if (!window.confirm("Remover esta evolução?")) return; setPronts(ps => ps.filter(p => p.id !== id)); toast("Evolução removida.", "success"); };

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'Geist',system-ui,sans-serif" }}>
      <Sidebar active={page} onNav={setPage} agendaBadge={agendaBadge} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden" }}>
        <Topbar page={page} hasBday={hasBday} onBell={() => {
          const bs = patients.filter(p => p.nasc && p.nasc.slice(5) === TODAYS.slice(5));
          bs.length ? toast(`🎂 ${bs.map(p=>p.nome.split(" ")[0]).join(", ")} faz aniversário hoje!`, "success") : toast("Nenhuma notificação pendente.");
        }} />
        <div style={{ flex:1, overflowY:"auto", padding:"24px 28px 40px" }}>
          <BirthdayBanner patients={patients} bdayMsg={bdayMsg} />
          {page === "home" && (
            <HomePage patients={patients} consultas={consultas}
              onNavAgenda={() => setPage("agenda")} onNavPacientes={() => setPage("pacientes")}
              onAddPatient={addPatient} onEditConsulta={editConsulta} onDeleteConsulta={delConsulta} />
          )}
          {page === "agenda" && (
            <AgendaPage consultas={consultas} patients={patients}
              onAddConsulta={addConsulta} onEditConsulta={editConsulta} onDeleteConsulta={delConsulta} />
          )}
          {page === "pacientes" && (
            <PacientesPage patients={patients} onAdd={addPatient} onEdit={editPatient} onDelete={delPatient} />
          )}
          {page === "prontuarios" && (
            <ProntuariosPage prontuarios={prontuarios} patients={patients} onAdd={addPront} onDelete={delPront} />
          )}
          {page === "config" && (
            <ConfigPage bdayMsg={bdayMsg} onBdayMsgChange={setBdayMsg} onToast={toast} />
          )}
        </div>
      </div>
      <ToastContainer toasts={toasts} remove={id => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  );
}

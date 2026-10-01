let rol = localStorage.getItem('rol_actual') || null;
let reportes = JSON.parse(localStorage.getItem('reportes_edoc')) || [];
const entrar = r => { localStorage.setItem('rol_actual', r); location.reload(); };
const salir = () => { localStorage.removeItem('rol_actual'); location.reload(); };

function iniciarApp(){
  if(!rol){ loginView.style.display='grid'; appView.style.display='none'; return; }
  loginView.style.display='none'; appView.style.display='block';
  if(rol==='ciudadano'){ tituloRol.textContent='Panel Ciudadano'; descRol.textContent='Crea y consulta tus reportes'; formCard.style.display='block'; statsPanel.style.display='none'; listaTitulo.textContent='Mis reportes'; }
  if(rol==='copaci'){ tituloRol.textContent='Panel COPACI'; descRol.textContent='Atiende reportes de tu colonia'; formCard.style.display='none'; statsPanel.style.display='none'; listaTitulo.textContent='Reportes vecinales'; }
  if(rol==='administrador'){ tituloRol.textContent='Panel Administrador'; descRol.textContent='Control total del sistema'; formCard.style.display='none'; statsPanel.style.display='grid'; listaTitulo.textContent='Todos los reportes'; }
  render();
}
function render(){
  lista.innerHTML=''; let filtrados = rol==='ciudadano'? reportes.filter(r=>r.creador==='ciudadano') : reportes;
  statTotal.textContent=reportes.length; statPend.textContent=reportes.filter(r=>r.estado==='Pendiente').length; statProc.textContent=reportes.filter(r=>r.estado==='En proceso').length; statRes.textContent=reportes.filter(r=>r.estado==='Resuelto').length;
  contador.textContent=filtrados.length+' reportes';
  [...filtrados].reverse().forEach(r=>{
    const i=reportes.indexOf(r); const d=document.createElement('div'); d.className='reporte-item';
    let btns = rol==='ciudadano'? `<small style="color:#6b7280">En espera de COPACI</small>` : `<button onclick="cambiar(${i},'En proceso')" style="padding:6px 10px;background:#f59e0b;color:white;border:none;border-radius:6px;cursor:pointer">En proceso</button> <button onclick="cambiar(${i},'Resuelto')" style="padding:6px 10px;background:#10b981;color:white;border:none;border-radius:6px;cursor:pointer">Resuelto</button>`;
    if(rol==='administrador') btns+=` <button onclick="borrar(${i})" style="padding:6px 10px;background:#fee;border:1px solid #fecaca;color:#ef4444;border-radius:6px;cursor:pointer">Borrar</button>`;
    d.innerHTML=`<div style="display:flex;justify-content:space-between"><b>${r.tipo}</b><span style="font-size:11px;background:${r.estado==='Pendiente'?'#fef3c7':r.estado==='En proceso'?'#dbeafe':'#d1fae5'};padding:3px 8px;border-radius:6px">${r.estado}</span></div><div style="font-size:13px;margin:6px 0">📍 ${r.direccion}<br>${r.descripcion}</div><small style="color:#9ca3af">${r.creador} • ${r.fecha}</small><div style="margin-top:8px">${btns}</div>`; lista.appendChild(d);
  });
}
const cambiar=(i,e)=>{ reportes[i].estado=e; localStorage.setItem('reportes_edoc',JSON.stringify(reportes)); render(); };
const borrar=i=>{ if(confirm('¿Borrar?')){ reportes.splice(i,1); localStorage.setItem('reportes_edoc',JSON.stringify(reportes)); render(); } };
formReporte?.addEventListener('submit',e=>{ e.preventDefault(); reportes.push({tipo:tipo.value,direccion:direccion.value,descripcion:desc.value,estado:'Pendiente',creador:rol,fecha:new Date().toLocaleString('es-MX')}); localStorage.setItem('reportes_edoc',JSON.stringify(reportes)); e.target.reset(); render(); });
iniciarApp();
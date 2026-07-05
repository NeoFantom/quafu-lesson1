
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('report-theme', t);
  const btn = document.getElementById('themeBtn');
  if(btn) btn.textContent = t === 'dark' ? '☀' : '◐';
  if(window.__renderMermaid) window.__renderMermaid();
}
function toggleTheme(){
  const cur = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(cur === 'dark' ? 'light' : 'dark');
}
// 启动时套用上次选择（默认浅色）
(function(){
  const saved = localStorage.getItem('report-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeBtn');
  if(btn) btn.textContent = saved === 'dark' ? '☀' : '◐';
})();

function zoomFig(el){
  const node = el.querySelector('svg, img');
  if(!node){ return; }
  const clone = node.cloneNode(true);
  if(clone.tagName.toLowerCase() === 'svg'){
    clone.removeAttribute('width'); clone.removeAttribute('height'); clone.style.maxWidth='none';
  }
  const inner = document.getElementById('modalInner');
  inner.innerHTML=''; inner.appendChild(clone);
  document.getElementById('modal').classList.add('on');
}
function closeModal(){ document.getElementById('modal').classList.remove('on'); }
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

// ---------- 翻页：自由滚动保留；空格 / PageUp·Down / 按钮 把下一条居中 ----------
(function(){
  // 每个“讲解条目” = 封面 + 各级标题。无需额外标记，按文档顺序收集。
  const slides = [...document.querySelectorAll('.hero, section h2, section h3, #c4 ol')].filter(el => !(el.tagName === 'H2' && el.closest('#c1')));
  const ind = document.getElementById('pageInd');
  if(!slides.length) return;
  function curIdx(){
    const mid = window.innerHeight * 0.42; let best=0, bd=Infinity;
    slides.forEach((s,i)=>{ const r=s.getBoundingClientRect(); const d=Math.abs(r.top-mid); if(d<bd){bd=d; best=i;} });
    return best;
  }
  function setInd(i){ if(ind) ind.textContent = (i+1)+' / '+slides.length; }
  function goTo(i){
    i = Math.max(0, Math.min(slides.length-1, i));
    const s = slides[i];
    if(s.classList && s.classList.contains('hero')){ window.scrollTo({top:0, behavior:'smooth'}); }
    else { s.scrollIntoView({ behavior:'smooth', block:'center' }); }
    setInd(i);
  }
  window.pageNext = ()=> goTo(curIdx()+1);
  window.pagePrev = ()=> goTo(curIdx()-1);
  document.addEventListener('keydown', e=>{
    if(/^(input|textarea|select)$/i.test(e.target.tagName)) return;
    const modal = document.getElementById('modal');
    if(modal && modal.classList.contains('on')) return;
    if(e.key === ' '){ e.preventDefault(); e.shiftKey ? window.pagePrev() : window.pageNext(); }
    else if(e.key === 'PageDown'){ e.preventDefault(); window.pageNext(); }
    else if(e.key === 'PageUp'){ e.preventDefault(); window.pagePrev(); }
  });
  let t; window.addEventListener('scroll', ()=>{ clearTimeout(t); t=setTimeout(()=>setInd(curIdx()),90); }, {passive:true});
  setInd(0);
})();

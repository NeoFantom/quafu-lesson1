function applyTheme(t){document.documentElement.setAttribute('data-theme',t);localStorage.setItem('quafu-lesson-theme',t);const b=document.getElementById('themeBtn');if(b)b.textContent=t==='dark'?'☀':'◐'}
function toggleTheme(){const cur=document.documentElement.getAttribute('data-theme')||'light';applyTheme(cur==='dark'?'light':'dark')}
(function(){applyTheme(localStorage.getItem('quafu-lesson-theme')||'light')})();
function zoomFig(el){const node=el&&el.querySelector('img,svg');const inner=document.getElementById('modalInner');const modal=document.getElementById('modal');if(!node||!inner||!modal)return;let preview;if(node.tagName.toLowerCase()==='img'){preview=new Image();preview.src=node.currentSrc||node.getAttribute('src');preview.alt=node.getAttribute('alt')||''}else{preview=node.cloneNode(true);preview.removeAttribute('width');preview.removeAttribute('height')}preview.classList.add('zoomed-media');inner.innerHTML='';inner.appendChild(preview);modal.classList.add('on')}
function closeModal(){document.getElementById('modal').classList.remove('on')}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
(function(){const slides=[...document.querySelectorAll('.hero, section h2, section h3')];const ind=document.getElementById('pageInd');if(!slides.length)return;function cur(){const mid=innerHeight*.42;let best=0,bd=1e9;slides.forEach((s,i)=>{const d=Math.abs(s.getBoundingClientRect().top-mid);if(d<bd){bd=d;best=i}});return best}function set(i){if(ind)ind.textContent=(i+1)+' / '+slides.length}function go(i){i=Math.max(0,Math.min(slides.length-1,i));if(slides[i].classList.contains('hero'))scrollTo({top:0,behavior:'smooth'});else slides[i].scrollIntoView({behavior:'smooth',block:'center'});set(i)}window.pageNext=()=>go(cur()+1);window.pagePrev=()=>go(cur()-1);document.addEventListener('keydown',e=>{if(/^(input|textarea|select)$/i.test(e.target.tagName))return;if(document.getElementById('modal').classList.contains('on'))return;if(e.key===' '){e.preventDefault();e.shiftKey?pagePrev():pageNext()}else if(e.key==='PageDown'){e.preventDefault();pageNext()}else if(e.key==='PageUp'){e.preventDefault();pagePrev()}});let t;addEventListener('scroll',()=>{clearTimeout(t);t=setTimeout(()=>set(cur()),80)},{passive:true});set(0)})();
(function(){const dock=document.getElementById('sideDock');const sections=[...document.querySelectorAll('section[id]')];const links=[...document.querySelectorAll('.side-toc a[data-section]')];if(!dock||!sections.length||!links.length)return;function updateSideDock(){const y=scrollY||document.documentElement.scrollTop;const scrolled=y>110;dock.classList.toggle('on',scrolled);document.documentElement.classList.toggle('chrome-scrolled',scrolled);let current=sections[0].id;for(const section of sections){if(section.getBoundingClientRect().top<=innerHeight*.34)current=section.id}links.forEach(a=>a.classList.toggle('active',a.dataset.section===current))}addEventListener('scroll',updateSideDock,{passive:true});addEventListener('resize',updateSideDock);updateSideDock()})();
(function(){
  const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const hit=(s,re,cls)=>s.replace(re,m=>`<span class="${cls}">${m}</span>`);
  function splitComment(line){const i=line.indexOf('//');return i<0?[line,'']:[line.slice(0,i),line.slice(i)]}
  function qasmPart(s){let out=esc(s);out=hit(out,/&quot;[^&]*?&quot;|"[^"\n]*"/g,'hl-str');out=hit(out,/\b(OPENQASM|include|qreg|creg|measure|barrier|reset|gate|opaque|if)\b/g,'hl-key');out=hit(out,/\b(h|x|y|z|s|sdg|t|tdg|rx|ry|rz|u|u1|u2|u3|cx|cz|ccx|swap|id)\b(?=\s|\[|;|,)/gi,'hl-gate');out=hit(out,/\b[a-zA-Z_][\w]*\[[^\]]+\]/g,'hl-reg');out=hit(out,/\b\d+(?:\.\d+)?\b/g,'hl-num');return out}
  function qasmLine(line){const [code,comment]=splitComment(line);return qasmPart(code)+(comment?`<span class="hl-com">${esc(comment)}</span>`:'')}
  function qasm(src){return src.split('\n').map(qasmLine).join('\n')}
  function pyPart(s){let out=esc(s);out=hit(out,/(&quot;[^&]*?&quot;|"[^"\n]*"|'[^'\n]*')/g,'hl-str');out=hit(out,/\b(from|import|for|in|if|else|return|print|False|True|None)\b/g,'hl-key');out=hit(out,/\b(Task|dict|list|int)\b/g,'hl-type');out=hit(out,/\b(tmgr|task|circuit|tid|res)\b/g,'hl-var');out=hit(out,/\b\d+(?:\.\d+)?\b/g,'hl-num');return out}
  function pyLine(line){const i=line.indexOf('#');if(i<0)return pyPart(line);return pyPart(line.slice(0,i))+`<span class="hl-com">${esc(line.slice(i))}</span>`}
  function py(src){
    const lines=src.split('\n');let inQasm=false;const rendered=[];
    for(let i=0;i<lines.length;i++){
      const line=lines[i];
      if(!inQasm&&line.includes('"""')&&lines.slice(i+1,i+6).some(x=>x.includes('OPENQASM'))){
        const at=line.indexOf('"""');inQasm=true;rendered.push(pyPart(line.slice(0,at))+`<span class="hl-str">${esc(line.slice(at))}</span>`);continue;
      }
      if(inQasm&&line.includes('"""')){inQasm=false;rendered.push(`<span class="hl-str">${esc(line)}</span>`);continue}
      if(inQasm){rendered.push(`<span class="hl-qasm-line">${qasmLine(line)}</span>`);continue}
      rendered.push(pyLine(line));
    }
    return rendered.join('\n')
  }
  function bash(src){let out=esc(src);out=hit(out,/\b(pip|python|python3|npm|node)\b/g,'hl-key');out=hit(out,/(#.*)$/gm,'hl-com');out=hit(out,/\b\d+(?:\.\d+)?\b/g,'hl-num');return out}
  function lang(src){if(src.includes('OPENQASM'))return 'python-qasm';if(/pip install|npm run|^python/m.test(src))return 'bash';return 'python'}
  document.querySelectorAll('pre code').forEach(code=>{const src=code.textContent;const pre=code.closest('pre');if(!pre||pre.dataset.highlighted)return;const l=lang(src);pre.dataset.highlighted='true';pre.classList.add('code-highlight');if(l==='python-qasm'){pre.dataset.lang='Python + OpenQASM 2.0';pre.dataset.lint='OpenQASM lint: syntax parse check';code.innerHTML=py(src)}else if(l==='bash'){pre.dataset.lang='Shell';code.innerHTML=bash(src)}else{pre.dataset.lang='Python';code.innerHTML=py(src)}})
})();

import fs from 'node:fs';
import path from 'node:path';
import { URL } from 'node:url';

const root = process.cwd();
const publicDir = path.join(root, 'site');
const required = [
  'site/index.html',
  'site/docs-cn/index.html',
  'site/assets/css/style.css',
  'site/assets/js/app.js',
  'site/assets/images/platform-map.svg',
  'site/assets/images/quafu-workflow.svg',
  'site/assets/screenshots/01-home-dashboard.png',
  'site/assets/screenshots/02-composer.png',
  'site/assets/screenshots/03-tasks.png',
  'site/assets/screenshots/04-user.png',
  'site/assets/screenshots/05-jupyter.png',
  'notes/quafu-official-docs-inventory.md',
  'notes/platform-ui-inventory.md',
  'notes/reference-design-extract.md',
  'notes/tutorial-outline.md',
  'sources/processed/platform-ui-participant-features.json'
];
const forbiddenPublicTerms = [
  '\u5938\u7236',        // Chinese platform name; public copy must use Quafu only.
  '\u8bc4\u5ba1',        // review/judging content is out of lesson scope.
  '\u7ec4\u59d4\u4f1a',
  '\u62a5\u540d',
  '\u8d5b\u4e8b',
  '\u771f\u673a\u8d5b',
  'review system',
  'judging',
  'registration system'
];
const requiredLessonKeywords = ['QuarkStudio','tmgr.status','tmgr.run','tmgr.result','Composer','Tasks','Jupyter'];
function walk(dir){
  const out=[];
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,ent.name);
    if(ent.isDirectory()) out.push(...walk(p));
    else if(/\.(html|css|js|svg|md)$/i.test(ent.name)) out.push(p);
  }
  return out;
}
function collectIds(html){
  const ids = new Set();
  for(const m of html.matchAll(/\sid=["']([^"']+)["']/g)) ids.add(m[1]);
  return ids;
}
function attrs(html, attr){
  const values=[];
  const re = new RegExp(`\\s${attr}=["']([^"']+)["']`, 'g');
  for(const m of html.matchAll(re)) values.push(m[1]);
  return values;
}
function existsLocalRef(fromFile, ref){
  if(!ref || ref.startsWith('mailto:') || ref.startsWith('tel:')) return true;
  if(ref.startsWith('#')) return collectIds(fs.readFileSync(fromFile,'utf8')).has(ref.slice(1));
  try { const u = new URL(ref); if(u.protocol === 'http:' || u.protocol === 'https:') return true; } catch {}
  const [rawPath, frag=''] = ref.split('#');
  const targetPath = rawPath || path.basename(fromFile);
  let target = path.resolve(path.dirname(fromFile), targetPath);
  if(fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  if(!fs.existsSync(target)) return false;
  if(frag && /\.html?$/i.test(target)) return collectIds(fs.readFileSync(target,'utf8')).has(frag);
  return true;
}
let ok=true;
function fail(msg){ console.error(`FAIL: ${msg}`); ok=false; }
function pass(msg){ console.log(`PASS: ${msg}`); }
for(const rel of required){
  if(!fs.existsSync(path.join(root,rel))) fail(`missing ${rel}`);
}
const publicFiles = walk(publicDir);
for(const file of publicFiles){
  const rel=path.relative(root,file);
  const text=fs.readFileSync(file,'utf8');
  for(const bad of forbiddenPublicTerms){
    if(text.toLowerCase().includes(bad.toLowerCase())) fail(`forbidden public term ${JSON.stringify(bad)} in ${rel}`);
  }
  if(/@gmail\.com/i.test(text)) fail(`personal email leaked in ${rel}`);
  if(/Task\(["'](?!YOUR_QUAFU_TOKEN)/.test(text)) fail(`possible real token in ${rel}`);
  if(/(api[_-]?key|token|password)\s*[:=]\s*["'][A-Za-z0-9_@#$%^&*+=.-]{12,}["']/i.test(text)) fail(`credential-looking assignment in ${rel}`);
  if(/\.html?$/i.test(file)){
    for(const href of attrs(text,'href')) if(!existsLocalRef(file, href)) fail(`${rel} missing href target ${href}`);
    for(const src of attrs(text,'src')) if(!existsLocalRef(file, src)) fail(`${rel} missing src target ${src}`);
  }
}
const index=fs.readFileSync(path.join(root,'site/index.html'),'utf8');
for(const must of requiredLessonKeywords){
  if(!index.includes(must)) fail(`missing tutorial keyword ${must}`);
}
if(ok){
  pass('public site files exist');
  pass('public content guardrails passed');
  pass('local HTML links/assets resolve');
  pass('required lesson keywords present');
} else {
  process.exit(1);
}

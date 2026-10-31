const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const assert=require('node:assert/strict');
const url=process.env.TEST_URL||'file://'+process.cwd()+'/index.html';
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']});
for(const w of [320,375,414,768,1280]){const p=await b.newPage({viewport:{width:w,height:900}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(url);await p.waitForTimeout(300);
assert.equal(await p.locator('#year').innerText(),String(new Date().getFullYear()),'footer year is current');
const tema=()=>p.evaluate(()=>document.documentElement.getAttribute('data-theme')||'');
const awal=await tema();await p.locator('#themeToggle').click();await p.waitForTimeout(200);
const kedua=await tema();assert.notEqual(kedua,awal,'theme toggle switches the theme');
await p.reload();await p.waitForTimeout(250);
assert.equal(await tema(),kedua,'theme choice persists after reload');
await p.locator('#themeToggle').click();await p.waitForTimeout(150);
if(w<=768){const menu=p.locator('#menu');const terbuka=await p.locator('#navToggle').getAttribute('aria-expanded');
await p.locator('#navToggle').click();await p.waitForTimeout(250);
assert.equal(await p.locator('#navToggle').getAttribute('aria-expanded'),terbuka==='true'?'false':'true','menu toggle flips state');
if(terbuka!=='true'){assert(await menu.isVisible(),'mobile menu opens');await p.locator('#menu a[href="#projects"]').click();await p.waitForTimeout(300);
assert(!(await menu.isVisible()),'mobile menu closes after choosing a link');}}
for(const id of ['about','skills','projects','education','contact']){assert((await p.locator('#'+id).count())===1,'section '+id+' exists');}
assert((await p.locator('#projects a[href^="https://atmajadesna.github.io/"]').count())>=8,'project cards link to the live demos');
const kartu=p.locator('#emailCard');assert((await kartu.innerText()).includes('[at]'),'contact card shows an obfuscated address');
assert(await kartu.getAttribute('data-u')&&await kartu.getAttribute('data-d'),'address parts are split so scrapers cannot read them');
const sumber=require('node:fs').readFileSync('script.js','utf8');
assert(/mailto:/.test(sumber)&&/getAttribute\("data-u"\)/.test(sumber),'the mail draft is assembled in script, not in the markup');
await kartu.click();await p.waitForTimeout(150);
assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
assert.equal(errors.length,0);
console.log(w,'PASS theme toggle/persistence/mobile menu/sections/links');await p.close();}
await b.close();})().catch(e=>{console.error(e);process.exit(1)});

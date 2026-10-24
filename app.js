import {initialPlans,airports,validPlan} from './seed.js?v=20261024-3';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)],clone=x=>structuredClone(x), uid=()=>crypto.randomUUID(),esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let config;try{config=JSON.parse(localStorage.getItem('southbound-config')||'null')}catch{}config||={name:'我',url:'',key:'',room:''};config={...config,...(window.TRIP_CONFIG||{})};
const hash=new URLSearchParams(location.hash.slice(1));if(hash.has('room')){config={...config,room:hash.get('room')||'',url:hash.get('url')||config.url,key:hash.get('key')||config.key};}
if(config.url&&config.key&&!config.room){config.room=(uid()+uid()).replaceAll('-','');location.hash=new URLSearchParams({room:config.room}).toString();localStorage.setItem('southbound-config',JSON.stringify(config));}
const storageKey=()=>`southbound-board-v1:${config.room||'local'}`;
let state;try{state=JSON.parse(localStorage.getItem(storageKey())||'null')}catch{}
const defaults=()=>({plans:clone(initialPlans),travelers:2,rates:{clp:991.77,cny:6.72},currency:'USD'});state||=defaults();const oldTitles={'Raleigh 出发 · 圣诞在岛上':'Plan A','Raleigh 出发 · 少一点中转':'Plan B','湾区出发 · SFO 方案':'Plan C'};state.plans.forEach(p=>{if(oldTitles[p.title])p.title=oldTitles[p.title]});state.plans.forEach(p=>{if(!p.updatedAt){const seed=initialPlans.find(q=>q.id===p.id);if(seed)p.legs.forEach(l=>{if(!l.url)l.url=seed.legs.find(k=>k.id===l.id)?.url||''})}});
const dateMigrationKey=`${storageKey()}:dec30-v1`;
if(!localStorage.getItem(dateMigrationKey)){
 state.plans.forEach(p=>p.legs.forEach(l=>{if(l.from==='SCL'&&l.to==='SJO'&&l.date==='2026-12-28'){l.date='2026-12-30';l.price=0;l.note='12/30票价、时刻与转机待查；此前12/28参考价为USD 561。';l.url='https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTEyLTMwagcIARIDU0NMcgcIARIDU0pPQAFIAXABggELCP___________wGYAQI&hl=en';l.hours=0;l.stops=0;}}));
 localStorage.setItem(dateMigrationKey,'1');localStorage.setItem(storageKey(),JSON.stringify(state));
}
function applyVerifiedIslandFare(plans){
 const link='https://www.latamairlines.com/cl/es/ofertas-vuelos?dataFlight='+encodeURIComponent(JSON.stringify({tripTypeSelected:{value:'RT'},cabinSelected:{label:'Economy',value:'Economy'},passengerSelected:{adultQuantity:1,childrenQuantity:0,infantQuantity:0},originSelected:{id:'SCL_CL_AIRPORT',iata:'SCL',type:'AIRPORT',airportIataCode:'SCL'},destinationSelected:{id:'IPC_CL_AIRPORT',iata:'IPC',type:'AIRPORT',airportIataCode:'IPC'},dateGoSelected:'2026-12-22',dateReturnSelected:'2026-12-24'}));
 plans.forEach(p=>{const outbound=p.legs.find(l=>l.from==='SCL'&&l.to==='IPC'&&l.date==='2026-12-22');const inbound=p.legs.find(l=>l.from==='IPC'&&l.to==='SCL'&&(l.date==='2026-12-26'||l.date==='2026-12-24'));if(!outbound||!inbound)return;
 Object.assign(outbound,{price:552244,currency:'CLP',airline:'LATAM Basic',hours:5.33,stops:0,url:link,note:'08:35–11:55，直飞。往返含税合计CLP 552,244/人，2026/10/24官网摘要核实；Basic仅含随身小包。'});
 Object.assign(inbound,{date:'2026-12-24',price:0,currency:'CLP',airline:'LATAM Basic',hours:4.67,stops:0,url:link,note:'14:30–21:10，直飞。价格已计入往返合计。'});
 });
}

if(!localStorage.getItem(`${storageKey()}:island-dec24-verified-v1`)){applyVerifiedIslandFare(state.plans);localStorage.setItem(`${storageKey()}:island-dec24-verified-v1`,'1');localStorage.setItem(storageKey(),JSON.stringify(state));}
function applyPlanBScreenshot(plans){
 const p=plans.find(p=>p.id==='rdu-comfort');if(!p)return;
 const out=p.legs.find(l=>l.from==='RDU'&&l.to==='SCL');
 const back=p.legs.find(l=>l.from==='SJO'&&l.to==='RDU');
 const url="https://www.google.com/travel/flights/booking?tfs=CBwQAhphEgoyMDI2LTEyLTIwIiAKA1JEVRIKMjAyNi0xMi0yMBoDSUFIKgJVQTIEMjM0MSIfCgNJQUgSCjIwMjYtMTItMjAaA1NDTCoCVUEyAzg0N2oHCAESA1JEVXIHCAESA1NDTBqDARIKMjAyNy0wMS0wNSIfCgNTSk8SCjIwMjctMDEtMDUaA01JQSoCQUEyAzQwNiIgCgNNSUESCjIwMjctMDEtMDUaA1BITCoCQUEyBDMwMjUiIAoDUEhMEgoyMDI3LTAxLTA1GgNSRFUqAkFBMgQxOTI1agcIARIDU0pPcgcIARIDUkRVQAFIAXABggELCP___________wGYAQM&tfu=CoABQ2pSSU9GRk1kVXRTTWtWNFlVVkJTSGhmWm1kQ1J5MHRMUzB0TFMwdExYQm1ZbXhxT0VGQlFVRkJSM0pqWDI5alJsWk1Va05CRWhOQlFUUXdObnhCUVRNd01qVjhRVUV4T1RJMUdnc0l5TFFJRUFJYUExVlRSRGdjY01pMENBPT0SAggAIgA&hl=en";
 if(out)Object.assign(out,{date:'2026-12-20',arrival:'2026-12-21',airline:'United',price:1378,currency:'USD',stops:1,hours:14,url,note:'16:50–次日08:50；经 IAH（休斯顿）中转。去回合计 USD 1,378/人（用户截图，2026/10/24）。含1件随身行李；首件托运$90。'});
 if(back)Object.assign(back,{date:'2027-01-05',arrival:'2027-01-05',airline:'American',price:0,currency:'USD',stops:2,hours:10.65,url,note:'11:35–23:14；经 MIA（迈阿密）、PHL（费城）中转。票价已包含在去回合计；含1件随身行李，首件托运$55。'});
 p.note='美国两端组合：去程United，回程American，USD 1,378/人。按用户2026/10/24提供的截图更新；实际购买前以结算价格为准。';
}

if(!localStorage.getItem(`${storageKey()}:planb-screenshot-1378-v1`)){
 applyPlanBScreenshot(state.plans);
 localStorage.setItem(`${storageKey()}:planb-screenshot-1378-v1`,'1');
 localStorage.setItem(storageKey(),JSON.stringify(state));
}
function applyPlanBReturnCorrection(plans){
 const p=plans.find(p=>p.id==='rdu-comfort');if(!p)return;
 const url="https://www.google.com/travel/flights/booking?tfs=CBwQAhphEgoyMDI2LTEyLTIwIiAKA1JEVRIKMjAyNi0xMi0yMBoDSUFIKgJVQTIEMjM0MSIfCgNJQUgSCjIwMjYtMTItMjAaA1NDTCoCVUEyAzg0N2oHCAESA1JEVXIHCAESA1NDTBphEgoyMDI3LTAxLTA1Ih8KA1NKTxIKMjAyNy0wMS0wNRoDTUlBKgJBQTIDMzE4IiAKA01JQRIKMjAyNy0wMS0wNRoDUkRVKgJBQTIEMTU2NmoHCAESA1NKT3IHCAESA1JEVUABSAFwAYIBCwj___________8BmAED&tfu=CnRDalJJWkRZMU0wWkVPRlZpWmxGQlNWWjBkR2RDUnkwdExTMHRMWEJtWm0weE55MXVNVUZCUVVGQlIzSmpYM2QzUzBsellYbEJFZ3hCUVRNeE9IeEJRVEUxTmpZYUN3akl0QWdRQWhvRFZWTkVPQnh3eUxRSRICCAAiAwoBMQ&hl=en";
 const out=p.legs.find(l=>l.from==='RDU'&&l.to==='SCL');
 const back=p.legs.find(l=>l.from==='SJO'&&l.to==='RDU');
 if(out){out.url=url;out.price=1378;out.currency='USD';}
 if(back)Object.assign(back,{date:'2027-01-05',arrival:'2027-01-05',airline:'American',price:0,currency:'USD',stops:1,hours:7.3667,url,note:'15:37–23:59；经 MIA（迈阿密）一次中转。票价已包含在去回合计 USD 1,378/人；含1件随身行李，首件托运$55。'});
}

if(!localStorage.getItem(`${storageKey()}:planb-return-mia-1537-v1`)){
 applyPlanBReturnCorrection(state.plans);
 localStorage.setItem(`${storageKey()}:planb-return-mia-1537-v1`,'1');
 localStorage.setItem(storageKey(),JSON.stringify(state));
}
function applyDec30Copa(plans){
 const url='https://www.google.com/travel/flights/booking?tfs=CBwQAhpgEgoyMDI2LTEyLTMwIh8KA1NDTBIKMjAyNi0xMi0zMBoDUFRZKgJDTTIDMTM5Ih8KA1BUWRIKMjAyNi0xMi0zMBoDU0pPKgJDTTIDMTkyagcIARIDU0NMcgcIARIDU0pPQAFIAXABggELCP___________wGYAQI&hl=en';
 plans.forEach(p=>p.legs.forEach(l=>{if(l.from==='SCL'&&l.to==='SJO'&&l.date==='2026-12-30')Object.assign(l,{arrival:'2026-12-30',airline:'Copa Airlines',price:311,currency:'USD',stops:1,hours:10.2333,url,note:'03:48–11:02；PTY（巴拿马城）中转1小时49分。CM139 / CM192。2026/10/24 Google Flights售票列表：Alitrip $311/人；Copa官网 $725/人。含1件随身行李，托运另付；最终价以出票渠道结算为准。'});}));
}

if(!localStorage.getItem(`${storageKey()}:dec30-copa-311-v1`)){applyDec30Copa(state.plans);localStorage.setItem(`${storageKey()}:dec30-copa-311-v1`,'1');localStorage.setItem(storageKey(),JSON.stringify(state));}
function applyUsdAmounts(plans,rates={clp:991.77,cny:6.72}){
 plans.forEach(p=>p.legs.forEach(l=>{
  if(l.currency!=='USD'){
   l.originalPrice=l.price;l.originalCurrency=l.currency;
   l.price=Math.round((l.currency==='CLP'?l.price/rates.clp:l.price/rates.cny)*100)/100;
   l.currency='USD';
  }
  l.note=l.note.replace(/CLP\s*([\d,]+(?:\.\d+)?)/g,(_,v)=>'约US$'+Math.round(Number(v.replaceAll(',',''))/rates.clp).toLocaleString('en-US'));
 }));
}

if(!localStorage.getItem(`${storageKey()}:all-usd-v1`)){applyUsdAmounts(state.plans,state.rates);localStorage.setItem(`${storageKey()}:all-usd-v1`,'1');localStorage.setItem(storageKey(),JSON.stringify(state));}
function applyPlanCReverse(plans){
 const p=plans.find(p=>p.id==='bay-budget');if(!p)return;
 p.title='Plan C';p.tag='先哥斯达黎加';
 const make=(id,from,to,date,note,arrival='')=>({id,from,to,date,arrival,airline:'待查',price:0,currency:'USD',stops:0,hours:0,url:'',note});
 p.legs=[
  make('c-us-out','RDU','SJO','2026-12-20','美国去回组合票价待查：RDU→SJO，SCL→RDU。'),
  make('c-middle','SJO','SCL','2026-12-30','先沿用12/30作为两地转场日期；航班、时刻和价格待查。'),
  make('c-island-out','SCL','IPC','2027-01-01','暂排上岛日期；价格和班次待查，不能沿用12/22–24报价。'),
  make('c-island-back','IPC','SCL','2027-01-03','暂排回程日期；给1/4国际出发留一晚缓冲。'),
  make('c-us-back','SCL','RDU','2027-01-04','暂排1/4从圣地亚哥出发，以1/5前抵达RDU为条件；时刻和价格待查。','2027-01-05')
 ];
 p.note='Plan C按用户要求改为先哥斯达黎加、后智利。中间日期暂排，不是已确认航班。所有旧路线票价已移除。';
}

if(!localStorage.getItem(`${storageKey()}:plan-c-reverse-v1`)){applyPlanCReverse(state.plans);localStorage.setItem(`${storageKey()}:plan-c-reverse-v1`,'1');localStorage.setItem(storageKey(),JSON.stringify(state));}
function applyQunarDec30Quote(plans,rates={cny:6.72}){
 plans.forEach(p=>p.legs.forEach(l=>{if(l.from==='SCL'&&l.to==='SJO'&&l.date==='2026-12-30'){
 l.price=Math.round(3000/rates.cny*100)/100;l.currency='USD';l.originalPrice=3000;l.originalCurrency='CNY';
 l.url='https://flight.qunar.com/';
 l.airline='待核实（去哪儿报价）';l.hours=0;l.stops=0;
 l.note='去哪儿约US$446/人（用户2026/10/24提供报价，按历史汇率折算）；该报价的航司、时刻、中转和行李条件尚未提供，待核实。此前Copa 03:48–11:02经PTY，Google Flights曾列Alitrip $311、Copa官网$725；不是已确认的同一票种。';
 }}));
}

if(!localStorage.getItem(`${storageKey()}:qunar-dec30-3000-v1`)){applyQunarDec30Quote(state.plans,state.rates);localStorage.setItem(`${storageKey()}:qunar-dec30-3000-v1`,'1');localStorage.setItem(storageKey(),JSON.stringify(state));}
function applyQunarSimplePrice(plans){plans.forEach(p=>p.legs.forEach(l=>{if(l.from==='SCL'&&l.to==='SJO'&&l.date==='2026-12-30')Object.assign(l,{airline:'',arrival:'',note:'',hours:0,stops:0});}));}

if(!localStorage.getItem(`${storageKey()}:qunar-price-only-v1`)){applyQunarSimplePrice(state.plans);localStorage.setItem(`${storageKey()}:qunar-price-only-v1`,'1');localStorage.setItem(storageKey(),JSON.stringify(state));}
function simplifyTripNotes(plans){
 plans.forEach(p=>p.legs.forEach(l=>{
 if(l.from==='SCL'&&l.to==='SJO'&&l.date==='2026-12-30'){l.source='去哪儿';l.note='';}
 else if(l.from==='SCL'&&l.to==='IPC'&&l.date==='2026-12-22')l.note='08:35–11:55；仅含随身小包。';
 else if(l.from==='IPC'&&l.to==='SCL'&&l.date==='2026-12-24')l.note='14:30–21:10。';
 else if(p.id==='rdu-comfort'&&l.from==='RDU'&&l.to==='SCL')l.note='16:50–次日08:50；经 IAH（休斯顿）。随身行李1件；首件托运US$90。';
 else if(p.id==='rdu-comfort'&&l.from==='SJO'&&l.to==='RDU')l.note='15:37–23:59；经 MIA（迈阿密）。随身行李1件；首件托运US$55。';
 else if(p.id==='rdu-budget'&&l.from==='RDU'&&l.to==='SCL')l.note='经 CLT（夏洛特）、MIA（迈阿密）。';
 else if(p.id==='rdu-budget'&&l.from==='SJO'&&l.to==='RDU')l.note='15:37–23:59；经 MIA（迈阿密）。';
 else if(/待查|暂排|截图|核实|参考|用户|报价/.test(l.note))l.note='';
 }));
}

if(!localStorage.getItem(`${storageKey()}:simple-notes-qunar-label-v1`)){simplifyTripNotes(state.plans);localStorage.setItem(`${storageKey()}:simple-notes-qunar-label-v1`,'1');localStorage.setItem(storageKey(),JSON.stringify(state));}
function removePlanC(plans){for(let i=plans.length-1;i>=0;i--){if(plans[i].id==='bay-budget')plans.splice(i,1);}}

if(!localStorage.getItem(`${storageKey()}:remove-plan-c-v1`)){removePlanC(state.plans);localStorage.setItem(`${storageKey()}:remove-plan-c-v1`,'1');localStorage.setItem(storageKey(),JSON.stringify(state));}
let revision=Number(localStorage.getItem(`${storageKey()}:revision`)||0),dirty=localStorage.getItem(`${storageKey()}:dirty`)==='1',busy=false,blocked=false,connected=false,filter='all',sort='manual',editing=null,timer;
const total=p=>p.legs.reduce((sum,l)=>sum+toUSD(l.price,l.currency),0);
const toUSD=(price,currency)=>currency==='CLP'?price/state.rates.clp:currency==='CNY'?price/state.rates.cny:price;
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:state.currency,maximumFractionDigits:0}).format(n*(state.currency==='CLP'?state.rates.clp:state.currency==='CNY'?state.rates.cny:1));
const day=s=>s?s.slice(5).replace('-','/'):'';
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(timer);timer=setTimeout(()=>$('#toast').classList.remove('show'),3500)}
function status(text){$('#sync-state').textContent=text}
function backup(){try{localStorage.setItem(storageKey(),JSON.stringify(state));localStorage.setItem(`${storageKey()}:revision`,String(revision));localStorage.setItem(`${storageKey()}:dirty`,dirty?'1':'0')}catch{toast('浏览器存储已满，请立即导出备份')}}
function changed(){dirty=true;backup();render();if(connected&&!blocked)push();else status(config.url?'尚未同步 · 本地已保存':'本地已保存')}
function warnings(p){let out=[];const legs=p.legs;for(let i=1;i<legs.length;i++){const a=legs[i-1],b=legs[i];if(b.date<a.date)out.push('航段日期顺序待检查');if(a.to!==b.from)out.push(`${a.to} → ${b.from} 之间缺少交通段`);if(a.arrival&&a.arrival>b.date)out.push('上一航段到达晚于下一段出发');if(b.to==='IPC'&&(a.arrival||a.date)===b.date)out.push('上岛与国际到达在同一天，请核实转机缓冲');}if(legs.length&&legs.at(-1).arrival>'2027-01-05')out.push('最终到达晚于 1/5');return [...new Set(out)]}
function groupedLegs(legs){
 const used=new Set(),rows=[];
 for(let i=0;i<legs.length;i++){
  if(used.has(i))continue;
  const a=legs[i];let j=-1;
  if(a.to==='IPC')j=legs.findIndex((b,k)=>k>i&&!used.has(k)&&b.from==='IPC'&&b.to===a.from);
  else if(i===0&&legs.length>1){const last=legs.at(-1);if(last.to===a.from&&last.from!=='IPC')j=legs.length-1;}
  if(j>=0){used.add(j);rows.push([a,legs[j]]);}else rows.push([a]);
 }
 return rows;
}
function flightRows(legs){return groupedLegs(legs).map(group=>{
 const pair=group.length===2;
 const line=(l,i,text)=>`<div class="group-line">${pair?`<span class="direction">${i===0?'去':'回'}</span> `:''}${text}</div>`;
 const price='US$'+Math.round(group.reduce((n,l)=>n+toUSD(l.price,l.currency),0)).toLocaleString('en-US');
 const urls=[...new Set(group.map(l=>l.url).filter(Boolean))];
 return `<tr><td>${group.map((l,i)=>line(l,i,esc(l.date)+(l.arrival?`<small>到达 ${esc(l.arrival)}</small>`:''))).join('')}</td><td>${group.map((l,i)=>line(l,i,`${esc(l.from)} → ${esc(l.to)}`)).join('')}</td><td>${group.map((l,i)=>line(l,i,esc(/待核实|待查/.test(l.airline)?'':l.airline)||'—')).join('')}</td><td>${group.some(l=>l.price)?price:'—'}${group.find(l=>l.source)?.source?'（'+esc(group.find(l=>l.source).source)+'）':''}${pair?'<small>去回合计 / 人</small>':''}</td><td class="transfer">${group.map((l,i)=>line(l,i,`${l.stops?l.stops+' 次中转':l.hours?'直飞':'—'}${l.hours?' · '+Math.floor(l.hours)+'h '+Math.round(l.hours%1*60)+'m':''}${l.note&&!/待核实|待查|暂排/.test(l.note)?`<small>${esc(l.note)}</small>`:''}`)).join('')}</td></tr>`;
 }).join('');}
function render(){
 $('#travelers').value=state.travelers;$('#display-currency').value=state.currency;$('#count').textContent=state.plans.length;
 let plans=[...state.plans];if(sort==='price')plans.sort((a,b)=>total(a)-total(b));if(sort==='stops')plans.sort((a,b)=>a.legs.reduce((n,l)=>n+l.stops,0)-b.legs.reduce((n,l)=>n+l.stops,0));
 const expanded=new Set($$('#plans details[open]').map(el=>el.dataset.id));
 const firstRender=!$('#plans').children.length;
 $('#plans').innerHTML=plans.length?plans.map((p,i)=>`<details class="plan" data-id="${esc(p.id)}" ${(firstRender?i===0:expanded.has(p.id))?'open':''}><summary><strong>${esc(p.title)}</strong></summary><div class="plan-tools"><button data-action="edit">编辑</button><button data-action="delete">删除</button></div><div class="table-wrap"><table><thead><tr><th>日期</th><th>航线</th><th>航司</th><th>价格 / 人（美元）</th><th>转机信息</th></tr></thead><tbody>${flightRows(p.legs)}</tbody></table></div></details>`).join(''):'<p>暂无方案，点击「新增 Plan」。</p>';
}
function legForm(l,i){return `<section class="leg-form" data-leg="${esc(l.id)}"><div class="leg-form-top"><span>航段 ${String(i+1).padStart(2,'0')}</span><button type="button" data-action="remove-leg">移除</button></div><div class="leg-grid">${[['from','出发机场','text',l.from],['to','到达机场','text',l.to],['date','出发日期','date',l.date],['arrival','到达日期（选填）','date',l.arrival],['airline','航空公司','text',l.airline],['price','每人票价','number',l.price]].map(([key,title,type,value])=>`<label>${title}<input name="${key}" type="${type}" value="${esc(value)}" ${key==='arrival'?'':'required'} ${type==='number'?'min="0" max="10000000000" step="0.01"':''} ${type==='text'?'maxlength="160"':''}></label>`).join('')}<label>币种<select name="currency">${['USD','CLP','CNY'].map(c=>`<option ${c===l.currency?'selected':''}>${c}</option>`).join('')}</select></label><label>中转次数<input name="stops" type="number" value="${l.stops}" min="0" max="20" step="1" required></label><label>总时长（小时）<input name="hours" type="number" value="${l.hours}" min="0" max="1000" step="0.01" required></label><input name="url" type="hidden" value="${esc(l.url)}"><label class="wide">转机信息 / 票价说明<input name="note" value="${esc(l.note)}" maxlength="3000" placeholder="组合价、行李、转机……"></label></div></section>`}
function openEditor(plan){editing=clone(plan);$('#edit-form').elements.title.value=plan.title;$('#edit-form').elements.tag.value=plan.tag;$('#edit-form').elements.note.value=plan.note;$('#leg-forms').innerHTML=plan.legs.map(legForm).join('');$('#editor-title').textContent=state.plans.some(p=>p.id===plan.id)?'编辑方案':'新增方案';$('#editor').showModal()}
function collect(){const f=$('#edit-form');return {...editing,title:f.elements.title.value.trim(),tag:f.elements.tag.value.trim(),note:f.elements.note.value,legs:$$('.leg-form').map(el=>{const get=k=>el.querySelector(`[name="${k}"]`).value;return {id:el.dataset.leg,from:get('from').trim().toUpperCase(),to:get('to').trim().toUpperCase(),date:get('date'),arrival:get('arrival'),airline:get('airline'),price:Number(get('price')),currency:get('currency'),stops:Number(get('stops')),hours:Number(get('hours')),url:get('url').trim(),note:get('note')}})}}
function openSettings(){const f=$('#sync-form');for(const k of ['name','url','key','room'])f.elements[k].value=config[k]||'';if(!f.elements.room.value)f.elements.room.value=(uid()+uid()).replaceAll('-','');$('#settings').showModal()}
function download(){const blob=new Blob([JSON.stringify({format:'southbound-v1',...state},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`一起向南-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000)}
async function rpc(method,args){const res=await fetch(`${config.url}/rest/v1/rpc/${method}`,{method:'POST',headers:{apikey:config.key,'Content-Type':'application/json'},body:JSON.stringify(args),signal:AbortSignal.timeout(12000)});if(!res.ok)throw Error(res.status===409?'CONFLICT':res.status===404?'请先运行项目提供的 supabase.sql':`云端请求失败 (${res.status})`);return res.json()}
function validState(s){return s&&Array.isArray(s.plans)&&s.plans.length<=100&&s.plans.every(validPlan)&&new Set(s.plans.map(p=>p.id)).size===s.plans.length&&Number.isInteger(s.travelers)&&s.travelers>=1&&s.travelers<=20&&s.rates&&Number.isFinite(s.rates.clp)&&s.rates.clp>0&&Number.isFinite(s.rates.cny)&&s.rates.cny>0&&['USD','CNY','CLP'].includes(s.currency)}
async function push(){if(busy||blocked||!connected||!dirty)return;busy=true;status('正在同步…');const sent=JSON.stringify(state);try{const result=await rpc('trip_write',{room_token:config.room,expected_revision:revision,new_data:JSON.parse(sent)});if(result.conflict){blocked=true;$('#notice').innerHTML='另一人刚更新了看板，你的修改已保留。请先导出备份，再载入云端版本并手动合并。 <button data-action="export">导出本机备份</button> <button data-action="reload-cloud">载入云端版本</button>';status('同步冲突 · 编辑已保留');return}revision=result.revision;dirty=JSON.stringify(state)!==sent;backup();status(dirty?'有修改待同步':'☁ 已同步');}catch(e){status('离线 · 修改已保留');toast(e.message)}finally{busy=false}if(dirty&&!blocked&&connected)setTimeout(push,5000)}
async function pull(force=false){if(busy||(!force&&(dirty||blocked||$('#editor').open)))return;busy=true;const before=JSON.stringify(state);try{const result=await rpc('trip_read',{room_token:config.room});if(result){if(!validState(result.data))throw Error('云端数据格式不正确');if(!force&&JSON.stringify(state)!==before){setTimeout(push,0);return}if(force||result.revision>revision){state=result.data;revision=result.revision;dirty=false;blocked=false;backup();render();$('#notice').textContent=''}status('☁ 已同步')}else if(force){revision=0;dirty=true;}connected=true;}catch(e){status('连接失败 · 本地可用');throw e}finally{busy=false}if(dirty&&connected&&!blocked)push()}
function closeDialogs(){$$('dialog[open]').forEach(d=>d.close())}
document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.filter){filter=b.dataset.filter;render();return}const action=b.dataset.action;if(!action)return;const id=b.closest('[data-id]')?.dataset.id,p=state.plans.find(p=>p.id===id);try{switch(action){case 'settings':openSettings();break;case 'export':download();break;case 'import':$('#import-file').click();break;case 'close':if($('#editor').open&&JSON.stringify(collect())!==JSON.stringify(editing)&&!confirm('放弃尚未保存的编辑？'))return;closeDialogs();break;case 'new':openEditor({id:uid(),title:'Plan '+String.fromCharCode(65+state.plans.length),tag:'待比较',note:'',legs:[],votes:[],revision:0});break;case 'edit':openEditor(p);break;case 'duplicate':if(state.plans.length>=100)throw Error('最多保存100个方案');state.plans.push({...clone(p),id:uid(),title:p.title+' · 副本',votes:[],revision:0});changed();toast('已复制，可以自由调整');break;case 'delete':if(confirm(`删除「${p.title}」？`)){state.plans=state.plans.filter(q=>q.id!==id);changed()}break;case 'favorite':if(!config.name)config.name=prompt('你希望显示的名字？')||'我';p.votes=p.votes.includes(config.name)?p.votes.filter(v=>v!==config.name):[...p.votes,config.name];changed();break;case 'add-leg':{const draft=collect();if(draft.legs.length>=30)throw Error('最多30个航段');draft.legs.push({id:uid(),from:draft.legs.at(-1)?.to||'RDU',to:'SCL',date:draft.legs.at(-1)?.date||'2026-12-20',arrival:'',airline:'',price:0,currency:'USD',stops:0,hours:0,url:'',note:''});$('#leg-forms').innerHTML=draft.legs.map(legForm).join('');break}case 'remove-leg':b.closest('.leg-form').remove();break;case 'rates':$('#rates-form').elements.clp.value=state.rates.clp;$('#rates-form').elements.cny.value=state.rates.cny;$('#rates').showModal();break;case 'disconnect':connected=false;config.url='';config.key='';localStorage.setItem('southbound-config',JSON.stringify(config));history.replaceState(null,'',location.pathname+location.search);status('本地模式 · 已断开');$('#settings').close();toast('已断开云端；本地副本保留');break;case 'share':if(!connected)throw Error('先配置并连接云端，再生成共享链接');{const h=new URLSearchParams({room:config.room,url:config.url,key:config.key});await navigator.clipboard.writeText(location.origin+location.pathname+'#'+h);toast('共享链接已复制，发给对方即可')}break;case 'reload-cloud':if(busy)throw Error('正在同步，请稍后重试');if(!connected)throw Error('请先连接云端');if(confirm('载入云端版本会替换本机看板，未同步修改请先导出备份。继续？')){await pull(true);toast('已载入云端最新版本')}break;}}catch(err){toast(err.message)}});
$('#edit-form').addEventListener('submit',e=>{e.preventDefault();const plan=collect();if(!validPlan(plan)){toast('请检查机场代码、网址及价格等字段');return}plan.updatedBy=config.name;plan.updatedAt=new Date().toISOString();const i=state.plans.findIndex(p=>p.id===plan.id);if(i<0&&state.plans.length>=100){toast('最多100个方案');return}if(i<0)state.plans.push(plan);else state.plans[i]=plan;$('#editor').close();changed();toast('方案已保存')});
$('#sync-form').addEventListener('submit',async e=>{e.preventDefault();const f=e.target,next=Object.fromEntries(new FormData(f));try{const u=new URL(next.url);if(u.protocol!=='https:'||!u.hostname.endsWith('.supabase.co')||u.pathname!=='/')throw Error('请填写 https://项目名.supabase.co 格式的项目 URL');let role='';try{role=JSON.parse(atob(next.key.split('.')[1].replaceAll('-','+').replaceAll('_','/'))).role||''}catch{}if(next.key.startsWith('sb_secret_')||role==='service_role')throw Error('请使用 publishable/anon 公开密钥，不要使用 secret key');if(!/^[A-Za-z0-9_-]{32,128}$/.test(next.room))throw Error('空间密钥须为32–128位字母数字或横线');}catch(err){toast(err.message);return}const button=f.querySelector('[type=submit]');button.disabled=true;const previous={config:clone(config),state:clone(state),revision,dirty,connected};try{connected=false;config={...next,url:next.url.replace(/\/$/,'')};revision=0;await pull(true);localStorage.setItem('southbound-config',JSON.stringify(config));history.replaceState(null,'',location.pathname+location.search);$('#settings').close();toast('已连接，点击「复制共享链接」邀请对方');}catch(err){({config,state,revision,dirty,connected}=previous);render();toast(err.message)}finally{button.disabled=false}});
$('#rates-form').addEventListener('submit',e=>{e.preventDefault();state.rates={clp:Number(e.target.elements.clp.value),cny:Number(e.target.elements.cny.value)};$('#rates').close();changed()});
$('#travelers').addEventListener('change',e=>{const n=Number(e.target.value);if(!Number.isInteger(n)||n<1||n>20){e.target.value=state.travelers;return}state.travelers=n;changed()});$('#display-currency').addEventListener('change',e=>{state.currency=e.target.value;changed()});$('#sort').addEventListener('change',e=>{sort=e.target.value;render()});
$('#import-file').addEventListener('change',async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>1000000)throw Error('文件过大，最多1MB');const incoming=JSON.parse(await file.text());if(!validState(incoming))throw Error('文件格式不正确，请选择本站导出的方案JSON');if(!confirm('导入将替换当前看板，建议先导出备份。继续？'))return;state={plans:incoming.plans,travelers:incoming.travelers,rates:incoming.rates,currency:incoming.currency};changed();toast('已导入方案')}catch(err){toast(err.message)}finally{e.target.value=''}});
// Escape should not silently discard a draft.
$('#editor').addEventListener('cancel',e=>{if(JSON.stringify(collect())!==JSON.stringify(editing)&&!confirm('放弃尚未保存的编辑？'))e.preventDefault()});
window.addEventListener('online',()=>{if(connected)push()});window.addEventListener('beforeunload',e=>{if($('#editor').open&&JSON.stringify(collect())!==JSON.stringify(editing)){e.preventDefault();e.returnValue=''}});
if(!validState(state)){state=defaults();dirty=false;revision=0;toast('本地数据格式不正确，已载入初始方案')}render();backup();if(config.url&&config.key&&config.room){status('连接云端…');if(dirty){connected=true;push()}else pull(true).catch(e=>toast(e.message))}setInterval(()=>{if(connected&&!blocked)pull().catch(()=>status('离线 · 本地可用'))},10000);

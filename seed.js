const leg = (id, from, to, date, price, currency = 'USD', note = '') => ({ id, from, to, date, arrival: '', airline: '待核实', price, currency, stops: 0, hours: 0, url: '', note });
export const initialPlans = [
    { id: 'rdu-budget', title: 'Raleigh 出发 · 圣诞在岛上', tag: '省钱优先', note: '参考查询日期：2026/10/23。美国两端 $1,213 为组合价，暂合并计入去程，返程为 $0 占位。复活节岛 $472 为智利站参考报价；美国站曾显示约 $1,403。所有价格待重新核实，尚未预订。', votes: [], revision: 0, legs: [{ ...leg('a', 'RDU', 'SCL', '2026-12-20', 1213, 'USD', '含 1/5 SJO→RDU；分别购买两张单程票。去程约24h20m，两次中转。'), arrival: '2026-12-21', airline: 'American', stops: 2, hours: 24.33 }, { ...leg('b', 'SCL', 'IPC', '2026-12-22', 472, 'USD', '含12/26回程；智利站CLP报价折合，结算须确认。'), airline: 'LATAM', hours: 5.33 }, { ...leg('c', 'IPC', 'SCL', '2026-12-26', 0, 'USD', '票价已计入上岛往返。'), airline: 'LATAM', hours: 4.67 }, { ...leg('d', 'SCL', 'SJO', '2026-12-28', 561, 'USD', '经利马中转，参考08:40–15:55。'), airline: 'LATAM', stops: 1, hours: 10.25 }, { ...leg('e', 'SJO', 'RDU', '2027-01-05', 0, 'USD', '票价已计入美国两端组合；参考15:37–23:59，经MIA。'), airline: 'American', stops: 1, hours: 7.37 }] },
    { id: 'rdu-comfort', title: 'Raleigh 出发 · 少一点中转', tag: '舒适优先', note: '参考查询日期：2026/10/23。美国两端约$1,655，去程经休斯顿一次中转；报价尚未锁定，行李另核。上岛往返约$472依赖智利站报价。', votes: [], revision: 0, legs: [{ ...leg('f', 'RDU', 'SCL', '2026-12-20', 1655, 'USD', '含1/5回美国；去程16:50出发，次日08:50到。'), airline: 'United', arrival: '2026-12-21', stops: 1, hours: 14 }, { ...leg('g', 'SCL', 'IPC', '2026-12-22', 472, 'USD', '上岛往返合计；当地币种价待确认。'), airline: 'LATAM', hours: 5.33 }, { ...leg('h', 'IPC', 'SCL', '2026-12-26', 0, 'USD', '已含在上岛往返价内。'), airline: 'LATAM', hours: 4.67 }, { ...leg('i', 'SCL', 'SJO', '2026-12-28', 561), airline: 'LATAM', stops: 1, hours: 10.25 }, leg('j', 'SJO', 'RDU', '2027-01-05', 0, 'USD', '美国返程已计入组合价；航司待确认。')] },
    { id: 'bay-budget', title: '湾区出发 · SFO 方案', tag: '湾区备选', note: '参考查询日期：2026/10/23。SFO两端约$1,532，去程两次中转约27h52m；OAK同日两端曾约$2,006。复活节岛报价须在智利站确认。', votes: [], revision: 0, legs: [{ ...leg('k', 'SFO', 'SCL', '2026-12-20', 1532, 'USD', '含1/5 SJO→SFO；两端组合价。'), airline: 'American', arrival: '2026-12-21', stops: 2, hours: 27.87 }, { ...leg('l', 'SCL', 'IPC', '2026-12-22', 472, 'USD', '含12/26返程；CLP地区报价参考。'), airline: 'LATAM', hours: 5.33 }, { ...leg('m', 'IPC', 'SCL', '2026-12-26', 0, 'USD', '已包含于上岛往返。'), airline: 'LATAM', hours: 4.67 }, { ...leg('n', 'SCL', 'SJO', '2026-12-28', 561), airline: 'LATAM', stops: 1, hours: 10.25 }, leg('o', 'SJO', 'SFO', '2027-01-05', 0, 'USD', '已计入两端组合价，返程时间待核实。')] }
];
export const airports = { RDU: 'Raleigh', SFO: '旧金山', OAK: '奥克兰', SCL: '圣地亚哥', IPC: '复活节岛', SJO: '圣何塞' };
export function validPlan(p) { return p && typeof p.id === 'string' && /^[a-zA-Z0-9-]{1,80}$/.test(p.id) && typeof p.title === 'string' && p.title.length > 0 && p.title.length <= 160 && typeof p.note === 'string' && p.note.length <= 10000 && typeof p.tag === 'string' && p.tag.length <= 60 && Array.isArray(p.votes) && p.votes.length <= 20 && p.votes.every((v) => typeof v === 'string' && v.length <= 60) && Array.isArray(p.legs) && p.legs.length <= 30 && p.legs.every((l) => l && typeof l.id === 'string' && typeof l.from === 'string' && l.from.length <= 20 && typeof l.to === 'string' && l.to.length <= 20 && typeof l.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(l.date) && typeof l.arrival === 'string' && (!l.arrival || /^\d{4}-\d{2}-\d{2}$/.test(l.arrival)) && typeof l.airline === 'string' && l.airline.length <= 160 && Number.isFinite(l.price) && l.price >= 0 && l.price <= 1e10 && ['USD', 'CLP', 'CNY'].includes(l.currency) && Number.isFinite(l.hours) && l.hours >= 0 && Number.isInteger(l.stops) && l.stops >= 0 && typeof l.note === 'string' && l.note.length <= 3000 && typeof l.url === 'string' && l.url.length <= 5000 && (!l.url || /^https?:\/\//.test(l.url))); }

// Historical search links; verify current fare before purchasing.
const americanSearch='https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTEyLTIwagcIARIDUkRVcgcIARIDU0NMGh4SCjIwMjctMDEtMDVqBwgBEgNTSk9yBwgBEgNSRFVAAUgBcAGCAQsI____________AZgBAw&hl=en';
const sfoSearch='https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTEyLTIwagcIARIDU0ZPcgcIARIDU0NMGh4SCjIwMjctMDEtMDVqBwgBEgNTSk9yBwgBEgNTRk9AAUgBcAGCAQsI____________AZgBAw&hl=en';
const islandSearch='https://www.latamairlines.com/cl/es/ofertas-vuelos?dataFlight='+encodeURIComponent(JSON.stringify({tripTypeSelected:{value:'RT'},cabinSelected:{label:'Economy',value:'Economy'},passengerSelected:{adultQuantity:1,childrenQuantity:0,infantQuantity:0},originSelected:{id:'SCL_CL_AIRPORT',iata:'SCL',type:'AIRPORT',airportIataCode:'SCL'},destinationSelected:{id:'IPC_CL_AIRPORT',iata:'IPC',type:'AIRPORT',airportIataCode:'IPC'},dateGoSelected:'2026-12-22',dateReturnSelected:'2026-12-26'}));
const middleSearch='https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTEyLTI4agcIARIDU0NMcgcIARIDU0pPQAFIAXABggELCP___________wGYAQI&hl=en';
initialPlans.forEach(p=>p.legs.forEach(l=>{l.url=l.from==='IPC'||l.to==='IPC'?islandSearch:l.from==='SCL'&&l.to==='SJO'?middleSearch:p.id==='bay-budget'?sfoSearch:americanSearch;}));

// User's updated transfer date. Keep the old quote only as context, not a confirmed fare.
initialPlans.forEach(p=>p.legs.forEach(l=>{if(l.from==='SCL'&&l.to==='SJO'){l.date='2026-12-30';l.price=0;l.hours=0;l.stops=0;l.note='12/30票价、时刻与转机待查；此前12/28参考价为USD 561。';l.url='https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTEyLTMwagcIARIDU0NMcgcIARIDU0pPQAFIAXABggELCP___________wGYAQI&hl=en';}}));

function applyVerifiedIslandFare(plans){
 const link='https://www.latamairlines.com/cl/es/ofertas-vuelos?dataFlight='+encodeURIComponent(JSON.stringify({tripTypeSelected:{value:'RT'},cabinSelected:{label:'Economy',value:'Economy'},passengerSelected:{adultQuantity:1,childrenQuantity:0,infantQuantity:0},originSelected:{id:'SCL_CL_AIRPORT',iata:'SCL',type:'AIRPORT',airportIataCode:'SCL'},destinationSelected:{id:'IPC_CL_AIRPORT',iata:'IPC',type:'AIRPORT',airportIataCode:'IPC'},dateGoSelected:'2026-12-22',dateReturnSelected:'2026-12-24'}));
 plans.forEach(p=>{const outbound=p.legs.find(l=>l.from==='SCL'&&l.to==='IPC'&&l.date==='2026-12-22');const inbound=p.legs.find(l=>l.from==='IPC'&&l.to==='SCL'&&(l.date==='2026-12-26'||l.date==='2026-12-24'));if(!outbound||!inbound)return;
 Object.assign(outbound,{price:552244,currency:'CLP',airline:'LATAM Basic',hours:5.33,stops:0,url:link,note:'08:35–11:55，直飞。往返含税合计CLP 552,244/人，2026/10/24官网摘要核实；Basic仅含随身小包。'});
 Object.assign(inbound,{date:'2026-12-24',price:0,currency:'CLP',airline:'LATAM Basic',hours:4.67,stops:0,url:link,note:'14:30–21:10，直飞。价格已计入往返合计。'});
 });
}

applyVerifiedIslandFare(initialPlans);

function applyPlanBScreenshot(plans){
 const p=plans.find(p=>p.id==='rdu-comfort');if(!p)return;
 const out=p.legs.find(l=>l.from==='RDU'&&l.to==='SCL');
 const back=p.legs.find(l=>l.from==='SJO'&&l.to==='RDU');
 const url="https://www.google.com/travel/flights/booking?tfs=CBwQAhphEgoyMDI2LTEyLTIwIiAKA1JEVRIKMjAyNi0xMi0yMBoDSUFIKgJVQTIEMjM0MSIfCgNJQUgSCjIwMjYtMTItMjAaA1NDTCoCVUEyAzg0N2oHCAESA1JEVXIHCAESA1NDTBqDARIKMjAyNy0wMS0wNSIfCgNTSk8SCjIwMjctMDEtMDUaA01JQSoCQUEyAzQwNiIgCgNNSUESCjIwMjctMDEtMDUaA1BITCoCQUEyBDMwMjUiIAoDUEhMEgoyMDI3LTAxLTA1GgNSRFUqAkFBMgQxOTI1agcIARIDU0pPcgcIARIDUkRVQAFIAXABggELCP___________wGYAQM&tfu=CoABQ2pSSU9GRk1kVXRTTWtWNFlVVkJTSGhmWm1kQ1J5MHRMUzB0TFMwdExYQm1ZbXhxT0VGQlFVRkJSM0pqWDI5alJsWk1Va05CRWhOQlFUUXdObnhCUVRNd01qVjhRVUV4T1RJMUdnc0l5TFFJRUFJYUExVlRSRGdjY01pMENBPT0SAggAIgA&hl=en";
 if(out)Object.assign(out,{date:'2026-12-20',arrival:'2026-12-21',airline:'United',price:1378,currency:'USD',stops:1,hours:14,url,note:'16:50–次日08:50；经 IAH（休斯顿）中转。去回合计 USD 1,378/人（用户截图，2026/10/24）。含1件随身行李；首件托运$90。'});
 if(back)Object.assign(back,{date:'2027-01-05',arrival:'2027-01-05',airline:'American',price:0,currency:'USD',stops:2,hours:10.65,url,note:'11:35–23:14；经 MIA（迈阿密）、PHL（费城）中转。票价已包含在去回合计；含1件随身行李，首件托运$55。'});
 p.note='美国两端组合：去程United，回程American，USD 1,378/人。按用户2026/10/24提供的截图更新；实际购买前以结算价格为准。';
}

applyPlanBScreenshot(initialPlans);

function applyPlanBReturnCorrection(plans){
 const p=plans.find(p=>p.id==='rdu-comfort');if(!p)return;
 const url="https://www.google.com/travel/flights/booking?tfs=CBwQAhphEgoyMDI2LTEyLTIwIiAKA1JEVRIKMjAyNi0xMi0yMBoDSUFIKgJVQTIEMjM0MSIfCgNJQUgSCjIwMjYtMTItMjAaA1NDTCoCVUEyAzg0N2oHCAESA1JEVXIHCAESA1NDTBphEgoyMDI3LTAxLTA1Ih8KA1NKTxIKMjAyNy0wMS0wNRoDTUlBKgJBQTIDMzE4IiAKA01JQRIKMjAyNy0wMS0wNRoDUkRVKgJBQTIEMTU2NmoHCAESA1NKT3IHCAESA1JEVUABSAFwAYIBCwj___________8BmAED&tfu=CnRDalJJWkRZMU0wWkVPRlZpWmxGQlNWWjBkR2RDUnkwdExTMHRMWEJtWm0weE55MXVNVUZCUVVGQlIzSmpYM2QzUzBsellYbEJFZ3hCUVRNeE9IeEJRVEUxTmpZYUN3akl0QWdRQWhvRFZWTkVPQnh3eUxRSRICCAAiAwoBMQ&hl=en";
 const out=p.legs.find(l=>l.from==='RDU'&&l.to==='SCL');
 const back=p.legs.find(l=>l.from==='SJO'&&l.to==='RDU');
 if(out){out.url=url;out.price=1378;out.currency='USD';}
 if(back)Object.assign(back,{date:'2027-01-05',arrival:'2027-01-05',airline:'American',price:0,currency:'USD',stops:1,hours:7.3667,url,note:'15:37–23:59；经 MIA（迈阿密）一次中转。票价已包含在去回合计 USD 1,378/人；含1件随身行李，首件托运$55。'});
}

applyPlanBReturnCorrection(initialPlans);

function applyDec30Copa(plans){
 const url='https://www.google.com/travel/flights/booking?tfs=CBwQAhpgEgoyMDI2LTEyLTMwIh8KA1NDTBIKMjAyNi0xMi0zMBoDUFRZKgJDTTIDMTM5Ih8KA1BUWRIKMjAyNi0xMi0zMBoDU0pPKgJDTTIDMTkyagcIARIDU0NMcgcIARIDU0pPQAFIAXABggELCP___________wGYAQI&hl=en';
 plans.forEach(p=>p.legs.forEach(l=>{if(l.from==='SCL'&&l.to==='SJO'&&l.date==='2026-12-30')Object.assign(l,{arrival:'2026-12-30',airline:'Copa Airlines',price:311,currency:'USD',stops:1,hours:10.2333,url,note:'03:48–11:02；PTY（巴拿马城）中转1小时49分。CM139 / CM192。2026/10/24 Google Flights售票列表：Alitrip $311/人；Copa官网 $725/人。含1件随身行李，托运另付；最终价以出票渠道结算为准。'});}));
}

applyDec30Copa(initialPlans);

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

applyUsdAmounts(initialPlans);

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

applyPlanCReverse(initialPlans);

function applyQunarDec30Quote(plans,rates={cny:6.72}){
 plans.forEach(p=>p.legs.forEach(l=>{if(l.from==='SCL'&&l.to==='SJO'&&l.date==='2026-12-30'){
 l.price=Math.round(3000/rates.cny*100)/100;l.currency='USD';l.originalPrice=3000;l.originalCurrency='CNY';
 l.url='https://flight.qunar.com/';
 l.airline='待核实（去哪儿报价）';l.hours=0;l.stops=0;
 l.note='去哪儿约US$446/人（用户2026/10/24提供报价，按历史汇率折算）；该报价的航司、时刻、中转和行李条件尚未提供，待核实。此前Copa 03:48–11:02经PTY，Google Flights曾列Alitrip $311、Copa官网$725；不是已确认的同一票种。';
 }}));
}

applyQunarDec30Quote(initialPlans);

function applyQunarSimplePrice(plans){plans.forEach(p=>p.legs.forEach(l=>{if(l.from==='SCL'&&l.to==='SJO'&&l.date==='2026-12-30')Object.assign(l,{airline:'',arrival:'',note:'',hours:0,stops:0});}));}

applyQunarSimplePrice(initialPlans);

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

simplifyTripNotes(initialPlans);

function removePlanC(plans){for(let i=plans.length-1;i>=0;i--){if(plans[i].id==='bay-budget')plans.splice(i,1);}}

removePlanC(initialPlans);

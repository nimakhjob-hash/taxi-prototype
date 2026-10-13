(function(){
var KEY='mrs_db_v2',CKEY='nationalCeremonies_v1',KART='03-barrasi-darkhast.html';
var STAGES=[
{key:'review',label:'بررسی درخواست',page:KART,desc:'تأیید یا رد درخواست ثبت‌شده‌ی راننده'},
{key:'attendance',label:'بررسی حضور',page:'04-barresi-hozor-ranande.html',desc:'ثبت حضور یا غیبت راننده در مراسم'},
{key:'finance_review',label:'بررسی مالی',page:'06-barresi-parvande-mali.html',desc:'بررسی حساب و مبلغ و ثبت دستور مالی'},
{key:'finance_approve',label:'تأیید مالی و تسویه',page:'05-tasvie-hesab-ranande.html',desc:'تأیید نهایی و تسویه‌حساب با راننده'}];
var FLAG='<svg class="flag" viewBox="0 0 60 42" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="14" fill="#239f40"/><rect y="14" width="60" height="14" fill="#fff"/><rect y="28" width="60" height="14" fill="#da0000"/><g fill="none" stroke="#da0000" stroke-width="1.7" stroke-linecap="round"><path d="M24 15.5q-4.5 5.5 0 11"/><path d="M36 15.5q4.5 5.5 0 11"/><path d="M30 14.5v12"/></g><circle cx="30" cy="13.6" r="1.5" fill="#da0000"/></svg>',MAP='<svg class="map" viewBox="0 0 370 335" xmlns="http://www.w3.org/2000/svg"><path d="M95.2 33.0L80.2 24.2L67.2 19.8L48.5 22.0L29.9 19.8L18.7 4.4L9.3 37.4L7.5 52.8L18.7 60.5L28.0 79.2L39.2 92.4L44.8 107.8L33.6 121.0L42.9 138.6L48.5 154.0L67.2 162.8L74.6 178.2L80.2 189.2L72.8 195.8L82.1 209.0L95.2 217.8L111.9 215.6L121.3 228.8L130.6 242.0L143.7 264.0L164.2 275.0L190.3 290.4L207.1 293.7L233.2 279.4L250.0 305.8L261.2 312.4L283.6 319.0L313.4 321.2L332.1 323.4L334.0 301.4L347.0 294.8L358.2 283.8L363.8 279.4L354.5 257.4L339.6 244.2L334.0 231.0L319.0 220.0L320.9 198.0L335.8 187.0L319.0 167.2L315.3 140.8L319.0 121.0L324.6 94.6L324.6 74.8L309.7 72.6L291.1 57.2L272.4 50.6L253.7 37.4L235.1 39.6L216.4 41.8L203.4 52.8L190.3 57.2L188.4 66.0L169.8 68.2L149.3 70.4L130.6 66.0L115.7 55.0L106.3 52.8Z"/><line x1="141.8" y1="92.4" x2="46.6" y2="39.6"/><line x1="141.8" y1="92.4" x2="294.8" y2="79.2"/><line x1="141.8" y1="92.4" x2="147.4" y2="159.5"/><line x1="141.8" y1="92.4" x2="162.3" y2="226.6"/><line x1="141.8" y1="92.4" x2="91.4" y2="189.2"/><circle cx="46.6" cy="39.6" r="5"/><circle cx="294.8" cy="79.2" r="5"/><circle cx="147.4" cy="159.5" r="5"/><circle cx="162.3" cy="226.6" r="5"/><circle cx="91.4" cy="189.2" r="5"/><circle class="t" cx="141.8" cy="92.4" r="8"/></svg>';
function stage(k){return STAGES.filter(function(s){return s.key===k})[0]}
function fd(s){return String(s).replace(/\d/g,function(x){return '۰۱۲۳۴۵۶۷۸۹'[x]})}
function fa(n){return Number(n||0).toLocaleString('fa-IR')}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function routeLabel(r){return r.station+' ← '+r.destination}
function seed(){
var dr=[['0012345678','علی','رضایی','0912***1234','۱۲ ب ۳۴۵ ایران ۶۸','۱۳۹۸','سواری',8,3],['0023456789','مریم','احمدی','0912***5678','۴۵ ج ۶۷۸ ایران ۲۲','۱۴۰۰','سواری',5,2],['0034567890','رضا','کریمی','0935***9012','۷۸ د ۹۰۱ ایران ۱۱','۱۳۹۷','ون',11,5],['0045678901','سارا','موسوی','0990***3456','۲۳ ن ۴۵۶ ایران ۴۴','۱۴۰۱','سواری',3,1]].map(function(a){return{nationalId:a[0],first:a[1],last:a[2],mobile:a[3],plate:a[4],year:a[5],type:a[6],years:a[7],attend:a[8]}});
function rt(a,b,m,t,c){return{station:a,destination:b,duration:String(m),taxiCount:String(t),cost:String(c),limits:[],gender:'بدون فیلتر',taxiType:'هر دو',system:'تمام سیستم‌ها'}}
function ce(id,title,s,e,tot,routes){return{id:id,startDate:s,endDate:e,title:title,restrictions:[],gender:'بدون فیلتر',taxiType:'هر دو',system:'همه',totalDrivers:String(tot),routes:routes,createdAt:new Date().toISOString()}}
var cs=[ce('c1','راهپیمایی ۲۲ بهمن','1405/11/22','1405/11/22',120,[rt('میدان آزادی','میدان انقلاب',30,20,4000000),rt('میدان امام حسین','میدان بهارستان',25,15,3500000),rt('میدان ونک','میدان تجریش',35,12,3000000)]),ce('c2','روز جهانی قدس','1405/12/14','1405/12/14',80,[rt('میدان آزادی','میدان انقلاب',30,18,3000000),rt('میدان امام حسین','میدان بهارستان',25,12,2800000)]),ce('c3','مراسم نیمه شعبان','1405/11/04','1405/11/04',40,[rt('میدان ولیعصر','میدان تجریش',40,10,2500000)])];
var banks=['بانک ملی','بانک ملت','بانک تجارت','بانک صادرات'];
function h(k,n){return{stage:k,label:stage(k).label,ok:true,note:n||'',at:Date.now()}}
function rq(id,di,ci,ri,st,hist){var c=cs[ci],r=c.routes[ri],d=dr[di];return{id:id,driverId:d.nationalId,ceremonyId:c.id,ceremonyTitle:c.title,routeLabel:routeLabel(r),bank:banks[di],account:'۱۲۳۴۵۶۷۸۹'+fd(di),sheba:'IR12000000000000000000000'+fd(di),amount:Number(r.cost),stage:st,history:hist||[],createdAt:Date.now()}}
return{cs:cs,db:{drivers:dr,requests:[rq('R1004',3,1,0,'finance_approve',[h('review'),h('attendance'),h('finance_review','مشخصات حساب بانکی بررسی شد.')]),rq('R1003',2,0,1,'finance_review',[h('review','سوابق راننده مطلوب است.'),h('attendance')]),rq('R1002',1,1,1,'attendance',[h('review')]),rq('R1001',0,0,0,'review')]}}}
function save(db){ls(KEY,JSON.stringify(db))}
function load(){var s=null;try{s=JSON.parse(ls(KEY))}catch(e){}if(!s||!s.requests){s=seed().db;save(s)}return s}
function cers(){try{var a=JSON.parse(ls(CKEY));return Array.isArray(a)?a:[]}catch(e){return[]}}
if(ls(CKEY)===null)ls(CKEY,JSON.stringify(seed().cs));
function find(arr,k,v){return arr.filter(function(x){return x[k]===v})[0]}
function decide(id,ok,note,rejLabel){var db=load(),r=find(db.requests,'id',id),st=r&&stage(r.stage);if(!st)return null;
r.history.push({stage:st.key,label:st.label,ok:ok,note:note||'',at:Date.now()});
if(ok){var i=STAGES.indexOf(st);r.stage=i+1<STAGES.length?STAGES[i+1].key:'done';if(r.stage==='done')r.final={label:'تسویه‌شده',reason:''}}
else{r.stage='rejected';r.final={label:rejLabel||('عدم تأیید در مرحله «'+st.label+'»'),reason:note||''}}
save(db);return r}
function addRequest(o){var db=load(),c=find(cers(),'id',o.ceremonyId),r=c.routes[o.routeIdx],n=db.requests.reduce(function(m,x){return Math.max(m,parseInt(x.id.slice(1),10)||0)},1000)+1;
var q={id:'R'+n,driverId:o.driverId,ceremonyId:c.id,ceremonyTitle:c.title,routeLabel:routeLabel(r),bank:o.bank,account:o.account,sheba:o.sheba,amount:Number(r.cost)||0,stage:'review',history:[],createdAt:Date.now()};
db.requests.unshift(q);save(db);return q}
function toast(t){var e=document.getElementById('mrs-toast');if(!e){e=document.createElement('div');e.id='mrs-toast';document.body.appendChild(e)}e.textContent=t;e.style.display='block';clearTimeout(e._t);e._t=setTimeout(function(){e.style.display='none'},3500)}
function flash(t){try{sessionStorage.setItem('mrs_flash',t)}catch(e){}}
function param(k){return new URLSearchParams(location.search).get(k)}
function requireCase(sk){var id=param('id'),r=id&&find(load().requests,'id',id);
if(!r||r.stage!==sk){flash(r?'این پرونده در این مرحله نیست.':'پرونده‌ای انتخاب نشده است.');location.replace(KART);return null}return r}
function notes(r){var a=r.history.filter(function(x){return x.note}).map(function(x){return x.label+': '+x.note});return a.length?a.join('\n'):'توضیحی ثبت نشده است.'}
function addBack(){var a=document.querySelector('.actions');if(!a)return;var b=document.createElement('button');b.type='button';b.className='secondary';b.textContent='بازگشت به کارتابل';b.onclick=function(){location.href=KART};a.appendChild(b)}
function fill(map){for(var id in map){var e=document.getElementById(id);if(e){e.defaultValue=map[id];e.value=map[id]}}}
function chrome(){var p=location.pathname.split('/').pop()||'index.html',flow=STAGES.some(function(s){return s.page===p});
document.querySelectorAll('header').forEach(function(hd){
if(!hd.querySelector('.eyebrow')){var e=document.createElement('div');e.className='eyebrow';e.textContent='پروتوتایپ تعاملی · نسخه نمایشی';hd.insertBefore(e,hd.firstChild)}
var d=document.createElement('div');d.className='mrs-deco';d.innerHTML=FLAG+MAP;hd.appendChild(d)});
var n=document.createElement('nav');n.className='mrs-nav';
n.innerHTML=[['index.html','صفحه اصلی'],['01-taarif-marasem.html','۱. تعریف مراسم'],['02-takhssis-ranande.html','۲. تخصیص راننده'],[KART,'۳. کارتابل']].map(function(i){return '<a href="'+i[0]+'"'+(p===i[0]||(i[0]===KART&&flow)?' class="on"':'')+'>'+i[1]+'</a>'}).join('')+'<button type="button">بازنشانی داده‌های نمونه</button>';
n.querySelector('button').onclick=function(){if(confirm('همه‌ی داده‌ها (مراسم‌ها و پرونده‌ها) به نمونه‌ی اولیه برگردد؟ اطلاعات ثبت‌شده توسط شما پاک می‌شود.')){var s=seed();save(s.db);ls(CKEY,JSON.stringify(s.cs));location.href=KART}};
document.body.insertBefore(n,document.body.firstChild);
var f;try{f=sessionStorage.getItem('mrs_flash');sessionStorage.removeItem('mrs_flash')}catch(e){}if(f)toast(f)}
document.addEventListener('DOMContentLoaded',chrome);
window.MRS={KART:KART,STAGES:STAGES,stage:stage,fd:fd,fa:fa,esc:esc,load:load,save:save,cers:cers,routeLabel:routeLabel,decide:decide,addRequest:addRequest,toast:toast,flash:flash,param:param,requireCase:requireCase,notes:notes,addBack:addBack,fill:fill,
driver:function(id){return find(load().drivers,'nationalId',id)},ceremony:function(id){return find(cers(),'id',id)},
isOpen:function(r){return !!stage(r.stage)},summary:function(r){return r.stage==='done'?'پرونده تسویه شد.':r.final.label+(r.final.reason?' — '+r.final.reason:'')}};
})();

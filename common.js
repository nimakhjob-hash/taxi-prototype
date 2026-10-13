(function(){
var KEY='mrs_db_v1',KART='03-barrasi-darkhast.html';
var STAGES=[
{key:'review',label:'بررسی درخواست',page:KART},
{key:'attendance',label:'بررسی حضور',page:'barresi-hozor-ranande.html'},
{key:'finance_review',label:'بررسی مالی',page:'barresi-parvande-mali.html'},
{key:'finance_approve',label:'تأیید مالی و تسویه',page:'tasvie-hesab-ranande.html'}];
function stage(k){return STAGES.filter(function(s){return s.key===k})[0]}
function fd(s){return String(s).replace(/\d/g,function(x){return '۰۱۲۳۴۵۶۷۸۹'[x]})}
function fa(n){return Number(n||0).toLocaleString('fa-IR')}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function seed(){
var dr=[['0012345678','علی','رضایی','0912***1234','۱۲ ب ۳۴۵ ایران ۶۸','۱۳۹۸','سواری',8,3],['0023456789','مریم','احمدی','0912***5678','۴۵ ج ۶۷۸ ایران ۲۲','۱۴۰۰','سواری',5,2],['0034567890','رضا','کریمی','0935***9012','۷۸ د ۹۰۱ ایران ۱۱','۱۳۹۷','ون',11,5],['0045678901','سارا','موسوی','0990***3456','۲۳ ن ۴۵۶ ایران ۴۴','۱۴۰۱','سواری',3,1]].map(function(a){return{nationalId:a[0],first:a[1],last:a[2],mobile:a[3],plate:a[4],year:a[5],type:a[6],years:a[7],attend:a[8]}});
var R1=[{from:'میدان آزادی',to:'میدان انقلاب',min:30,taxis:20,cost:4000000},{from:'میدان امام حسین',to:'میدان بهارستان',min:25,taxis:15,cost:3500000}];
var cs=[{id:'c1',title:'راهپیمایی ۲۲ بهمن',start:'2027-02-11',end:'2027-02-11',total:120,active:true,routes:R1},{id:'c2',title:'روز جهانی قدس',start:'2027-03-05',end:'2027-03-05',total:80,active:true,routes:R1},{id:'c3',title:'مراسم نیمه شعبان',start:'2027-01-24',end:'2027-01-24',total:40,active:true,routes:[{from:'میدان ولیعصر',to:'میدان تجریش',min:40,taxis:10,cost:2500000}]}];
var banks=['بانک ملی','بانک ملت','بانک تجارت','بانک صادرات'];
function h(k,n){return{stage:k,label:stage(k).label,ok:true,note:n||'',at:Date.now()}}
function rq(id,di,ci,ri,st,hist){var c=cs[ci],r=c.routes[ri],d=dr[di];return{id:id,driverId:d.nationalId,ceremonyId:c.id,ceremonyTitle:c.title,routeLabel:r.from+' ← '+r.to,bank:banks[di],account:'۱۲۳۴۵۶۷۸۹'+fd(di),sheba:'IR12000000000000000000000'+fd(di),amount:r.cost,stage:st,history:hist||[],createdAt:Date.now()}}
return{drivers:dr,ceremonies:cs,requests:[rq('R1004',3,1,0,'finance_approve',[h('review'),h('attendance'),h('finance_review','مشخصات حساب بانکی بررسی شد.')]),rq('R1003',2,0,1,'finance_review',[h('review','سوابق راننده مطلوب است.'),h('attendance')]),rq('R1002',1,1,1,'attendance',[h('review')]),rq('R1001',0,0,0,'review')]}}
function save(db){try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){}}
function load(){var s=null;try{s=JSON.parse(localStorage.getItem(KEY))}catch(e){}if(!s||!s.requests){s=seed();save(s)}return s}
function find(arr,k,v){return arr.filter(function(x){return x[k]===v})[0]}
function decide(id,ok,note,rejLabel){var db=load(),r=find(db.requests,'id',id),st=r&&stage(r.stage);if(!st)return null;
r.history.push({stage:st.key,label:st.label,ok:ok,note:note||'',at:Date.now()});
if(ok){var i=STAGES.indexOf(st);r.stage=i+1<STAGES.length?STAGES[i+1].key:'done';if(r.stage==='done')r.final={label:'تسویه‌شده',reason:''}}
else{r.stage='rejected';r.final={label:rejLabel||('عدم تأیید در مرحله «'+st.label+'»'),reason:note||''}}
save(db);return r}
function addRequest(o){var db=load(),c=find(db.ceremonies,'id',o.ceremonyId),r=c.routes[o.routeIdx],n=db.requests.reduce(function(m,x){return Math.max(m,parseInt(x.id.slice(1),10)||0)},1000)+1;
var q={id:'R'+n,driverId:o.driverId,ceremonyId:c.id,ceremonyTitle:c.title,routeLabel:r.from+' ← '+r.to,bank:o.bank,account:o.account,sheba:o.sheba,amount:r.cost,stage:'review',history:[],createdAt:Date.now()};
db.requests.unshift(q);save(db);return q}
function toast(t){var e=document.getElementById('mrs-toast');if(!e){e=document.createElement('div');e.id='mrs-toast';document.body.appendChild(e)}e.textContent=t;e.style.display='block';clearTimeout(e._t);e._t=setTimeout(function(){e.style.display='none'},3500)}
function flash(t){try{sessionStorage.setItem('mrs_flash',t)}catch(e){}}
function param(k){return new URLSearchParams(location.search).get(k)}
function requireCase(sk){var id=param('id'),r=id&&find(load().requests,'id',id);
if(!r||r.stage!==sk){flash(r?'این پرونده در این مرحله نیست.':'پرونده‌ای انتخاب نشده است.');location.replace(KART);return null}return r}
function notes(r){var a=r.history.filter(function(x){return x.note}).map(function(x){return x.label+': '+x.note});return a.length?a.join('\n'):'توضیحی ثبت نشده است.'}
function addBack(){var a=document.querySelector('.actions');if(!a)return;var b=document.createElement('button');b.type='button';b.className='secondary';b.textContent='بازگشت به کارتابل';b.onclick=function(){location.href=KART};a.appendChild(b)}
function fill(map){for(var id in map){var e=document.getElementById(id);if(e){e.defaultValue=map[id];e.value=map[id]}}}
function nav(){var p=location.pathname.split('/').pop()||'index.html',flow=STAGES.some(function(s){return s.page===p});
var st=document.createElement('style');st.textContent='.mrs-nav{display:flex;gap:6px;align-items:center;flex-wrap:wrap;background:#fff;border-bottom:1px solid #dce4ee;padding:8px 5vw;font:13px Tahoma,sans-serif;direction:rtl}.mrs-nav a{padding:8px 12px;border-radius:8px;color:#243247;text-decoration:none}.mrs-nav a.on{background:#eaf1fb;color:#285ea8;font-weight:bold}.mrs-nav button{margin-right:auto;border:1px solid #dce4ee;background:#fff;border-radius:8px;padding:7px 11px;font:inherit;cursor:pointer;color:#68778b}#mrs-toast{position:fixed;bottom:22px;left:22px;max-width:80vw;background:#183153;color:#fff;padding:13px 18px;border-radius:10px;box-shadow:0 8px 28px #0002;display:none;z-index:9;font:13px/1.8 Tahoma,sans-serif;direction:rtl}';
document.head.appendChild(st);
var n=document.createElement('nav');n.className='mrs-nav';
n.innerHTML=[['index.html','صفحه اصلی'],['01-taarif-marasem.html','۱. تعریف مراسم'],['02-takhssis-ranande.html','۲. تخصیص راننده'],[KART,'۳. کارتابل']].map(function(i){return '<a href="'+i[0]+'"'+(p===i[0]||(i[0]===KART&&flow)?' class="on"':'')+'>'+i[1]+'</a>'}).join('')+'<button type="button">بازنشانی داده‌های نمونه</button>';
n.querySelector('button').onclick=function(){if(confirm('داده‌های نمونه بازنشانی شود؟ اطلاعات ثبت‌شده توسط شما پاک می‌شود.')){save(seed());location.href=KART}};
document.body.insertBefore(n,document.body.firstChild);
var f;try{f=sessionStorage.getItem('mrs_flash');sessionStorage.removeItem('mrs_flash')}catch(e){}if(f)toast(f)}
document.addEventListener('DOMContentLoaded',nav);
window.MRS={KART:KART,STAGES:STAGES,stage:stage,fd:fd,fa:fa,esc:esc,load:load,save:save,decide:decide,addRequest:addRequest,toast:toast,flash:flash,param:param,requireCase:requireCase,notes:notes,addBack:addBack,fill:fill,
driver:function(id){return find(load().drivers,'nationalId',id)},ceremony:function(id){return find(load().ceremonies,'id',id)},
isOpen:function(r){return !!stage(r.stage)},summary:function(r){return r.stage==='done'?'پرونده تسویه شد.':r.final.label+(r.final.reason?' — '+r.final.reason:'')}};
})();

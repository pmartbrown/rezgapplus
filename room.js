(function(){
 // document tabs + search
 var rows=[].slice.call(document.querySelectorAll('#docrows tr'));
 var tabs=[].slice.call(document.querySelectorAll('[data-tab]'));
 var q=document.getElementById('docsearch'),cur='all';
 function apply(){var t=(q&&q.value||'').toLowerCase(),n=0;
  rows.forEach(function(r){var ok=(cur==='all'||r.dataset.cat===cur)&&r.textContent.toLowerCase().indexOf(t)>-1;r.hidden=!ok;if(ok)n++;});
  var e=document.getElementById('docempty');if(e)e.hidden=n>0;}
 // default to Offering (no-JS fallback: HTML shows All)
 function pick(b,focus){cur=b.dataset.tab;tabs.forEach(function(x){var on=x===b;x.setAttribute('aria-selected',on?'true':'false');x.tabIndex=on?0:-1;});apply();if(focus)b.focus();}
 tabs.forEach(function(b,i){b.setAttribute('aria-controls','docrows');
  b.addEventListener('click',function(){pick(b);});
  b.addEventListener('keydown',function(e){var j=null,n=tabs.length;
   if(e.key==='ArrowRight'||e.key==='ArrowDown')j=(i+1)%n;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')j=(i-1+n)%n;else if(e.key==='Home')j=0;else if(e.key==='End')j=n-1;
   if(j!==null){e.preventDefault();pick(tabs[j],true);}});});
 var def=tabs.filter(function(b){return b.dataset.tab==='Offering';})[0]||tabs[0];
 if(def)pick(def);
 if(q)q.addEventListener('input',apply);
 // locked documents dialog
 var d=document.getElementById('locked');
 document.addEventListener('click',function(ev){var b=ev.target.closest('[data-doc]');if(b&&d){document.getElementById('locked-doc').innerHTML='<b></b>';document.querySelector('#locked-doc b').textContent=b.dataset.doc;d.showModal();}
  if(ev.target.closest('[data-close]')&&d)d.close();});
 if(d)d.addEventListener('click',function(ev){if(ev.target===d)d.close();});
 // active section highlight
 var links=[].slice.call(document.querySelectorAll('a[data-sec]'));
 if('IntersectionObserver' in window&&document.getElementById('overview')){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.toggle('on',l.dataset.sec===e.target.id);});}});},{rootMargin:'-30% 0px -60% 0px'});
  ['overview','structure','deal','documents','letters','contact'].forEach(function(id){var el=document.getElementById(id);if(el)io.observe(el);});}
 // sign-in preview
 var si=document.getElementById('signin');
 if(si)si.addEventListener('submit',function(e){e.preventDefault();document.getElementById('si-msg').hidden=false;});
 // request access -> mailto (same pattern as pineconegp.com/investor-access)
 var f=document.getElementById('access-form');
 if(f)f.addEventListener('submit',function(e){e.preventDefault();if(!f.reportValidity())return;
  var b='Name: '+f.name.value+'\nEmail: '+f.email.value+'\nPhone: '+(f.phone.value||'-')+'\n\nHow we know each other:\n'+f.relationship.value+'\n\n(Rez Gap Plus investor room request)';
  window.location.href='mailto:Admin@PineconeGP.com?subject='+encodeURIComponent('Investor room access request: '+f.name.value)+'&body='+encodeURIComponent(b);
  document.getElementById('sent').hidden=false;});
})();
(function(){var k='rgp_notice_v1',d=30*864e5,g=document.getElementById('entry');if(!g)return;
function rd(){var v=null;try{v=localStorage.getItem(k)}catch(e){}if(!v){try{v=sessionStorage.getItem(k)}catch(e){}}if(!v){var m=document.cookie.match(new RegExp('(?:^|; )'+k+'=([^;]*)'));if(m)v=m[1]}return v&&(Date.now()-Number(v)<d)}
function wr(){var v=String(Date.now());try{localStorage.setItem(k,v)}catch(e){}try{sessionStorage.setItem(k,v)}catch(e){}try{document.cookie=k+'='+v+';path=/;max-age='+(d/1000)+';SameSite=Lax;Secure'}catch(e){}}
if(rd())return;g.hidden=false;document.documentElement.style.overflow='hidden';var b=document.getElementById('entry-ok');try{b.focus({preventScroll:true})}catch(e){}
b.onclick=function(){wr();g.hidden=true;document.documentElement.style.overflow=''};})();

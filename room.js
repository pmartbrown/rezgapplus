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
(function(){
 // Contact investor relations form (dialog). Delivery: POST JSON to data-endpoint when set; otherwise prefilled mailto.
 var dlg=document.getElementById('ir-dialog'),open=document.getElementById('ir-open'),f=document.getElementById('ir-form');
 if(!dlg||!open||!f)return;
 var st=document.getElementById('ir-status'),send=document.getElementById('ir-send');
 var to=f.getAttribute('data-to')||'admin@pineconegp.com';
 var EM=/^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[A-Za-z]{2,}$/;
 function say(msg,kind){st.className='irmsg '+(kind||'');st.innerHTML=msg;st.hidden=false;}
 function err(id,on){var i=document.getElementById(id),e=document.getElementById(id+'-e');i.setAttribute('aria-invalid',on?'true':'false');if(e)e.hidden=!on;return on;}
 function check(){var bad=[],n=f.name.value.trim(),m=f.email.value.trim(),p=f.phone.value.trim();
  if(err('ir-name',!n))bad.push('ir-name');
  if(err('ir-email',!EM.test(m)))bad.push('ir-email');
  if(err('ir-phone',!!p&&!/^[0-9+().\-\s]{7,40}$/.test(p)))bad.push('ir-phone');
  return bad;}
 function mailtoHref(){var b='Name: '+f.name.value.trim()+'\nEmail: '+f.email.value.trim()+'\nPhone: '+(f.phone.value.trim()||'-')+'\n\nWhat I would like to discuss:\n'+(f.message.value.trim()||'-')+'\n\n(Sent from the Rez Gap Plus investor room contact form)';
  return 'mailto:'+to+'?subject='+encodeURIComponent('Investor relations: '+f.name.value.trim())+'&body='+encodeURIComponent(b);}
 var last=null;
 open.addEventListener('click',function(){last=document.activeElement;st.hidden=true;dlg.showModal();setTimeout(function(){f.name.focus();},0);});
 function close(){dlg.close();}
 dlg.addEventListener('close',function(){if(last&&last.focus)last.focus();});
 [].forEach.call(dlg.querySelectorAll('[data-irclose]'),function(b){b.addEventListener('click',close);});
 dlg.addEventListener('click',function(e){if(e.target===dlg)close();});
 f.addEventListener('submit',function(e){e.preventDefault();
  var bad=check();if(bad.length){document.getElementById(bad[0]).focus();say('Please fix the highlighted field'+(bad.length>1?'s':'')+'.','bad');return;}
  var ep=f.getAttribute('data-endpoint')||'';
  if(f.company.value){f.reset();say('Thank you. Your note was sent.','ok');return;} // honeypot: bots see success, nothing is sent
  if(!ep){window.location.href=mailtoHref();
   say('Your email app should open with your note filled in. Press send there to finish. If nothing opened, email <a class="ul" href="mailto:'+to+'">'+to+'</a>.','ok');return;}
  send.disabled=true;send.textContent='Sending…';
  fetch(ep,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:f.name.value.trim(),email:f.email.value.trim(),phone:f.phone.value.trim(),message:f.message.value.trim(),company:f.company.value,page:location.pathname})})
   .then(function(r){if(!r.ok)throw new Error(r.status);return r;})
   .then(function(){f.reset();say('Thank you. Your note was sent to investor relations. We will reply by email.','ok');})
   .catch(function(){var a=document.createElement('a');a.href=mailtoHref();
    say('Sorry, your note could not be sent just now. <a class="ul" id="ir-fb" href="#">Send it by email instead</a> or write to <a class="ul" href="mailto:'+to+'">'+to+'</a>.','bad');
    document.getElementById('ir-fb').href=a.href;})
   .then(function(){send.disabled=false;send.textContent='Send';});
 });
})();

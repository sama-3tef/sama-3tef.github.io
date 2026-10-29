(function(){
 var d=document,root=d.documentElement,$=function(s){return d.querySelector(s)},raf=requestAnimationFrame;
 function still(){return root.dataset.motion==='off'}
 /* ---- Theme (animated circular reveal where supported) ---- */
 var tb=$('#theme'),meta=$('meta[name=theme-color]');
 function sync(){var dark=root.dataset.theme==='dark';tb.setAttribute('aria-pressed',dark);if(meta)meta.content=dark?'#241A2B':'#FFF8F5'}
 sync();
 tb.addEventListener('click',function(){
  var t=root.dataset.theme==='dark'?'light':'dark';
  function apply(){root.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}sync()}
  if(d.startViewTransition&&!still()){
   var r=tb.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,rad=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
   d.startViewTransition(apply).ready.then(function(){root.animate({clipPath:['circle(0px at '+x+'px '+y+'px)','circle('+rad+'px at '+x+'px '+y+'px)']},{duration:700,easing:'ease-in-out',pseudoElement:'::view-transition-new(root)'})}).catch(function(){})
  }else apply()});
 /* ---- Mobile menu ---- */
 var b=$('#burger'),m=$('#menu');
 function close(){m.classList.remove('open');b.setAttribute('aria-expanded','false')}
 b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
 m.addEventListener('click',function(e){if(e.target.tagName==='A')close()});
 d.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
 /* ---- Progress bar + back to top (one passive, rAF-throttled listener) ---- */
 var bar=$('#bar'),top=$('#top-btn'),tick=false;
 function upd(){var h=root.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?scrollY/h:0)+')';top.hidden=scrollY<600;tick=false}
 bar.style.width='100%';bar.style.transformOrigin='0 50%';
 addEventListener('scroll',function(){if(!tick){tick=true;raf(upd)}},{passive:true});upd();
 top.addEventListener('click',function(){scrollTo({top:0,behavior:still()?'auto':'smooth'})});
 /* ---- Reveal on scroll + pause off-screen animations ---- */
 var els=d.querySelectorAll('.reveal');
 if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  els.forEach(function(el){io.observe(el)});
  var po=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('off',!e.isIntersecting)})},{rootMargin:'120px'});
  d.querySelectorAll('.hero,.ribbon,#about,#moments,#football,#connect,.footer').forEach(function(el){po.observe(el)});
 }else els.forEach(function(el){el.classList.add('in')});
 /* ---- Split name into letters ---- */
 var n=0;
 d.querySelectorAll('[data-split]').forEach(function(el){
  var t=el.textContent;el.textContent='';
  t.split('').forEach(function(c){var s=d.createElement('span');
   if(c===' '){s.className='sp'}else{s.className='ltr';s.textContent=c;s.style.setProperty('--i',n++)}
   el.appendChild(s)})});
 /* ---- Petals ---- */
 var box=$('#petals');
 function petals(){if(box.children.length)return;var k=innerWidth<700?7:11;
  for(var i=0;i<k;i++){var p=d.createElement('i');p.className='petal';
   p.style.left=Math.random()*100+'%';p.style.animationDuration=(15+Math.random()*12)+'s';p.style.animationDelay=(-Math.random()*20)+'s';
   p.style.setProperty('--dx',(Math.random()*160-80)+'px');p.style.setProperty('--rot',(360+Math.random()*360)+'deg');box.appendChild(p)}}
 if(!still())petals();
 /* ---- Click petal burst ---- */
 d.addEventListener('click',function(e){if(still()||!e.target.closest('.btn,.social,.club,.icon-btn,.switch,.ico'))return;
  for(var k=0;k<8;k++){var s=d.createElement('i');s.className='burst';s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';
   var a=Math.random()*6.28,r=40+Math.random()*50;s.style.setProperty('--bx',Math.cos(a)*r+'px');s.style.setProperty('--by',Math.sin(a)*r+'px');
   d.body.appendChild(s);setTimeout(function(x){x.remove()},900,s)}});
 /* ---- Photo glow follows pointer (rAF-throttled) ---- */
 d.querySelectorAll('.fx').forEach(function(el){var q=0,ex,ey;
  el.addEventListener('pointermove',function(e){ex=e.clientX;ey=e.clientY;if(q)return;q=1;raf(function(){var r=el.getBoundingClientRect();
   el.style.setProperty('--mx',(ex-r.left)+'px');el.style.setProperty('--my',(ey-r.top)+'px');q=0})},{passive:true})});
 /* ---- Cursor petal trail (desktop, capped) ---- */
 if(matchMedia('(hover:hover) and (pointer:fine)').matches){var last=0,live=0;
  addEventListener('pointermove',function(e){if(still()||live>10)return;var now=performance.now();if(now-last<100)return;last=now;
   var s=d.createElement('i');s.className='trail';s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';
   s.style.setProperty('--bx',(Math.random()*40-20)+'px');s.style.setProperty('--by',(20+Math.random()*30)+'px');
   d.body.appendChild(s);live++;setTimeout(function(){s.remove();live--},1100)},{passive:true})}
 /* ---- Effects toggle (user choice, saved) ---- */
 var mb=$('#motion');
 function mlabel(){var off=still();mb.textContent=off?'✦ Effects: Off':'✦ Effects: On';mb.setAttribute('aria-pressed',!off)}
 mlabel();
 mb.addEventListener('click',function(){var off=!still();if(off)root.dataset.motion='off';else delete root.dataset.motion;
  try{localStorage.setItem('motion',off?'off':'on')}catch(e){}if(!off)petals();mlabel()});
 $('#year').textContent=new Date().getFullYear();
})();

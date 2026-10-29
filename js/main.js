(function(){
 var d=document,root=d.documentElement,$=function(s){return d.querySelector(s)};
 var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 // Theme
 var tb=$('#theme'),meta=$('meta[name=theme-color]');
 function sync(){var dark=root.dataset.theme==='dark';tb.setAttribute('aria-pressed',dark);if(meta)meta.content=dark?'#241A2B':'#FFF8F5'}
 sync();
 tb.addEventListener('click',function(){
  var t=root.dataset.theme==='dark'?'light':'dark';
  function apply(){root.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}sync()}
  if(d.startViewTransition&&!reduce){
   var r=tb.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,rad=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
   d.startViewTransition(apply).ready.then(function(){root.animate({clipPath:['circle(0px at '+x+'px '+y+'px)','circle('+rad+'px at '+x+'px '+y+'px)']},{duration:750,easing:'ease-in-out',pseudoElement:'::view-transition-new(root)'})}).catch(function(){})
  }else apply()});
 // Mobile menu
 var b=$('#burger'),m=$('#menu');
 function close(){m.classList.remove('open');b.setAttribute('aria-expanded','false')}
 b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
 m.addEventListener('click',function(e){if(e.target.tagName==='A')close()});
 d.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
 // Progress + back to top
 var bar=$('#bar'),top=$('#top-btn'),tick=false;
 function upd(){var h=root.scrollHeight-innerHeight;bar.style.width=(h>0?scrollY/h*100:0)+'%';top.hidden=scrollY<600;tick=false}
 addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});upd();
 top.addEventListener('click',function(){scrollTo({top:0,behavior:'smooth'})});
 // Reveal
 var els=d.querySelectorAll('.reveal');
 if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});els.forEach(function(el){io.observe(el)})}
 else els.forEach(function(el){el.classList.add('in')});
 // Falling petals (few, cheap, CSS-animated)
 if(!reduce){var box=$('#petals'),n=innerWidth<700?7:12;
  for(var i=0;i<n;i++){var p=d.createElement('i');p.className='petal';
   p.style.left=Math.random()*100+'%';p.style.animationDuration=(14+Math.random()*12)+'s';p.style.animationDelay=(-Math.random()*20)+'s';
   p.style.setProperty('--dx',(Math.random()*160-80)+'px');p.style.setProperty('--rot',(360+Math.random()*360)+'deg');
   p.style.transform='scale('+(.6+Math.random()*.8)+')';box.appendChild(p)}
  // petal burst on tap/click of buttons & cards
  d.addEventListener('click',function(e){if(!e.target.closest('.btn,.social,.club,.icon-btn'))return;
   for(var k=0;k<8;k++){var s=d.createElement('i');s.className='burst';s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';
    var a=Math.random()*6.28,r=40+Math.random()*50;s.style.setProperty('--bx',Math.cos(a)*r+'px');s.style.setProperty('--by',Math.sin(a)*r+'px');
    d.body.appendChild(s);setTimeout(function(x){x.remove()},900,s)}})}
 $('#year').textContent=new Date().getFullYear();
})();

/* v3: split name into animated letters, photo glow tracking, cursor petals */
(function(){
 var d=document,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,n=0;
 d.querySelectorAll('[data-split]').forEach(function(el){
  var t=el.textContent;el.textContent='';
  t.split('').forEach(function(c){
   var s=d.createElement('span');
   if(c===' '){s.className='sp'}else{s.className='ltr';s.textContent=c;s.style.setProperty('--i',n++)}
   el.appendChild(s)})});
 d.querySelectorAll('.fx').forEach(function(el){
  el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();
   el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true})});
 if(!reduce&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  var last=0;
  addEventListener('pointermove',function(e){var now=performance.now();if(now-last<90)return;last=now;
   var s=d.createElement('i');s.className='trail';s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';
   s.style.setProperty('--bx',(Math.random()*40-20)+'px');s.style.setProperty('--by',(20+Math.random()*30)+'px');
   d.body.appendChild(s);setTimeout(function(){s.remove()},1100)},{passive:true})}
})();

const S={
 baladi:{name:"Baladi Platform",type:"Central Platform",riskLevel:"high",x:450,y:80,
  threats:["DDoS","Data Breach","Phishing"],controls:["Encryption","Access Control","Monitoring"],
  deps:["website","app","licenses"],impact:"Shutdown of all connected municipality services"},
 website:{name:"Municipality Website",type:"Website",riskLevel:"medium",x:150,y:300,
  threats:["Defacement","Phishing"],controls:["SSL Encryption","Firewall"],
  deps:["api"],impact:"Loss of online services access"},
 app:{name:"Hail Madinati App",type:"Mobile App",riskLevel:"medium",x:450,y:300,
  threats:["Reverse Engineering","Data Leak"],controls:["Encryption","Authentication"],
  deps:["api"],impact:"Citizens cannot use mobile services"},
 licenses:{name:"Licenses System",type:"Service System",riskLevel:"high",x:750,y:300,
  threats:["Data Breach","Downtime"],controls:["Encryption","Backup","Access Control"],
  deps:["db"],impact:"Cannot issue licenses for citizens"},
 api:{name:"API Gateway",type:"Integration Layer",riskLevel:"medium",x:300,y:520,
  threats:["Downtime","Unauthorized Access"],controls:["Encryption","Authentication"],
  deps:["cloud"],impact:"Integration between systems fails"},
 db:{name:"Database",type:"Data Layer",riskLevel:"high",x:600,y:520,
  threats:["Data Leak","Ransomware"],controls:["Encryption","Backup"],
  deps:["cloud"],impact:"Loss of citizen data"},
 cloud:{name:"Cloud Infrastructure",type:"Infrastructure",riskLevel:"high",x:450,y:720,
  threats:["Outage","Misconfiguration"],controls:["Encryption","Trusted Provider"],
  deps:[],impact:"All services go down"}
};
const RC={high:"#E74C3C",medium:"#F39C12",low:"#27AE60"};
const RL={high:"High risk",medium:"Medium risk",low:"Low risk"};

function toggleMenu(){
  document.getElementById('sideMenu').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('active');
}

/* Icons */
function icons(k){
  const s='#008F76';
  const map={
    baladi:[{t:'polygon',a:{points:'20,4 4,12 20,20 36,12',fill:'none',stroke:s,'stroke-width':'2.5'}},{t:'polyline',a:{points:'4,12 4,28 20,36 36,28 36,12',fill:'none',stroke:s,'stroke-width':'2.5'}}],
    website:[{t:'circle',a:{cx:'20',cy:'20',r:'16',fill:'none',stroke:s,'stroke-width':'2.5'}},{t:'line',a:{x1:'4',y1:'20',x2:'36',y2:'20',stroke:s,'stroke-width':'2.5'}},{t:'path',a:{d:'M20 4a16 16 0 0 1 0 32 M20 4a16 16 0 0 0 0 32',fill:'none',stroke:s,'stroke-width':'2.5'}}],
    app:[{t:'rect',a:{x:'12',y:'4',width:'16',height:'32',rx:'3',fill:'none',stroke:s,'stroke-width':'2.5'}},{t:'circle',a:{cx:'20',cy:'30',r:'1.5',fill:s}}],
    licenses:[{t:'path',a:{d:'M24 4H10a4 4 0 0 0-4 4v24a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4V14z',fill:'none',stroke:s,'stroke-width':'2.5'}},{t:'polyline',a:{points:'24,4 24,14 34,14',fill:'none',stroke:s,'stroke-width':'2.5'}}],
    db:[{t:'ellipse',a:{cx:'20',cy:'10',rx:'14',ry:'5',fill:'none',stroke:s,'stroke-width':'2.5'}},{t:'path',a:{d:'M6 10v20c0 2.8 6.3 5 14 5s14-2.2 14-5V10',fill:'none',stroke:s,'stroke-width':'2.5'}}],
    api:[{t:'polyline',a:{points:'26,28 36,20 26,12',fill:'none',stroke:s,'stroke-width':'2.5'}},{t:'polyline',a:{points:'14,12 4,20 14,28',fill:'none',stroke:s,'stroke-width':'2.5'}}],
    cloud:[{t:'path',a:{d:'M30 20h-2a10 10 0 1 0-16 8h18a6 6 0 0 0 0-12z',fill:'none',stroke:s,'stroke-width':'2.5'}}]
  };
  return map[k]||map.cloud;
}
function iconsWhite(k){
  const arr=icons(k);
  return arr.map(p=>{
    const a={...p.a};a.stroke='#fff';a.fill='none';
    return {t:p.t,a};
  });
}

/* Assets */
function renderAssets(f='all'){
  const g=document.getElementById('assetsGrid');if(!g)return;g.innerHTML='';
  Object.keys(S).forEach(k=>{
    const s=S[k];if(f!=='all'&&s.riskLevel!==f)return;
    const lbl=s.riskLevel[0].toUpperCase()+s.riskLevel.slice(1);
    const c=document.createElement('div');c.className='ac';c.onclick=()=>openModal(k);
    c.innerHTML=`<div class="ah"><div class="an">${s.name}</div><span class="rb r${s.riskLevel[0]}">${lbl}</span></div>
      <div class="ai"><p><strong>Type:</strong> ${s.type}</p><p><strong>Threats:</strong> ${s.threats.length}</p><p><strong>Controls:</strong> ${s.controls.length}</p></div>`;
    g.appendChild(c);
  });
}
function openModal(k){
  const s=S[k];if(!s)return;
  document.getElementById('modalTitle').textContent=s.name;
  document.getElementById('modalBody').innerHTML=`
    <div class="msec"><h3>Overview</h3><p><strong>Type:</strong> ${s.type}</p><p><strong>Risk:</strong> ${s.riskLevel.toUpperCase()}</p></div>
    <div class="msec"><h3>Threats</h3><ul>${s.threats.map(t=>`<li>${t}</li>`).join('')}</ul></div>
    <div class="msec"><h3>Controls</h3><ul>${s.controls.map(c=>`<li>${c}</li>`).join('')}</ul></div>
    <div class="msec"><h3>Dependencies</h3><ul>${s.deps.length?s.deps.map(d=>`<li>${S[d].name}</li>`).join(''):'<li>None</li>'}</ul></div>
    <div class="msec"><h3>Impact if Failed</h3><p>${s.impact}</p></div>`;
  document.getElementById('assetModal').classList.add('active');
}
function closeModal(e){if(e)e.stopPropagation();const m=document.getElementById('assetModal');if(m)m.classList.remove('active');}

/* Map */
let sel=null;
function renderMap(){
  const svg=document.getElementById('depMap');if(!svg)return;svg.innerHTML='';
  const defs=document.createElementNS('http://www.w3.org/2000/svg','defs');
  defs.innerHTML=`<marker id="ar" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#008F76"/></marker>`;
  svg.appendChild(defs);
  Object.keys(S).forEach(k=>{
    const s=S[k];s.deps.forEach(dk=>{
      const d=S[dk];if(!d)return;
      const dx=d.x-s.x,dy=d.y-s.y,dist=Math.sqrt(dx*dx+dy*dy),r=55;
      const x1=s.x+(dx/dist)*r,y1=s.y+(dy/dist)*r,x2=d.x-(dx/dist)*r,y2=d.y-(dy/dist)*r;
      const l=document.createElementNS('http://www.w3.org/2000/svg','line');
      l.setAttribute('x1',x1);l.setAttribute('y1',y1);l.setAttribute('x2',x2);l.setAttribute('y2',y2);
      l.setAttribute('stroke','#008F76');l.setAttribute('stroke-width','2');l.setAttribute('stroke-opacity','.5');
      l.setAttribute('stroke-dasharray','8 5');l.setAttribute('marker-end','url(#ar)');l.setAttribute('class','ma');
      l.dataset.from=k;l.dataset.to=dk;l.style.animation='dash 1.2s linear infinite';
      svg.appendChild(l);
    });
  });
  Object.keys(S).forEach(k=>{
    const s=S[k];const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','mn');g.dataset.key=k;
    const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx',s.x);c.setAttribute('cy',s.y);c.setAttribute('r','50');c.setAttribute('fill','white');
    c.setAttribute('stroke',RC[s.riskLevel]);c.setAttribute('stroke-width','4');g.appendChild(c);
    const ig=document.createElementNS('http://www.w3.org/2000/svg','g');
    ig.setAttribute('transform',`translate(${s.x-20},${s.y-20})`);
    icons(k).forEach(p=>{const el=document.createElementNS('http://www.w3.org/2000/svg',p.t);Object.keys(p.a).forEach(a=>el.setAttribute(a,p.a[a]));ig.appendChild(el);});
    g.appendChild(ig);
    const t=document.createElementNS('http://www.w3.org/2000/svg','text');
    t.setAttribute('x',s.x);t.setAttribute('y',s.y+72);t.setAttribute('text-anchor','middle');
    t.setAttribute('font-size','13');t.setAttribute('font-weight','600');t.setAttribute('fill','#001D2B');
    t.setAttribute('font-family','Inter, sans-serif');t.textContent=s.name;g.appendChild(t);
    g.addEventListener('click',()=>handleNode(k));svg.appendChild(g);
  });
}

function handleNode(k){
  const svg=document.getElementById('depMap');
  const ns=svg.querySelectorAll('.mn'),ars=svg.querySelectorAll('.ma');
  if(sel===k){sel=null;ns.forEach(n=>n.classList.remove('dim','hi'));ars.forEach(a=>a.classList.remove('dim','hi'));
    const t=document.getElementById('analysisText');t.className='aph';t.innerHTML='Click on any system in the map to see its dependencies and impact.';return;}
  sel=k;const s=S[k];const conn=new Set([k]);
  s.deps.forEach(d=>conn.add(d));
  Object.keys(S).forEach(x=>{if(S[x].deps.includes(k))conn.add(x);});
  ns.forEach(n=>{const x=n.dataset.key;if(x===k||conn.has(x)){n.classList.remove('dim');n.classList.add('hi');}else{n.classList.add('dim');n.classList.remove('hi');}});
  ars.forEach(a=>{if(a.dataset.from===k||a.dataset.to===k){a.classList.remove('dim');a.classList.add('hi');}else{a.classList.add('dim');a.classList.remove('hi');}});

  const dependsOn=s.deps.map(d=>S[d].name);
  const dependedBy=Object.keys(S).filter(x=>S[x].deps.includes(k)).map(x=>S[x].name);
  let h=`<div class="acard"><div class="aci">${iconsWhite(k).map(p=>`<${p.t} ${Object.keys(p.a).map(a=>`${a}="${p.a[a]}"`).join(' ')}/>`).join('')}</div>
    <div class="acc"><h4>${s.name}</h4><div class="sub">${s.type}</div>
    <span class="pill ${s.riskLevel[0]}">${RL[s.riskLevel]}</span>`;
  if(dependedBy.length){h+=`<div class="asec"><h5>If it fails, ${dependedBy.length} system(s) affected:</h5><ul class="al">`;
    dependedBy.forEach(n=>{const x=Object.keys(S).find(y=>S[y].name===n);h+=`<li><span class="nm"><span class="dt ${S[x].riskLevel[0]}"></span>${n}</span><span class="stp">1 step</span></li>`;});
    h+=`</ul></div>`;}
  if(dependsOn.length){h+=`<div class="asec"><h5>It relies on ${dependsOn.length} system(s):</h5><ul class="al">`;
    dependsOn.forEach(n=>{const x=Object.keys(S).find(y=>S[y].name===n);h+=`<li><span class="nm"><span class="dt ${S[x].riskLevel[0]}"></span>${n}</span><span class="stp">1 step</span></li>`;});
    h+=`</ul></div>`;}
  h+=`<div class="aact"><a href="simulation.html?sys=${k}" class="btn p">Simulate an incident</a></div></div></div>`;
  const t=document.getElementById('analysisText');t.className='';t.innerHTML=h;
}

/* Simulation */
function populateSim(){
  const sel=document.getElementById('simSystem');if(!sel||sel.options.length>1)return;
  Object.keys(S).forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=S[k].name;sel.appendChild(o);});
  const url=new URLSearchParams(location.search).get('sys');
  if(url&&S[url]){sel.value=url;}
}

function runSimulation(){
  const key=document.getElementById('simSystem').value;
  const scenario=document.getElementById('simScenario').value;
  const out=document.getElementById('simResults');
  if(!key){out.innerHTML='<p class="ph2" style="color:#E74C3C">Please select a system first.</p>';return;}
  const s=S[key];
  const affected=[],notAffected=[];
  Object.keys(S).forEach(k=>{if(k===key)return;if(S[k].deps.includes(key))affected.push({key:k,name:S[k].name});else notAffected.push(S[k].name);});
  const total=Object.keys(S).length-1;
  const pct=Math.round((affected.length/total)*100);
  const color=pct>=50?"#E74C3C":pct>=25?"#F39C12":"#27AE60";
  const impactLbl=pct>=50?"High":pct>=25?"Medium":"Low";
  const circumference=2*Math.PI*70;
  const offset=circumference-(pct/100)*circumference;
  const responses={failure:["Switch affected services to the fallback process.","Post a status notice so residents know what to expect."],breach:["Isolate the affected accounts and rotate their credentials.","Work out what data was exposed and tell its owner."],ddos:["Enable rate limiting and activate DDoS protection.","Coordinate with the ISP to filter malicious traffic."],ransomware:["Disconnect affected systems from the network immediately.","Restore from the most recent verified backup."]};

  out.innerHTML=`
    <div class="icard">
      <div class="dw">
        <svg viewBox="0 0 160 160">
          <circle class="db" cx="80" cy="80" r="70"/>
          <circle class="df" cx="80" cy="80" r="70" stroke="${color}" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
        </svg>
        <div class="dc"><div class="ds">${pct}</div><div class="dss">out of 100</div></div>
      </div>
      <div class="ibadge">● ${impactLbl} impact</div>
      <div class="ititle">Downtime at ${s.name} would reach ${affected.length} other systems</div>
      <div class="idesc">The impact travels up to ${affected.length>1?"2":"1"} step${affected.length>1?"s":""} through the systems that depend on it.</div>
      <div class="istats">
        <div class="irow"><span class="l">${affected.length+1} of ${total+1}</span><span class="v">Systems affected</span></div>
        <div class="irow"><span class="l">About ${Math.max(2,affected.length*2)} hours</span><span class="v">Estimated recovery</span></div>
        <div class="irow"><span class="l">Availability</span><span class="v">Property hit</span></div>
      </div>
    </div>

    <div class="sccard">
      <h3>How the impact spreads</h3>
      <svg class="smap" viewBox="0 0 900 700">${renderSpread(key,affected)}</svg>
    </div>

    <div class="sccard">
      <h3>Impact by system</h3>
      <div class="sig"><h5>Where it starts</h5>
        <div class="sir"><div class="sii">${iconsWhite(key).map(p=>`<${p.t} ${Object.keys(p.a).map(a=>`${a}="${p.a[a]}"`).join(' ')}/>`).join('')}</div>
          <div class="sif"><div class="nm">${s.name}</div><div class="bar"><div class="bar-f" style="width:${pct}%;background:${color}"></div></div></div>
          <div class="sis"><div class="n">${pct}</div><div class="lv ${impactLbl.toLowerCase()[0]}">${impactLbl}</div></div></div>
      </div>
      ${affected.length?`<div class="sig"><h5>One step away</h5>
        ${affected.map(a=>{const ap=Math.round(Math.random()*20)+25;const ac=ap>=50?"#E74C3C":ap>=25?"#F39C12":"#27AE60";const al=ap>=50?"High":ap>=25?"Medium":"Low";
          return `<div class="sir"><div class="sii">${iconsWhite(a.key).map(p=>`<${p.t} ${Object.keys(p.a).map(x=>`${x}="${p.a[x]}"`).join(' ')}/>`).join('')}</div>
            <div class="sif"><div class="nm">${a.name}</div><div class="bar"><div class="bar-f" style="width:${ap}%;background:${ac}"></div></div></div>
            <div class="sis"><div class="n">${ap}</div><div class="lv ${al.toLowerCase()[0]}">${al}</div></div></div>`;}).join('')}
      </div>`:''}
    </div>

    <div class="resp">
      <h3>First responses for ${scenario}</h3>
      <ul>${responses[scenario].map(r=>`<li><span class="chk">✓</span>${r}</li>`).join('')}</ul>
    </div>`;
}

function renderSpread(key,affected){
  const total=Object.keys(S).length;
  const total2=total+1;
  const pct=affected.length?Math.round(((affected.length+1)/Object.keys(S).length)*100):50;
  let h='';
  const arr=[key,...affected.map(a=>a.key)];
  const rx=450,ry=100;
  h+=`<circle cx="${rx}" cy="${ry}" r="55" fill="white" stroke="${RC[S[key].riskLevel]}" stroke-width="4"/>`;
  h+=`<text x="${rx}" y="${ry+5}" text-anchor="middle" font-size="14" font-weight="700" fill="#001D2B">${pct}</text>`;
  h+=`<text x="${rx}" y="${ry+75}" text-anchor="middle" font-size="12" fill="#001D2B" font-weight="600">${S[key].name}</text>`;
  affected.forEach((a,i)=>{
    const ang=(i/(affected.length||1))*(Math.PI*1.2)-Math.PI/2;
    const x=450+Math.cos(ang)*280;
    const y=350+Math.sin(ang)*150;
    h+=`<line x1="${rx}" y1="${ry+55}" x2="${x}" y2="${y-55}" stroke="#008F76" stroke-width="2" stroke-dasharray="8 5" marker-end="url(#ar2)"/>`;
    h+=`<circle cx="${x}" cy="${y}" r="50" fill="white" stroke="${RC[S[a.key].riskLevel]}" stroke-width="4"/>`;
    h+=`<text x="${x}" y="${y+5}" text-anchor="middle" font-size="13" font-weight="700" fill="#001D2B">${Math.round(Math.random()*15)+28}</text>`;
    h+=`<text x="${x}" y="${y+72}" text-anchor="middle" font-size="11" fill="#001D2B" font-weight="600">${a.name.length>15?a.name.slice(0,15)+'…':a.name}</text>`;
  });
  return `<defs><marker id="ar2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#008F76"/></marker></defs>`+h;
}

/* Reports */
function renderReports(){
  const tb=document.getElementById('reportTableBody');if(!tb)return;tb.innerHTML='';
  let h=0,m=0,l=0;
  Object.keys(S).forEach(k=>{const s=S[k];if(s.riskLevel==='high')h++;else if(s.riskLevel==='medium')m++;else l++;
    const lbl=s.riskLevel[0].toUpperCase()+s.riskLevel.slice(1);
    const tr=document.createElement('tr');
    tr.innerHTML=`<td><strong>${s.name}</strong></td><td>${s.type}</td><td><span class="rb r${s.riskLevel[0]}">${lbl}</span></td><td>${s.threats.length}</td><td>${s.controls.length}</td>`;
    tb.appendChild(tr);});
  document.getElementById('cH').textContent=h;document.getElementById('cM').textContent=m;
  document.getElementById('cL').textContent=l;document.getElementById('cT').textContent=h+m+l;
  const r=document.getElementById('recommendations');if(!r)return;let html='';
  if(h>0){const names=Object.values(S).filter(s=>s.riskLevel==='high').map(s=>s.name);
    html+=`<div class="rec h"><div class="ri"><svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div><div class="rc"><h4>High Risk Systems Detected</h4><p>${h} system(s) classified as high risk: ${names.join(', ')}.</p></div></div>`;}
  html+=`<div class="rec l"><div class="ri"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></div><div class="rc"><h4>Regular Assessment</h4><p>Conduct dependency and risk assessments quarterly to keep this map up to date.</p></div></div>`;
  r.innerHTML=html;
}

function animateCounters(){
  document.querySelectorAll('.sn').forEach(el=>{
    const t=parseInt(el.dataset.target);let c=0;const step=Math.ceil(t/30);
    const timer=setInterval(()=>{c+=step;if(c>=t){c=t;clearInterval(timer);}el.textContent=c;},40);
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.fb').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('.fb').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');renderAssets(b.dataset.filter);
  }));
  populateSim();renderAssets();renderMap();renderReports();animateCounters();
});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeModal();const m=document.getElementById('sideMenu');if(m&&m.classList.contains('open'))toggleMenu();}
});

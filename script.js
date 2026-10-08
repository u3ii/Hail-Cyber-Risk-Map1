const systemsData = {
    baladi: { name: "Baladi Platform", type: "Central Platform", riskLevel: "high", x: 450, y: 80,
        threats: ["DDoS", "Data Breach", "Phishing"], controls: ["Encryption", "Access Control", "Monitoring"],
        dependencies: ["website", "app", "licenses"], impact: "Shutdown of all connected municipality services" },
    website: { name: "Municipality Website", type: "Website", riskLevel: "medium", x: 150, y: 300,
        threats: ["Defacement", "Phishing"], controls: ["SSL Encryption", "Firewall"],
        dependencies: ["api"], impact: "Loss of online services access" },
    app: { name: "Hail Madinati App", type: "Mobile App", riskLevel: "medium", x: 450, y: 300,
        threats: ["Reverse Engineering", "Data Leak"], controls: ["Encryption", "Authentication"],
        dependencies: ["api"], impact: "Citizens cannot use mobile services" },
    licenses: { name: "Licenses System", type: "Service System", riskLevel: "high", x: 750, y: 300,
        threats: ["Data Breach", "Downtime"], controls: ["Encryption", "Backup", "Access Control"],
        dependencies: ["db"], impact: "Cannot issue licenses for citizens" },
    api: { name: "API Gateway", type: "Integration Layer", riskLevel: "medium", x: 300, y: 520,
        threats: ["Downtime", "Unauthorized Access"], controls: ["Encryption", "Authentication"],
        dependencies: ["cloud"], impact: "Integration between systems fails" },
    db: { name: "Database", type: "Data Layer", riskLevel: "high", x: 600, y: 520,
        threats: ["Data Leak", "Ransomware"], controls: ["Encryption", "Backup"],
        dependencies: ["cloud"], impact: "Loss of citizen data" },
    cloud: { name: "Cloud Infrastructure", type: "Infrastructure", riskLevel: "high", x: 450, y: 720,
        threats: ["Outage", "Misconfiguration"], controls: ["Encryption", "Trusted Provider"],
        dependencies: [], impact: "All services go down" }
};

const riskColors = { high: "#E74C3C", medium: "#F39C12", low: "#27AE60" };
const riskLabels = { high: "High risk", medium: "Medium risk", low: "Low risk" };

function toggleMenu() {
    document.getElementById('sideMenu').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
}

/* ===== ICONS ===== */
function getIconPaths(key) {
    const s = '#001D2B';
    const icons = {
        baladi: [{t:'polygon',a:{points:'20,4 4,12 20,20 36,12',fill:'none',stroke:s,'stroke-width':'2'}},{t:'polyline',a:{points:'4,12 4,28 20,36 36,28 36,12',fill:'none',stroke:s,'stroke-width':'2'}}],
        website: [{t:'circle',a:{cx:'20',cy:'20',r:'16',fill:'none',stroke:s,'stroke-width':'2'}},{t:'line',a:{x1:'4',y1:'20',x2:'36',y2:'20',stroke:s,'stroke-width':'2'}},{t:'path',a:{d:'M20 4a16 16 0 0 1 0 32 M20 4a16 16 0 0 0 0 32',fill:'none',stroke:s,'stroke-width':'2'}}],
        app: [{t:'rect',a:{x:'12',y:'4',width:'16',height:'32',rx:'3',fill:'none',stroke:s,'stroke-width':'2'}},{t:'circle',a:{cx:'20',cy:'30',r:'1.5',fill:s}}],
        licenses: [{t:'path',a:{d:'M24 4H10a4 4 0 0 0-4 4v24a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4V14z',fill:'none',stroke:s,'stroke-width':'2'}},{t:'polyline',a:{points:'24,4 24,14 34,14',fill:'none',stroke:s,'stroke-width':'2'}}],
        db: [{t:'ellipse',a:{cx:'20',cy:'10',rx:'14',ry:'5',fill:'none',stroke:s,'stroke-width':'2'}},{t:'path',a:{d:'M6 10v20c0 2.8 6.3 5 14 5s14-2.2 14-5V10',fill:'none',stroke:s,'stroke-width':'2'}},{t:'path',a:{d:'M6 20c0 2.8 6.3 5 14 5s14-2.2 14-5',fill:'none',stroke:s,'stroke-width':'2'}}],
        api: [{t:'polyline',a:{points:'26,28 36,20 26,12',fill:'none',stroke:s,'stroke-width':'2'}},{t:'polyline',a:{points:'14,12 4,20 14,28',fill:'none',stroke:s,'stroke-width':'2'}}],
        cloud: [{t:'path',a:{d:'M30 20h-2a10 10 0 1 0-16 8h18a6 6 0 0 0 0-12z',fill:'none',stroke:s,'stroke-width':'2'}}]
    };
    return icons[key] || icons.cloud;
}

/* ===== ASSETS ===== */
function renderAssets(filter = 'all') {
    const grid = document.getElementById('assetsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    Object.keys(systemsData).forEach(key => {
        const sys = systemsData[key];
        if (filter !== 'all' && sys.riskLevel !== filter) return;
        const label = sys.riskLevel.charAt(0).toUpperCase() + sys.riskLevel.slice(1);
        const card = document.createElement('div');
        card.className = 'asset-card';
        card.onclick = () => openModal(key);
        card.innerHTML = `
            <div class="asset-header">
                <div class="asset-name">${sys.name}</div>
                <span class="risk-badge risk-${sys.riskLevel}">${label}</span>
            </div>
            <div class="asset-info">
                <p><strong>Type:</strong> ${sys.type}</p>
                <p><strong>Threats:</strong> ${sys.threats.length}</p>
                <p><strong>Controls:</strong> ${sys.controls.length}</p>
            </div>`;
        grid.appendChild(card);
    });
}

function openModal(key) {
    const sys = systemsData[key];
    if (!sys) return;
    document.getElementById('modalTitle').textContent = sys.name;
    document.getElementById('modalBody').innerHTML = `
        <div class="modal-section"><h3>Overview</h3><p><strong>Type:</strong> ${sys.type}</p><p><strong>Risk:</strong> ${sys.riskLevel.toUpperCase()}</p></div>
        <div class="modal-section"><h3>Threats</h3><ul>${sys.threats.map(t=>`<li>${t}</li>`).join('')}</ul></div>
        <div class="modal-section"><h3>Controls</h3><ul>${sys.controls.map(c=>`<li>${c}</li>`).join('')}</ul></div>
        <div class="modal-section"><h3>Dependencies</h3><ul>${sys.dependencies.length ? sys.dependencies.map(d=>`<li>${systemsData[d].name}</li>`).join('') : '<li>None</li>'}</ul></div>
        <div class="modal-section"><h3>Impact if Failed</h3><p>${sys.impact}</p></div>`;
    document.getElementById('assetModal').classList.add('active');
}

function closeModal(e) {
    if (e) e.stopPropagation();
    const m = document.getElementById('assetModal');
    if (m) m.classList.remove('active');
}

/* ===== MAP ===== */
let selectedNode = null;

function renderMap() {
    const svg = document.getElementById('dependencyMap');
    if (!svg) return;
    svg.innerHTML = '';
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `<marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#008F76"/></marker>`;
    svg.appendChild(defs);

    // Edges
    Object.keys(systemsData).forEach(key => {
        const sys = systemsData[key];
        sys.dependencies.forEach(depKey => {
            const dep = systemsData[depKey];
            if (!dep) return;
            const dx = dep.x - sys.x, dy = dep.y - sys.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const r = 55;
            const x1 = sys.x + (dx/dist)*r, y1 = sys.y + (dy/dist)*r;
            const x2 = dep.x - (dx/dist)*r, y2 = dep.y - (dy/dist)*r;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1); line.setAttribute('y1', y1);
            line.setAttribute('x2', x2); line.setAttribute('y2', y2);
            line.setAttribute('stroke', '#008F76');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('stroke-opacity', '0.5');
            line.setAttribute('stroke-dasharray', '8 5');
            line.setAttribute('marker-end', 'url(#arrowhead)');
            line.setAttribute('class', 'map-arrow');
            line.dataset.from = key;
            line.dataset.to = depKey;
            line.style.animation = 'dashFlow 1.2s linear infinite';
            svg.appendChild(line);
        });
    });

    // Nodes
    Object.keys(systemsData).forEach(key => {
        const sys = systemsData[key];
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'map-node');
        g.dataset.key = key;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', sys.x); circle.setAttribute('cy', sys.y);
        circle.setAttribute('r', '50');
        circle.setAttribute('fill', 'white');
        circle.setAttribute('stroke', riskColors[sys.riskLevel]);
        circle.setAttribute('stroke-width', '4');
        g.appendChild(circle);

        const iconG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        iconG.setAttribute('transform', `translate(${sys.x-20}, ${sys.y-20})Node`);
        getIconPaths(key).forEach(p => {
            const el = document.createElementNS('http://www.w3.org/2000/svg', p.t);
            Object.keys(p.a).forEach(k => el.setAttribute(k, p.a[k]));
            iconG.appendChild(el);
        });
        g.appendChild(iconG);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', sys.x);
        label.setAttribute('y', sys.y + 72);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '13');
        label.setAttribute('font-weight', '600');
        label.setAttribute('fill', '#001D2B');
        label.setAttribute('font-family', 'Inter, sans-serif');
        label.textContent = sys.name;
        g.appendChild(label);

        g.addEventListener('click', () => handleNodeClick(key));
        svg.appendChild(g);
    });
}

function handleNodeClick(key) {
    const svg = document.getElementById('dependencyMap');
    const allNodes = svg.querySelectorAll('.map-node');
    const allArrows = svg.querySelectorAll('.map-arrow');

    if (selectedNode === key) {
        selectedNode = null;
        allNodes.forEach(n => n.classList.remove('dimmed', 'highlighted'));
        allArrows.forEach(a => a.classList.remove('dimmed', 'highlighted'));
        document.getElementById('analysisText').className = 'analysis-placeholder';
        document.getElementById('analysisText').innerHTML = 'Click on any system in the map to see its dependencies and impact.';
        return;
    }

    selected = key;
    const sys = systemsData[key];
    const connected = new Set([key]);
    sys.dependencies.forEach(d => connected.add(d));
    Object.keys(systemsData).forEach(k => {
        if (systemsData[k].dependencies.includes(key)) connected.add(k);
    });

    allNodes.forEach(n => {
        const k = n.dataset.key;
        if (k === key || connected.has(k)) {
            n.classList.remove('dimmed'); n.classList.add('highlighted');
        } else {
            n.classList.add('dimmed'); n.classList.remove('highlighted');
        }
    });

    allArrows.forEach(a => {
        if (a.dataset.from === key || a.dataset.to === key) {
            a.classList.remove('dimmed'); a.classList.add('highlighted');
        } else {
            a.classList.add('dimmed'); a.classList.remove('highlighted');
        }
    });

    // Build analysis card
    const dependsOn = sys.dependencies.map(d => systemsData[d].name);
    const dependedBy = Object.keys(systemsData).filter(k => systemsData[k].dependencies.includes(key)).map(k => systemsData[k].name);

    let html = `
        <div class="analysis-card">
            <div class="analysis-card-icon">◈</div>
            <div class="analysis-card-content">
                <h4>${sys.name}</h4>
                <div class="subtitle">${sys.type}</div>
                <span class="risk-pill ${sys.riskLevel}">${riskLabels[sys.riskLevel]}</span>
    `;

    if (dependedBy.length > 0) {
        html += `<div class="analysis-section"><h5>If it fails, ${dependedBy.length} system(s) affected:</h5><ul class="affected-list">`;
        dependedBy.forEach(name => {
            const k = Object.keys(systemsData).find(x => systemsData[x].name === name);
            html += `<li><span class="name"><span class="dot ${systemsData[k].riskLevel}"></span>${name}</span><span class="step">1 step</span></li>`;
        });
        html += `</ul></div>`;
    }

    if (dependsOn.length > 0) {
        html += `<div class="analysis-section"><h5>It relies on ${dependsOn.length} system(s):</h5><ul class="affected-list">`;
        dependsOn.forEach(name => {
            const k = Object.keys(systemsData).find(x => systemsData[x].name === name);
            html += `<li><span class="name"><span class="dot ${systemsData[k].riskLevel}"></span>${name}</span><span class="step">1 step</span></li>`;
        });
        html += `</ul></div>`;
    }

    html += `
                <div class="analysis-actions">
                    <a href="simulation.html" class="btn-action primary">Simulate an incident</a>
                </div>
            </div>
        </div>
    `;

    const box = document.getElementById('analysisText');
    box.className = '';
    box.innerHTML = html;
}

/* ===== SIMULATION ===== */
function populateSimSystem() {
    const sel = document.getElementById('simSystem');
    if (!sel || sel.options.length > 1) return;
    Object.keys(systemsData).forEach(k => {
        const o = document.createElement('option');
        o.value = k; o.textContent = systemsData[k].name;
        sel.appendChild(o);
    });
}

function runSimulation() {
    const key = document.getElementById('simSystem').value;
    const scenario = document.getElementById('simScenario').value;
    const out = document.getElementById('simResults');
    if (!key) { out.innerHTML = '<p class="placeholder" style="color:#E74C3C;">Please select a system first.</p>'; return; }

    const sys = systemsData[key];
    const affected = [], notAffected = [];
    Object.keys(systemsData).forEach(k => {
        if (k === key) return;
        if (systemsData[k].dependencies.includes(key)) affected.push(systemsData[k].name);
        else notAffected.push(systemsData[k].name);
    });
    const total = Object.keys(systemsData).length - 1;
    const pct = total > 0 ? Math.round((affected.length/total)*100) : 0;
    const labels = { failure: "Complete Failure", breach: "Data Breach", ddos: "DDoS Attack", ransomware: "Ransomware" };

    out.innerHTML = `
        <div class="result-block"><h4>Directly Affected</h4><p style="color:#E74C3C;font-weight:700;">${sys.name}</p></div>
        <div class="result-block"><h4>Indirectly Affected (${affected.length})</h4>${affected.length ? affected.map(a=>`<p>⚠ ${a}</p>`).join('') : '<p>None</p>'}</div>
        <div class="result-block"><h4>Not Affected (${notAffected.length})</h4>${notAffected.length ? notAffected.map(a=>`<p>✓ ${a}</p>`).join('') : '<p>None</p>'}</div>
        <div class="result-block"><h4>Impact Score</h4><div class="impact-bar"><div class="impact-fill" style="width:${pct}%;"></div></div><p style="font-size:24px;font-weight:800;color:#008F76;font-family:'Space Grotesk',sans-serif;">${pct}%</p></div>
        <div class="result-block"><h4>Scenario</h4><p>${labels[scenario]}</p></div>`;
}

/* ===== REPORTS ===== */
function renderReports() {
    const tbody = document.getElementById('reportTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    let h = 0, m = 0, l = 0;
    Object.keys(systemsData).forEach(k => {
        const s = systemsData[k];
        if (s.riskLevel === 'high') h++;
        else if (s.riskLevel === 'medium') m++;
        else l++;
        const label = s.riskLevel.charAt(0).toUpperCase() + s.riskLevel.slice(1);
        const tr = document.createElement('tr');
        tr.innerHTML = `<td><strong>${s.name}</strong></td><td>${s.type}</td><td><span class="risk-badge risk-${s.riskLevel}">${label}</span></td><td>${s.threats.length}</td><td>${s.controls.length}</td>`;
        tbody.appendChild(tr);
    });
    document.getElementById('countHigh').textContent = h;
    document.getElementById('countMedium').textContent = m;
    document.getElementById('countLow').textContent = l;
    document.getElementById('countTotal').textContent = h + m + l;

    const recs = document.getElementById('recommendations');
    if (!recs) return;
    let html = '';
    if (h > 0) {
        const names = Object.values(systemsData).filter(s => s.riskLevel === 'high').map(s => s.name);
        html += `<div class="recommendation priority-high"><div class="rec-icon"><svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div><div class="rec-content"><h4>High Risk Systems Detected</h4><p>${h} system(s) classified as high risk: ${names.join(', ')}.</p></div></div>`;
    }
    html += `<div class="recommendation priority-low"><div class="rec-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></div><div class="rec-content"><h4>Regular Assessment</h4><p>Conduct dependency and risk assessments quarterly to keep this map up to date.</p></div></div>`;
    recs.innerHTML = html;
}

/* ===== COUNTERS ===== */
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.target);
        let current = 0;
        const step = Math.ceil(target / 30);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = current;
        }, 40);
    });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderAssets(btn.dataset.filter);
        });
    });
    populateSimSystem();
    renderAssets();
    renderMap();
    renderReports();
    animateCounters();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeModal();
        const menu = document.getElementById('sideMenu');
        if (menu && menu.classList.contains('open')) toggleMenu();
    }
});

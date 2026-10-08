/* ===========================
   DATA
   =========================== */
const systemsData = {
    baladi: {
        name: "Baladi Platform", type: "Central Platform", riskLevel: "high",
        x: 450, y: 90,
        threats: ["DDoS", "Data Breach", "Phishing"],
        controls: ["Encryption", "Access Control", "Monitoring"],
        dependencies: ["website", "app", "licenses"],
        impact: "Shutdown of all connected municipality services"
    },
    website: {
        name: "Municipality Website", type: "Website", riskLevel: "medium",
        x: 180, y: 300,
        threats: ["Defacement", "Phishing"],
        controls: ["SSL Encryption", "Firewall"],
        dependencies: ["api"],
        impact: "Loss of online services access"
    },
    app: {
        name: "Hail Madinati App", type: "Mobile App", riskLevel: "medium",
        x: 450, y: 300,
        threats: ["Reverse Engineering", "Data Leak"],
        controls: ["Encryption", "Authentication"],
        dependencies: ["api"],
        impact: "Citizens cannot use mobile services"
    },
    licenses: {
        name: "Licenses System", type: "Service System", riskLevel: "high",
        x: 720, y: 300,
        threats: ["Data Breach", "Downtime"],
        controls: ["Encryption", "Backup", "Access Control"],
        dependencies: ["db"],
        impact: "Cannot issue licenses for citizens"
    },
    db: {
        name: "Database", type: "Data Layer", riskLevel: "high",
        x: 720, y: 500,
        threats: ["Data Leak", "Ransomware"],
        controls: ["Encryption", "Backup"],
        dependencies: ["cloud"],
        impact: "Loss of citizen data"
    },
    api: {
        name: "API Gateway", type: "Integration Layer", riskLevel: "medium",
        x: 300, y: 500,
        threats: ["Downtime", "Unauthorized Access"],
        controls: ["Encryption", "Authentication"],
        dependencies: ["cloud"],
        impact: "Integration between systems fails"
    },
    cloud: {
        name: "Cloud Infrastructure", type: "Infrastructure", riskLevel: "high",
        x: 510, y: 660,
        threats: ["Outage", "Misconfiguration"],
        controls: ["Encryption", "Trusted Provider"],
        dependencies: [],
        impact: "All services go down"
    }
};

const riskColors = { high: "#E74C3C", medium: "#F39C12", low: "#27AE60" };

/* ===========================
   MENU
   =========================== */
function toggleMenu() {
    document.getElementById('sideMenu').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
}

/* ===========================
   ASSETS
   =========================== */
function renderAssets(filter = 'all') {
    const grid = document.getElementById('assetsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    Object.keys(systemsData).forEach(key => {
        const system = systemsData[key];
        if (filter !== 'all' && system.riskLevel !== filter) return;

        const riskLabel = system.riskLevel.charAt(0).toUpperCase() + system.riskLevel.slice(1);
        const card = document.createElement('div');
        card.className = 'asset-card';
        card.onclick = () => openModal(key);
        card.innerHTML = `
            <div class="asset-header">
                <div class="asset-name">${system.name}</div>
                <span class="risk-badge risk-${system.riskLevel}">${riskLabel}</span>
            </div>
            <div class="asset-info">
                <p><strong>Type:</strong> ${system.type}</p>
                <p><strong>Threats:</strong> ${system.threats.length}</p>
                <p><strong>Controls:</strong> ${system.controls.length}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

/* ===========================
   MODAL
   =========================== */
function openModal(key) {
    const system = systemsData[key];
    if (!system) return;

    document.getElementById('modalTitle').textContent = system.name;
    document.getElementById('modalBody').innerHTML = `
        <div class="modal-section">
            <h3>Overview</h3>
            <p><strong>Type:</strong> ${system.type}</p>
            <p><strong>Risk Level:</strong> ${system.riskLevel.toUpperCase()}</p>
        </div>
        <div class="modal-section">
            <h3>Threats</h3>
            <ul>${system.threats.map(t => `<li>${t}</li>`).join('')}</ul>
        </div>
        <div class="modal-section">
            <h3>Controls</h3>
            <ul>${system.controls.map(c => `<li>${c}</li>`).join('')}</ul>
        </div>
        <div class="modal-section">
            <h3>Dependencies</h3>
            <ul>${system.dependencies.length > 0 ? system.dependencies.map(d => `<li>${systemsData[d].name}</li>`).join('') : '<li>None</li>'}</ul>
        </div>
        <div class="modal-section">
            <h3>Impact if Failed</h3>
            <p>${system.impact}</p>
        </div>
    `;
    document.getElementById('assetModal').classList.add('active');
}

function closeModal(e) {
    if (e) e.stopPropagation();
    const modal = document.getElementById('assetModal');
    if (modal) modal.classList.remove('active');
}

/* ===========================
   MAP
   =========================== */
let selectedNode = null;

function getSystemIcon(key) {
    const icons = {
        baladi: '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
        website: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
        app: '<svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/></svg>',
        licenses: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
        db: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
        api: '<svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
        cloud: '<svg viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>'
    };
    return icons[key] || icons.cloud;
}

function renderMap() {
    const svg = document.getElementById('dependencyMap');
    if (!svg) return;
    svg.innerHTML = '';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `<marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#008F76"/></marker>`;
    svg.appendChild(defs);

    // Edges
    Object.keys(systemsData).forEach(key => {
        const system = systemsData[key];
        system.dependencies.forEach(depKey => {
            const dep = systemsData[depKey];
            if (!dep) return;

            const dx = dep.x - system.x;
            const dy = dep.y - system.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const r = 55;
            const x1 = system.x + (dx / dist) * r;
            const y1 = system.y + (dy / dist) * r;
            const x2 = dep.x - (dx / dist) * r;
            const y2 = dep.y - (dy / dist) * r;

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
        const system = systemsData[key];
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'map-node');
        group.dataset.key = key;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', system.x); circle.setAttribute('cy', system.y);
        circle.setAttribute('r', '50');
        circle.setAttribute('fill', 'white');
        circle.setAttribute('stroke', riskColors[system.riskLevel]);
        circle.setAttribute('stroke-width', '4');
        group.appendChild(circle);

        // Icon
        const iconGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const iconSvg = getSystemIcon(key);
        iconGroup.innerHTML = iconSvg;
        const innerSvg = iconGroup.querySelector('svg');
        if (innerSvg) {
            innerSvg.setAttribute('width', '30');
            innerSvg.setAttribute('height', '30');
            innerSvg.setAttribute('stroke', '#001D2B');
            innerSvg.setAttribute('fill', 'none');
            innerSvg.setAttribute('stroke-width', '2');
            innerSvg.setAttribute('stroke-linecap', 'round');
            innerSvg.setAttribute('stroke-linejoin', 'round');
        }
        iconGroup.setAttribute('transform', `translate(${system.x - 15}, ${system.y - 15})`);
        group.appendChild(iconGroup);

        // Label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', system.x);
        label.setAttribute('y', system.y + 72);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '12');
        label.setAttribute('font-weight', '600');
        label.setAttribute('fill', '#001D2B');
        label.setAttribute('font-family', 'Inter, sans-serif');
        label.textContent = system.name;
        group.appendChild(label);

        group.addEventListener('click', () => handleNodeClick(key));
        svg.appendChild(group);
    });
}

function handleNodeClick(key) {
    const svg = document.getElementById('dependencyMap');
    const allNodes = svg.querySelectorAll('.map-node');
    const allArrows = svg.querySelectorAll('.map-arrow');
    const analysisText = document.getElementById('analysisText');

    if (selectedNode === key) {
        selectedNode = null;
        allNodes.forEach(n => n.classList.remove('dimmed', 'highlighted'));
        allArrows.forEach(a => a.classList.remove('dimmed', 'highlighted'));
        analysisText.innerHTML = 'Click on any system in the map to see its dependencies and impact.';
        return;
    }

    selectedNode = key;
    const system = systemsData[key];
    const connected = new Set([key]);
    system.dependencies.forEach(d => connected.add(d));
    Object.keys(systemsData).forEach(k => {
        if (systemsData[k].dependencies.includes(key)) connected.add(k);
    });

    allNodes.forEach(node => {
        const nk = node.dataset.key;
        if (nk === key || connected.has(nk)) {
            node.classList.remove('dimmed');
            node.classList.add('highlighted');
        } else {
            node.classList.add('dimmed');
            node.classList.remove('highlighted');
        }
    });

    allArrows.forEach(arrow => {
        const from = arrow.dataset.from, to = arrow.dataset.to;
        if (from === key || to === key) {
            arrow.classList.remove('dimmed');
            arrow.classList.add('highlighted');
        } else {
            arrow.classList.add('dimmed');
            arrow.classList.remove('highlighted');
        }
    });

    const dependsOn = system.dependencies.map(d => systemsData[d].name);
    const dependedBy = Object.keys(systemsData).filter(k => systemsData[k].dependencies.includes(key)).map(k => systemsData[k].name);

    let text = `<strong>${system.name}</strong><br>`;
    text += `<strong>Type:</strong> ${system.type} &nbsp;|&nbsp; <strong>Risk:</strong> <span style="color:${riskColors[system.riskLevel]};font-weight:700;">${system.riskLevel.toUpperCase()}</span><br><br>`;
    if (dependsOn.length > 0) text += `<strong>Depends on:</strong> ${dependsOn.join(', ')}<br>`;
    if (dependedBy.length > 0) text += `<strong>Depended on by:</strong> ${dependedBy.join(', ')}<br>`;
    text += `<br><strong>Impact if failed:</strong> ${system.impact}`;

    analysisText.innerHTML = text;
}

/* ===========================
   SIMULATION
   =========================== */
function populateSimulationSelect() {
    const select = document.getElementById('simSystem');
    if (!select) return;
    if (select.options.length > 1) return;

    Object.keys(systemsData).forEach(key => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = systemsData[key].name;
        select.appendChild(opt);
    });
}

function runSimulation() {
    const systemKey = document.getElementById('simSystem').value;
    const scenario = document.getElementById('simScenario').value;
    const results = document.getElementById('simResults');

    if (!systemKey) {
        results.innerHTML = '<p class="placeholder" style="color:#E74C3C;">Please select a system first.</p>';
        return;
    }

    const system = systemsData[systemKey];
    const affected = [], notAffected = [];

    Object.keys(systemsData).forEach(key => {
        if (key === systemKey) return;
        if (systemsData[key].dependencies.includes(systemKey)) affected.push(systemsData[key].name);
        else notAffected.push(systemsData[key].name);
    });

    const total = Object.keys(systemsData).length - 1;
    const impactPercent = total > 0 ? Math.round((affected.length / total) * 100) : 0;

    const scenarioLabels = {
        failure: "Complete Failure", breach: "Data Breach",
        ddos: "DDoS Attack", ransomware: "Ransomware"
    };

    results.innerHTML = `
        <div class="result-block">
            <h4>Directly Affected</h4>
            <p style="color:#E74C3C;font-weight:700;">${system.name}</p>
        </div>
        <div class="result-block">
            <h4>Indirectly Affected (${affected.length})</h4>
            ${affected.length > 0 ? affected.map(a => `<p>⚠ ${a}</p>`).join('') : '<p>None</p>'}
        </div>
        <div class="result-block">
            <h4>Not Affected (${notAffected.length})</h4>
            ${notAffected.length > 0 ? notAffected.map(a => `<p>✓ ${a}</p>`).join('') : '<p>None</p>'}
        </div>
        <div class="result-block">
            <h4>Impact Score</h4>
            <div class="impact-bar"><div class="impact-fill" style="width:${impactPercent}%;"></div></div>
            <p style="font-size:24px;font-weight:800;color:#008F76;font-family:'Space Grotesk',sans-serif;">${impactPercent}%</p>
        </div>
        <div class="result-block">
            <h4>Scenario</h4>
            <p>${scenarioLabels[scenario]}</p>
        </div>
    `;
}

/* ===========================
   REPORTS
   =========================== */
function renderReports() {
    const tbody = document.getElementById('reportTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    let high = 0, medium = 0, low = 0;

    Object.keys(systemsData).forEach(key => {
        const s = systemsData[key];
        if (s.riskLevel === 'high') high++;
        else if (s.riskLevel === 'medium') medium++;
        else low++;

        const riskLabel = s.riskLevel.charAt(0).toUpperCase() + s.riskLevel.slice(1);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${s.name}</strong></td>
            <td>${s.type}</td>
            <td><span class="risk-badge risk-${s.riskLevel}">${riskLabel}</span></td>
            <td>${s.threats.length}</td>
            <td>${s.controls.length}</td>
        `;
        tbody.appendChild(row);
    });

    const elH = document.getElementById('countHigh');
    const elM = document.getElementById('countMedium');
    const elL = document.getElementById('countLow');
    const elT = document.getElementById('countTotal');
    if (elH) elH.textContent = high;
    if (elM) elM.textContent = medium;
    if (elL) elL.textContent = low;
    if (elT) elT.textContent = high + medium + low;

    const recs = document.getElementById('recommendations');
    if (!recs) return;

    const highRiskNames = Object.values(systemsData).filter(s => s.riskLevel === 'high').map(s => s.name);
    const dependencyCounts = {};
    Object.values(systemsData).forEach(s => s.dependencies.forEach(d => {
        dependencyCounts[d] = (dependencyCounts[d] || 0) + 1;
    }));

    let html = '';
    if (high > 0) {
        html += `
            <div class="recommendation priority-high">
                <div class="rec-icon"><svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                <div class="rec-content">
                    <h4>High Risk Systems Detected</h4>
                    <p>${high} system(s) classified as high risk. Prioritize these: ${highRiskNames.join(', ')}.</p>
                </div>
            </div>`;
    }

    Object.keys(dependencyCounts).forEach(dep => {
        if (dependencyCounts[dep] >= 2) {
            html += `
                <div class="recommendation priority-medium">
                    <div class="rec-icon"><svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></div>
                    <div class="rec-content">
                        <h4>Critical Dependencies</h4>
                        <p>${systemsData[dep].name} has ${dependencyCounts[dep]} dependents. Consider adding redundancy.</p>
                    </div>
                </div>`;
        }
    });

    const weak = Object.values(systemsData).filter(s => s.controls.length < 3);
    if (weak.length > 0) {
        html += `
            <div class="recommendation priority-medium">
                <div class="rec-icon"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                <div class="rec-content">
                    <h4>Weak Controls Detected</h4>
                    <p>${weak.length} system(s) have fewer than 3 controls. Consider adding more layers.</p>
                </div>
            </div>`;
    }

    html += `
        <div class="recommendation priority-low">
            <div class="rec-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></div>
            <div class="rec-content">
                <h4>Regular Assessment</h4>
                <p>Conduct dependency and risk assessments quarterly to keep this map up to date.</p>
            </div>
        </div>`;

    recs.innerHTML = html;
}

/* ===========================
   COUNTERS
   =========================== */
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

/* ===========================
   INIT
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderAssets(btn.dataset.filter);
        });
    });

    // Populate & render based on page
    populateSimulationSelect();
    renderAssets();
    renderMap();
    renderReports();
    animateCounters();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        const menu = document.getElementById('sideMenu');
        if (menu && menu.classList.contains('open')) toggleMenu();
    }
});

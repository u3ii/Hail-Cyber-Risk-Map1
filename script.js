
const systemsData = {
    baladi: { name: "Baladi Platform", type: "Central Platform", riskLevel: "high", x: 500, y: 100,
        threats: ["DDoS", "Data Breach", "Phishing"], controls: ["Encryption", "Access Control", "Monitoring"],
        dependencies: ["website", "app", "licenses"], impact: "Shutdown of all connected municipality services" },
    website: { name: "Municipality Website", type: "Website", riskLevel: "medium", x: 200, y: 300,
        threats: ["Defacement", "Phishing"], controls: ["SSL Encryption", "Firewall"],
        dependencies: ["api"], impact: "Loss of online services access" },
    app: { name: "Hail Madinati App", type: "Mobile App", riskLevel: "medium", x: 500, y: 300,
        threats: ["Reverse Engineering", "Data Leak"], controls: ["Encryption", "Authentication"],
        dependencies: ["api"], impact: "Citizens cannot use mobile services" },
    licenses: { name: "Licenses System", type: "Service System", riskLevel: "high", x: 800, y: 300,
        threats: ["Data Breach", "Downtime"], controls: ["Encryption", "Backup", "Access Control"],
        dependencies: ["db"], impact: "Cannot issue licenses for citizens" },
    db: { name: "Database", type: "Data Layer", riskLevel: "high", x: 300, y: 500,
        threats: ["Data Leak", "Ransomware"], controls: ["Encryption", "Backup"],
        dependencies: ["cloud"], impact: "Loss of citizen data" },
    api: { name: "API Gateway", type: "Integration Layer", riskLevel: "medium", x: 600, y: 500,
        threats: ["Downtime", "Unauthorized Access"], controls: ["Encryption", "Authentication"],
        dependencies: ["cloud"], impact: "Integration between systems fails" },
    cloud: { name: "Cloud Infrastructure", type: "Infrastructure", riskLevel: "high", x: 900, y: 500,
        threats: ["Outage", "Misconfiguration"], controls: ["Encryption", "Trusted Provider"],
        dependencies: [], impact: "All services go down" }
};

const riskColors = { high: "#E74C3C", medium: "#F39C12", low: "#27AE60" };

// NAVIGATION
document.querySelectorAll('.nav-link, [data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = system link.dataset.page;
        if (page) showPage(page);
    });
});

document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => showPage(el.dataset.goto));
});

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    const page = document.getElementById('page-' + pageName);
    if (page) page.classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(l => {
        if (l.dataset.page === pageName) l.classList.add('active');
    });
    
    if (pageName === 'map') renderMap();
    if (pageName === 'assets') renderAssets();
    if (pageName === 'reports') renderReports();
    if (pageName === 'simulation') populateSystemSelect();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ASSETS
function renderAssets(filter = 'all') {
    const grid = document.getElementById('assets-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    Object.keys(systemsData).forEach(key => {
        const = systemsData[key];
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

// MODAL
function openModal(key) {
    const system = systemsData[key];
    if (!system) return;
    
    document.getElementById('modal-title').textContent = system.name;
    document.getElementById('modal-body').innerHTML = `
        <div class="modal-section">
            <h3>Overview</h3>
            <ul>
                <li><strong>Type:</strong> ${system.type}</li>
                <li><strong>Risk Level:</strong> ${system.riskLevel.toUpperCase()}</li>
            </ul>
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
            <ul><li>${system.impact}</li></ul>
        </div>
    `;
    document.getElementById('asset-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('asset-modal').classList.remove('active');
}

// MAP
function renderMap() {
    const svg = document.getElementById('dependency-map');
    if (!svg) return;
    svg.innerHTML = '';
    
    // Arrow marker
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `<marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#008F76"/></marker>`;
    svg.appendChild(defs);
    
    // Edges
    Object.keys(systemsData).forEach(key => {
        const system = systemsData[key];
        system.dependencies.forEach(depKey => {
            const dep = systemsData[depKey];
            if (!dep) return;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', system.x);
            line.setAttribute('y1', system.y);
            line.setAttribute('x2', dep.x);
            line.setAttribute('y2', dep.y);
            line.setAttribute('stroke', '#008F76');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('stroke-opacity', '0.4');
            line.setAttribute('marker-end', 'url(#arrowhead)');
            svg.appendChild(line);
        });
    });
    
    // Nodes
    Object.keys(systemsData).forEach(key => {
        const system = systemsData[key];
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'map-node');
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', system.x);
        circle.setAttribute('cy', system.y);
        circle.setAttribute('r', '40');
        circle.setAttribute('fill', 'white');
        circle.setAttribute('stroke', riskColors[system.riskLevel]);
        circle.setAttribute('stroke-width', '3');
        group.appendChild(circle);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', system.x);
        text.setAttribute('y', system.y + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '11');
        text.setAttribute('font-weight', '600');
        text.setAttribute('fill', '#001D2B');
        text.textContent = system.name.split(' ')[0];
        group.appendChild(text);
        
        group.addEventListener('click', () => openModal(key));
        svg.appendChild(group);
    });
}

// SIMULATION
function populateSystemSelect() {
    const select = document.getElementById('system-select');
    if (!select) return;
    if (select.options.length > 0) return;
    Object.keys(systemsData).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = systemsData[key].name;
        select.appendChild(option);
    });
}

function runSimulation() {
    const systemKey = document.getElementById('system-select').value;
    const scenario = document.getElementById('scenario-select').value;
    const results = document.getElementById('results-content');
    
    if (!systemKey) {
        results.innerHTML = '<p style="color: #E74C3C;">Please select a system first.</p>';
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
    
    results.innerHTML = `
        <div class="result-block">
            <h3>Directly Affected</h3>
            <p style="color: #E74C3C; font-weight: bold;">${system.name}</p>
        </div>
        <div class="result-block">
            <h3>Indirectly Affected (${affected.length})</h3>
            ${affected.length > 0 ? affected.map(a => `<p>⚠️ ${a}</p>`).join('') : '<p>None</p>'}
        </div>
        <div class="result-block">
            <h3>Not Affected (${notAffected.length})</h3>
            ${notAffected.length > 0 ? notAffected.map(a => `<p>✅ ${a}</p>`).join('') : '<p>None</p>'}
        </div>
        <div class="result-block">
            <h3>Impact Score</h3>
            <div class="impact-bar"><div class="impact-fill" style="width: ${impactPercent}%;"></div></div>
            <p style="font-size: 24px; font-weight: 800; color: #008F76;">${impactPercent}%</p>
        </div>
        <div class="result-block">
            <h3>Scenario</h3>
            <p>${scenario.toUpperCase()}</p>
        </div>
    `;
}

// REPORTS
function renderReports() {
    const tableBody = document.getElementById('report-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    
    let high = 0, medium = 0, low = 0;
    
    Object.keys(systemsData).forEach(key => {
        const system = systemsData[key];
        if (system.riskLevel === 'high') high++;
        else if (system.riskLevel === 'medium') medium++;
        else low++;
        
        const riskLabel = system.riskLevel.charAt(0).toUpperCase() + system.riskLevel.slice(1);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${system.name}</strong></td>
            <td>${system.type}</td>
            <td><span class="risk-badge risk-${system.riskLevel}">${riskLabel}</span></td>
            <td>${system.threats.length}</td>
            <td>${system.controls.length}</td>
        `;
        tableBody.appendChild(row);
    });
    
    document.getElementById('count-high').textContent = high;
    document.getElementById('count-medium').textContent = medium;
    document.getElementById('count-low').textContent = low;
    document.getElementById('count-total').textContent = high + medium + low;
}

// FILTERS
document.addEventListener('DOMContentLoaded', () => {
    renderAssets();
    populateSystemSelect();
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderAssets(btn.dataset.filter);
        });
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

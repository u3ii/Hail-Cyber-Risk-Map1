
// ===========================
// SYSTEMS DATA
// ===========================
const systemsData = {
    baladi: {
        name: "Baladi Platform",
        type: "Central Platform",
        riskLevel: "high",
        x: 500, y: 100,
        threats: ["DDoS", "Data Breach", "Phishing"],
        controls: ["Encryption", "Access Control", "Monitoring"],
        dependencies: ["website", "app", "licenses"],
        impact: "Shutdown of all connected municipality services"
    },
    website: {
        name: "Municipality Website",
        type: "Website",
        riskLevel: "medium",
        x: 200, y: 300,
        threats: ["Defacement", "Phishing"],
        controls: ["SSL Encryption", "Firewall"],
        dependencies: ["api"],
        impact: "Loss of online services access"
    },
    app: {
        name: "Hail Madinati App",
        type: "Mobile App",
        riskLevel: "medium",
        x: 500, y: 300,
        threats: ["Reverse Engineering", "Data Leak"],
        controls: ["Encryption", "Authentication"],
        dependencies: ["api"],
        impact: "Citizens cannot use mobile services"
    },
    licenses: {
        name: "Licenses System",
        type: "Service System",
        riskLevel: "high",
        x: 800, y: 300,
        threats: ["Data Breach", "Downtime"],
        controls: ["Encryption", "Backup", "Access Control"],
        dependencies: ["db"],
        impact: "Cannot issue licenses for citizens"
    },
    db: {
        name: "Database",
        type: "Data Layer",
        riskLevel: "high",
        x: 300, y: 500,
        threats: ["Data Leak", "Ransomware"],
        controls: ["Encryption", "Backup"],
        dependencies: ["cloud"],
        impact: "Loss of citizen data"
    },
    api: {
        name: "API Gateway",
        type: "Integration Layer",
        riskLevel: "medium",
        x: 600, y: 500,
        threats: ["Downtime", "Unauthorized Access"],
        controls: ["Encryption", "Authentication"],
        dependencies: ["cloud"],
        impact: "Integration between systems fails"
    },
    cloud: {
        name: "Cloud Infrastructure",
        type: "Infrastructure",
        riskLevel: "high",
        x: 900, y: 500,
        threats: ["Outage", "Misconfiguration"],
        controls: ["Encryption", "Trusted Provider"],
        dependencies: [],
        impact: "All services go down"
    }
};

// ===========================
// RISK COLORS
// ===========================
const riskColors = {
    high: "#E74C3C",
    medium: "#F39C12",
    low: "#27AE60"
};

// ===========================
// ASSETS PAGE
// ===========================
function renderAssets(filter = 'all') {
    const grid = document.getElementById('assets-grid');
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

// ===========================
// MODAL
// ===========================
function openModal(key) {
    const system = systemsData[key];
    if (!system) return;
    
    const modal = document.getElementById('asset-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    
    title.textContent = system.name;
    
    body.innerHTML = `
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
        
        <button class="btn btn-danger" onclick="goToSimulation('${key}')">
            Simulate Failure
        </button>
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('asset-modal');
    if (modal) modal.classList.remove('active');
}

function goToSimulation(key) {
    window.location.href = `simulation.html?system=${key}`;
}

// ===========================
// MAP PAGE
// ===========================
function renderMap() {
    const svg = document.getElementById('dependency-map');
    if (!svg) return;
    
    svg.innerHTML = '';
    
    // Draw edges (dependencies)
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
    
    // Arrow marker
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
        <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#008F76" />
        </marker>
    `;
    svg.appendChild(defs);
    
    // Draw nodes (systems)
    Object.keys(systemsData).forEach(key => {
        const system = systemsData[key];
        
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'map-node');
        group.setAttribute('data-key', key);
        group.style.cursor = 'pointer';
        
        // Circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', system.x);
        circle.setAttribute('cy', system.y);
        circle.setAttribute('r', '40');
        circle.setAttribute('fill', 'white');
        circle.setAttribute('stroke', riskColors[system.riskLevel]);
        circle.setAttribute('stroke-width', '3');
        group.appendChild(circle);
        
        // Text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', system.x);
        text.setAttribute('y', system.y + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', '600');
        text.setAttribute('fill', '#001D2B');
        text.textContent = system.name.split(' ')[0];
        group.appendChild(text);
        
        group.addEventListener('click', () => openPanel(key));
        svg.appendChild(group);
    });
}

function openPanel(key) {
    const system = systemsData[key];
    if (!system) return;
    
    const panel = document.getElementById('side-panel');
    const title = document.getElementById('panel-title');
    const content = document.getElementById('panel-content');
    
    title.textContent = system.name;
    
    const dependents = Object.keys(systemsData).filter(k => 
        systemsData[k].dependencies.includes(key)
    );
    
    content.innerHTML = `
        <div class="modal-section">
            <h3>Type</h3>
            <ul><li>${system.type}</li></ul>
        </div>
        <div class="modal-section">
            <h3>Risk Level</h3>
            <ul><li>${system.riskLevel.toUpperCase()}</li></ul>
        </div>
        <div class="modal-section">
            <h3>Depends On (${system.dependencies.length})</h3>
            <ul>${system.dependencies.length > 0 ? system.dependencies.map(d => `<li>${systemsData[d].name}</li>`).join('') : '<li>None</li>'}</ul>
        </div>
        <div class="modal-section">
            <h3>Depended By (${dependents.length})</h3>
            <ul>${dependents.length > 0 ? dependents.map(d => `<li>${systemsData[d].name}</li>`).join('') : '<li>None</li>'}</ul>
        </div>
        <div class="modal-section">
            <h3>Impact</h3>
            <ul><li>${system.impact}</li></ul>
        </div>
    `;
    
    panel.classList.add('active');
}

function closePanel() {
    const panel = document.getElementById('side-panel');
    if (panel) panel.classList.remove('active');
}

// ===========================
// SIMULATION PAGE
// ===========================
function populateSystemSelect() {
    const select = document.getElementById('system-select');
    if (!select) return;
    
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
    
    // Find affected systems
    const affected = [];
    const notAffected = [];
    
    Object.keys(systemsData).forEach(key => {
        if (key === systemKey) return;
        if (systemsData[key].dependencies.includes(systemKey)) {
            affected.push(systemsData[key].name);
        } else {
            notAffected.push(systemsData[key].name);
        }
    });
    
    const impactPercent = Math.round((affected.length / (Object.keys(systemsData).length - 1)) * 100);
    
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
            <div class="impact-bar">
                <div class="impact-fill" style="width: ${impactPercent}%;"></div>
            </div>
            <p style="font-size: 24px; font-weight: 800; color: #008F76;">${impactPercent}%</p>
        </div>
        
        <div class="result-block">
            <h3>Scenario</h3>
            <p>${scenario.toUpperCase()}</p>
        </div>
        
        <button class="btn" onclick="resetSimulation()">Reset</button>
    `;
}

function resetSimulation() {
    document.getElementById('system-select').value = '';
    document.getElementById('results-content').innerHTML = 
        '<p>Select a system and scenario, then click "Run Simulation".</p>';
}

// ===========================
// INIT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Assets page
    renderAssets();
    
    // Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderAssets(btn.dataset.filter);
        });
    });
    
    // Map page
    renderMap();
    
    // Simulation page
    populateSystemSelect();
    
    // Check URL params for simulation
    const params = new URLSearchParams(window.location.search);
    const systemParam = params.get('system');
    if (systemParam) {
        const select = document.getElementById('system-select');
        if (select) select.value = systemParam;
    }
});

// Close modal/panel on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closePanel();
    }
});

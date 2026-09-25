// بيانات الأنظمة
const systemsData = {
    baladi: {
        name: "منصة بلدي",
        type: "منصة مركزية",
        riskLevel: "حرج",
        threats: "اختراق، تعطل، تسريب",
        controls: "تشفير، صلاحيات، مراقبة",
        dependencies: "موقع الأمانة، تطبيق حائل مدينتي، نظام الرخص",
        impact: "توقف خدمات كل الأمانات المرتبطة"
    },
    website: {
        name: "موقع الأمانة",
        type: "موقع إلكتروني",
        riskLevel: "عالي",
        threats: "اختراق، تعطل",
        controls: "تشفير SSL، جدار ناري",
        dependencies: "منصة بلدي، API",
        impact: "توقف الوصول للخدمات الإلكترونية"
    },
    app: {
        name: "تطبيق حائل مدينتي",
        type: "تطبيق جوال",
        riskLevel: "عالي",
        threats: "اختراق، تعطل",
        controls: "تشفير، مصادقة",
        dependencies: "منصة بلدي، API",
        impact: "توقف خدمات التطبيق للمواطنين"
    },
    licenses: {
        name: "نظام الرخص",
        type: "نظام خدمي",
        riskLevel: "حرج",
        threats: "اختراق، تعطل، تسريب",
        controls: "تشفير، صلاحيات، نسخ احتياطي",
        dependencies: "منصة بلدي، قاعدة البيانات",
        impact: "توقف إصدار الرخص للمواطنين"
    },
    db: {
        name: "قاعدة البيانات",
        type: "قاعدة بيانات",
        riskLevel: "حرج",
        threats: "تسريب، اختراق",
        controls: "تشفير، نسخ احتياطي",
        dependencies: "كل الأنظمة",
        impact: "فقدان بيانات المواطنين"
    },
    api: {
        name: "API",
        type: "واجهة برمجية",
        riskLevel: "عالي",
        threats: "تعطل، اختراق",
        controls: "تشفير، مصادقة",
        dependencies: "السحابة",
        impact: "توقف التكامل بين الأنظمة"
    },
    cloud: {
        name: "السحابة",
        type: "بنية تحتية",
        riskLevel: "حرج",
        threats: "انقطاع، اختراق",
        controls: "تشفير، مزود موثوق",
        dependencies: "كل الأنظمة",
        impact: "توقف كل الخدمات"
    }
};

// التفاعل مع الخريطة
document.addEventListener('DOMContentLoaded', function() {
    const nodes = document.querySelectorAll('.node');
    const detailsContent = document.getElementById('details-content');
    
    nodes.forEach(node => {
        node.addEventListener('click', function() {
            const key = this.getAttribute('data-system');
            const system = systemsData[key];
            
            if (system && detailsContent) {
                detailsContent.innerHTML = `
                    <p><strong>الاسم:</strong> ${system.name}</p>
                    <p><strong>النوع:</strong> ${system.type}</p>
                    <p><strong>مستوى الخطورة:</strong> ${system.riskLevel}</p>
                    <p><strong>التهديدات:</strong> ${system.threats}</p>
                    <p><strong>الضوابط:</strong> ${system.controls}</p>
                    <p><strong>الاعتماديات:</strong> ${system.dependencies}</p>
                    <p><strong>الأثر:</strong> ${system.impact}</p>
                `;
            }
        });
    });
    
    // جدول المخاطر
    const risksTable = document.getElementById('risks-table');
    if (risksTable) {
        Object.keys(systemsData).forEach(key => {
            const system = systemsData[key];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${system.name}</td>
                <td>${system.riskLevel}</td>
                <td>${system.threats}</td>
                <td>${system.impact}</td>
            `;
            risksTable.appendChild(row);
        });
    }
    
    // السيناريوهات
    const scenarioSelect = document.getElementById('scenario-select');
    const scenarioResult = document.getElementById('scenario-result');
    
    if (scenarioSelect && scenarioResult) {
        scenarioSelect.addEventListener('change', function() {
            const key = this.value;
            if (key && systemsData[key]) {
                const system = systemsData[key];
                scenarioResult.innerHTML = `
                    <h3>${system.name}</h3>
                    <p><strong>لو تعطل:</strong> ${system.impact}</p>
                    <p><strong>الاعتماديات المتأثرة:</strong> ${system.dependencies}</p>
                `;
            } else {
                scenarioResult.innerHTML = '';
            }
        });
    }
});
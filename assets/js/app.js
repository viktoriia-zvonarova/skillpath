/**
 * Development Map Template JavaScript
 * Dynamic form handling, chart generation, and PDF export functionality
 */

// Global variables
let skillCount = 1;
let phaseCount = 1;
let milestoneCount = 3;
let checklistItems = {1: 3}; // phase: itemCount
let sectionVisibility = {
    executiveSummary: true,
    timeline: true,
    milestones: true,
    skillProgress: true,
    coreSkills: true,
    checklist: true
};

// Initialize progress chart
function initChart() {
    try {
        console.log('Initializing chart...');
        
        const fallbackElement = document.getElementById('chartFallback');
        const canvas = document.getElementById('progressChart');
        
        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded');
            if (fallbackElement) {
                fallbackElement.style.display = 'block';
                fallbackElement.innerHTML = '<p>❌ Chart.js library failed to load</p><p style="font-size: 12px;">Please check your internet connection</p>';
            }
            return;
        }
        
        if (!canvas) {
            console.error('Canvas element progressChart not found');
            return;
        }
        
        // Hide fallback if it was shown
        if (fallbackElement) {
            fallbackElement.style.display = 'none';
        }
        
        const canvasContext = canvas.getContext('2d');
        if (!canvasContext) {
            console.error('Could not get 2D context from canvas');
            return;
        }
        
        const duration = parseInt(document.getElementById('duration').value) || 6;
        console.log('Chart duration:', duration);
        
        const labels = Array.from({length: duration}, (_, i) => `Month ${i + 1}`);
        const dataPoints = Array.from({length: duration}, (_, i) => {
            if (duration === 1) return 100;  // Special case for 1 month
            return 15 + (i * (85 / (duration - 1)));
        });
        
        console.log('Chart labels:', labels);
        console.log('Chart data points:', dataPoints);
        
        // Safely destroy existing chart
        if (window.progressChart) {
            try {
                if (typeof window.progressChart.destroy === 'function') {
                    window.progressChart.destroy();
                }
            } catch (destroyError) {
                console.warn('Error destroying previous chart:', destroyError);
            }
            window.progressChart = null;
        }
        
        window.progressChart = new Chart(canvasContext, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Skill Progress',
                    data: dataPoints,
                    borderColor: '#4299e1',
                    backgroundColor: 'rgba(66, 153, 225, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: '#4299e1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) { return value + '%'; },
                            font: { size: 10 }
                        }
                    },
                    x: {
                        ticks: { font: { size: 10 } }
                    }
                },
                elements: {
                    point: { hoverRadius: 6 }
                }
            }
        });
        
        console.log('Chart created successfully:', window.progressChart);
        
        // Make canvas visible
        canvas.style.display = 'block';
        
    } catch (error) {
        console.error('Error initializing chart:', error);
        const fallbackElement = document.getElementById('chartFallback');
        const canvas = document.getElementById('progressChart');
        
        if (fallbackElement) {
            fallbackElement.style.display = 'block';
            fallbackElement.innerHTML = '<p>❌ Chart initialization failed</p><p style="font-size: 12px;">Error: ' + (error.message || 'Unknown error') + '</p>';
        }
        
        if (canvas) {
            canvas.style.display = 'none';
        }
        
        // Clear any problematic chart object
        window.progressChart = null;
    }
}

// Update content based on form inputs
function updateContent() {
    document.getElementById('headerTitle').textContent = document.getElementById('planTitle').value || 'SkillPath Development Plan';
    document.getElementById('headerSubtitle').textContent = document.getElementById('planSubtitle').value || 'Customize this template for your learning journey';
    
    document.getElementById('durationValue').textContent = document.getElementById('duration').value || '6';
    document.getElementById('hoursValue').textContent = document.getElementById('hoursWeek').value || '6-8';
    document.getElementById('skillsValue').textContent = skillCount;
    document.getElementById('phasesValue').textContent = phaseCount;
    
    updateSkillsDisplay();
    updateTimelineDisplay();
    updateChecklistDisplay();
    updateMilestonesDisplay();
    initChart();
}

// Update timeline display
function updateTimelineDisplay() {
    const timelineDisplay = document.getElementById('timelineDisplay');
    timelineDisplay.innerHTML = '';
    
    for (let i = 1; i <= phaseCount; i++) {
        const timeInput = document.getElementById(`phase${i}Time`);
        const titleInput = document.getElementById(`phase${i}Title`);
        const descInput = document.getElementById(`phase${i}Desc`);
        
        if (timeInput) {
            const timelineItem = document.createElement('li');
            timelineItem.className = 'timeline-item';
            
            const defaultTime = i === 1 ? 'M 1-2' : `M ${i*2-1}-${i*2}`;
            const defaultTitle = i === 1 ? 'Foundation' : i === 2 ? 'Specialization' : i === 3 ? 'Implementation' : `Phase ${i}`;
            const defaultDesc = i === 1 
                ? '• Initial learning and theoretical foundation<br>• Setup development environment<br>• Complete introductory courses and materials'
                : i === 2 
                ? '• Deep dive into core technologies<br>• Hands-on practice with real projects<br>• Advanced concepts and best practices'
                : i === 3
                ? '• Apply knowledge in production scenarios<br>• Build complete end-to-end solutions<br>• Optimize and refine implementations'
                : `• Learning activities for phase ${i}<br>• Practical exercises and projects<br>• Assessment and progress review`;
            
            timelineItem.innerHTML = `
                <div class="timeline-month">${timeInput.value || defaultTime}</div>
                <div class="timeline-content">
                    <div class="timeline-title">Phase ${i}: ${titleInput.value || defaultTitle}</div>
                    <div class="timeline-desc">${(descInput.value || defaultDesc).replace(/\n/g, '<br>')}</div>
                </div>
            `;
            timelineDisplay.appendChild(timelineItem);
        }
    }
}

// Update skills display
function updateSkillsDisplay() {
    const skillsDisplay = document.getElementById('skillsDisplay');
    skillsDisplay.innerHTML = '';
    
    for (let i = 1; i <= skillCount; i++) {
        const nameInput = document.getElementById(`skill${i}Name`);
        const descInput = document.getElementById(`skill${i}Desc`);
        
        if (nameInput && (nameInput.value || i === 1)) {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.innerHTML = `
                <div class="skill-name">${nameInput.value || (i === 1 ? 'Terraform' : `Skill ${i}`)}</div>
                <div class="skill-desc">${descInput.value || (i === 1 ? 'Infrastructure automation, AWS resources' : 'Description for skill ' + i)}</div>
            `;
            skillsDisplay.appendChild(skillItem);
        }
    }
}

// Update checklist display
function updateChecklistDisplay() {
    const checklistDisplay = document.getElementById('checklistDisplay');
    checklistDisplay.innerHTML = '';
    
    for (let phase = 1; phase <= phaseCount; phase++) {
        const phaseTitle = document.getElementById(`phase${phase}Title`)?.value || `Phase ${phase}`;
        const phaseTime = document.getElementById(`phase${phase}Time`)?.value || `M ${phase}-${phase+1}`;
        
        const checklistSection = document.createElement('div');
        checklistSection.className = 'checklist-section';
        
        const sectionHeader = document.createElement('h3');
        sectionHeader.textContent = `Phase ${phase}: ${phaseTitle} (${phaseTime})`;
        checklistSection.appendChild(sectionHeader);
        
        const itemCount = checklistItems[phase] || 0;
        for (let item = 1; item <= itemCount; item++) {
            const itemInput = document.getElementById(`checklist${phase}_${item}`);
            if (itemInput && itemInput.value.trim()) {
                const checklistItem = document.createElement('div');
                checklistItem.className = 'checklist-item';
                checklistItem.innerHTML = `
                    <input type="checkbox" id="display_check${phase}_${item}">
                    <label for="display_check${phase}_${item}">${itemInput.value}</label>
                `;
                checklistSection.appendChild(checklistItem);
            }
        }
        
        checklistDisplay.appendChild(checklistSection);
    }
}

// Add item to specific phase
function addItemToPhase(phaseId) {
    if (!checklistItems[phaseId]) checklistItems[phaseId] = 0;
    if (checklistItems[phaseId] >= 10) {
        alert('Maximum 10 items per phase');
        return;
    }
    
    checklistItems[phaseId]++;
    const itemId = checklistItems[phaseId];
    const phaseContainer = document.querySelector(`[data-phase="${phaseId}"]`);
    
    const itemRow = document.createElement('div');
    itemRow.className = 'form-row';
    itemRow.innerHTML = `
        <input type="text" id="checklist${phaseId}_${itemId}" placeholder="New checklist item" onchange="updateContent()" style="flex: 1;">
        <button type="button" onclick="removeChecklistItem(${phaseId}, ${itemId})" style="background: #f56565; color: white; border: none; padding: 3px 6px; border-radius: 2px; font-size: 11px; cursor: pointer; margin-left: 5px;">×</button>
    `;
    
    phaseContainer.appendChild(itemRow);
    updatePhaseItemCount(phaseId);
    updateContent();
}

// Remove checklist item
function removeChecklistItem(phaseId, itemId) {
    const itemElement = document.getElementById(`checklist${phaseId}_${itemId}`);
    if (itemElement) {
        itemElement.parentElement.remove();
        // Renumber items
        const phaseContainer = document.querySelector(`[data-phase="${phaseId}"]`);
        const items = phaseContainer.querySelectorAll('.form-row');
        items.forEach((item, index) => {
            const input = item.querySelector('input');
            const button = item.querySelector('button');
            if (input && button) {
                const newId = index + 1;
                input.id = `checklist${phaseId}_${newId}`;
                button.setAttribute('onclick', `removeChecklistItem(${phaseId}, ${newId})`);
            }
        });
        checklistItems[phaseId] = items.length;
        updatePhaseItemCount(phaseId);
        updateContent();
    }
}

// Update phase item count display
function updatePhaseItemCount(phaseId) {
    const label = document.querySelector(`[data-checklist-phase="${phaseId}"] label`);
    if (label) {
        label.textContent = `Phase ${phaseId} Items (${checklistItems[phaseId] || 0}):`;
    }
}

// Add checklist item (creates new phase section)
function addChecklistItem() {
    // This function adds items to the current phases - for now, focus on per-phase items
    if (phaseCount > 0) {
        addItemToPhase(phaseCount); // Add to last phase
    }
}

// Update milestones display
function updateMilestonesDisplay() {
    const milestonesDisplay = document.getElementById('milestonesDisplay');
    milestonesDisplay.innerHTML = '';
    
    for (let i = 1; i <= milestoneCount; i++) {
        const milestoneInput = document.getElementById(`milestone${i}`);
        
        if (milestoneInput && milestoneInput.value.trim()) {
            const milestone = document.createElement('div');
            milestone.className = 'milestone';
            milestone.innerHTML = `
                <div class="milestone-check">✓</div>
                ${milestoneInput.value}
            `;
            milestonesDisplay.appendChild(milestone);
        }
    }
}

// Add milestone function
function addMilestone() {
    if (milestoneCount >= 8) {
        alert('Maximum 8 milestones allowed');
        return;
    }
    
    milestoneCount++;
    const milestoneFields = document.getElementById('milestoneFields');
    
    const milestoneGroup = document.createElement('div');
    milestoneGroup.className = 'milestone-group';
    milestoneGroup.setAttribute('data-milestone-id', milestoneCount);
    milestoneGroup.innerHTML = `
        <div class="form-row">
            <label>Milestone ${milestoneCount}:</label>
            <input type="text" id="milestone${milestoneCount}" placeholder="New milestone" onchange="updateContent()" style="flex: 1;">
            <button type="button" class="remove-milestone-btn" onclick="removeMilestone(${milestoneCount})" style="background: #f56565; color: white; border: none; padding: 5px 8px; border-radius: 3px; font-size: 12px; cursor: pointer; margin-left: 10px;">×</button>
        </div>
    `;
    
    milestoneFields.appendChild(milestoneGroup);
    updateRemoveMilestoneButtons();
    updateContent();
    
    if (milestoneCount >= 8) {
        document.getElementById('addMilestoneBtn').style.display = 'none';
    }
}

// Remove milestone function
function removeMilestone(milestoneId) {
    if (milestoneCount <= 1) return;
    
    const milestoneGroup = document.querySelector(`[data-milestone-id="${milestoneId}"]`);
    if (milestoneGroup) {
        milestoneGroup.remove();
        milestoneCount--;
        updateRemoveMilestoneButtons();
        updateContent();
        
        if (milestoneCount < 8) {
            document.getElementById('addMilestoneBtn').style.display = 'inline-block';
        }
    }
}

// Update remove milestone buttons visibility
function updateRemoveMilestoneButtons() {
    const removeMilestoneButtons = document.querySelectorAll('.remove-milestone-btn');
    removeMilestoneButtons.forEach(btn => {
        btn.style.display = milestoneCount > 1 ? 'inline-block' : 'none';
    });
}

// Toggle section visibility
function toggleSection(sectionName) {
    const checkbox = document.getElementById(`show${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}`);
    const sectionElement = document.getElementById(`${sectionName}Section`);
    
    if (sectionElement && checkbox) {
        sectionVisibility[sectionName] = checkbox.checked;
        sectionElement.style.display = checkbox.checked ? 'block' : 'none';
        
        // Handle special case for chart container that needs reinitialization
        if (sectionName === 'skillProgress' && checkbox.checked) {
            setTimeout(() => {
                initChart();
            }, 100);
        }
    }
}

// Show all sections
function showAllSections() {
    Object.keys(sectionVisibility).forEach(sectionName => {
        const checkbox = document.getElementById(`show${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}`);
        if (checkbox) {
            checkbox.checked = true;
            toggleSection(sectionName);
        }
    });
}

// Hide all sections
function hideAllSections() {
    Object.keys(sectionVisibility).forEach(sectionName => {
        const checkbox = document.getElementById(`show${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}`);
        if (checkbox) {
            checkbox.checked = false;
            toggleSection(sectionName);
        }
    });
}


// Add skill function
function addSkill() {
    if (skillCount >= 5) {
        alert('Maximum 5 skills allowed');
        return;
    }
    
    skillCount++;
    const skillFields = document.getElementById('skillFields');
    
    const skillGroup = document.createElement('div');
    skillGroup.className = 'skill-group';
    skillGroup.setAttribute('data-skill-id', skillCount);
    skillGroup.innerHTML = `
        <div class="form-row">
            <label>Skill Name:</label>
            <input type="text" id="skill${skillCount}Name" placeholder="e.g., AWS" onchange="updateContent()">
            <button type="button" class="remove-skill-btn" onclick="removeSkill(${skillCount})" style="background: #f56565; color: white; border: none; padding: 5px 8px; border-radius: 3px; font-size: 12px; cursor: pointer; margin-left: 10px;">×</button>
        </div>
        <div class="form-row">
            <label>Skill Description:</label>
            <input type="text" id="skill${skillCount}Desc" placeholder="e.g., Cloud services and architecture" onchange="updateContent()">
        </div>
    `;
    
    skillFields.appendChild(skillGroup);
    updateRemoveButtons();
    updateContent();
    
    if (skillCount >= 5) {
        document.getElementById('addSkillBtn').style.display = 'none';
    }
}

// Remove skill function
function removeSkill(skillId) {
    const skillGroup = document.querySelector(`[data-skill-id="${skillId}"]`);
    if (skillGroup) {
        skillGroup.remove();
        skillCount--;
        updateRemoveButtons();
        updateContent();
        
        if (skillCount < 5) {
            document.getElementById('addSkillBtn').style.display = 'inline-block';
        }
    }
}

// Update remove buttons visibility
function updateRemoveButtons() {
    const removeSkillButtons = document.querySelectorAll('.remove-skill-btn');
    removeSkillButtons.forEach(btn => {
        btn.style.display = skillCount > 1 ? 'inline-block' : 'none';
    });
    
    const removePhaseButtons = document.querySelectorAll('.remove-phase-btn');
    removePhaseButtons.forEach(btn => {
        btn.style.display = phaseCount > 1 ? 'inline-block' : 'none';
    });
    
    updateRemoveMilestoneButtons();
}

// Add phase function
function addPhase() {
    if (phaseCount >= 8) {
        alert('Maximum 8 phases allowed');
        return;
    }
    
    phaseCount++;
    
    // Add to timeline
    const phaseFields = document.getElementById('phaseFields');
    const phaseGroup = document.createElement('div');
    phaseGroup.className = 'phase-group';
    phaseGroup.setAttribute('data-phase-id', phaseCount);
    phaseGroup.innerHTML = `
        <div class="form-row">
            <label>Phase ${phaseCount} Time:</label>
            <input type="text" id="phase${phaseCount}Time" placeholder="e.g., M ${phaseCount*2-1}-${phaseCount*2}" onchange="updateContent()">
            <button type="button" class="remove-phase-btn" onclick="removePhase(${phaseCount})" style="background: #f56565; color: white; border: none; padding: 5px 8px; border-radius: 3px; font-size: 12px; cursor: pointer; margin-left: 10px;">×</button>
        </div>
        <div class="form-row">
            <label>Phase ${phaseCount} Title:</label>
            <input type="text" id="phase${phaseCount}Title" placeholder="e.g., Advanced Learning" onchange="updateContent()">
        </div>
        <div class="form-row">
            <label>Phase ${phaseCount} Description:</label>
            <textarea id="phase${phaseCount}Desc" placeholder="• Bullet point 1&#10;• Bullet point 2&#10;• Bullet point 3" onchange="updateContent()" style="min-height: 60px;"></textarea>
        </div>
    `;
    phaseFields.appendChild(phaseGroup);
    
    // Add to checklist
    const checklistFields = document.getElementById('checklistFields');
    const checklistGroup = document.createElement('div');
    checklistGroup.className = 'phase-group';
    checklistGroup.setAttribute('data-checklist-phase', phaseCount);
    checklistGroup.innerHTML = `
        <div class="form-row">
            <label>Phase ${phaseCount} Items (0):</label>
            <button type="button" onclick="addItemToPhase(${phaseCount})" style="background: #805ad5; color: white; border: none; padding: 3px 6px; border-radius: 2px; font-size: 11px; cursor: pointer;">+</button>
        </div>
        <div class="checklist-items" data-phase="${phaseCount}">
        </div>
    `;
    checklistFields.appendChild(checklistGroup);
    checklistItems[phaseCount] = 0;
    
    updateRemoveButtons();
    updateContent();
    
    if (phaseCount >= 8) {
        document.getElementById('addPhaseBtn').style.display = 'none';
    }
}

// Remove phase function
function removePhase(phaseId) {
    if (phaseCount <= 1) return;
    
    const phaseGroup = document.querySelector(`[data-phase-id="${phaseId}"]`);
    const checklistGroup = document.querySelector(`[data-checklist-phase="${phaseId}"]`);
    
    if (phaseGroup) {
        phaseGroup.remove();
    }
    if (checklistGroup) {
        checklistGroup.remove();
    }
    
    delete checklistItems[phaseId];
    phaseCount--;
    updateRemoveButtons();
    updateContent();
    
    if (phaseCount < 8) {
        document.getElementById('addPhaseBtn').style.display = 'inline-block';
    }
}

// Fill sample data
function fillSampleData() {
    document.getElementById('planTitle').value = 'DevOps Engineer Transition Plan';
    document.getElementById('planSubtitle').value = 'Software Engineer → DevOps Engineer | Infrastructure & Orchestration Focus';
    document.getElementById('duration').value = '6';
    document.getElementById('hoursWeek').value = '6-8';
    
    // Fill phase data
    document.getElementById('phase1Time').value = 'M 1-2';
    document.getElementById('phase1Title').value = 'Foundation';
    document.getElementById('phase1Desc').value = '• Initial learning and theoretical foundation\n• Setup development environment\n• Complete introductory courses and materials';
    
    // Add sample phases
    if (phaseCount === 1) {
        addPhase();
        document.getElementById('phase2Time').value = 'M 3-4';
        document.getElementById('phase2Title').value = 'Specialization';
        document.getElementById('phase2Desc').value = '• Deep dive into core technologies\n• Hands-on practice with real projects\n• Advanced concepts and best practices';
        
        addPhase();
        document.getElementById('phase3Time').value = 'M 5-6';
        document.getElementById('phase3Title').value = 'Implementation';
        document.getElementById('phase3Desc').value = '• Apply knowledge in production scenarios\n• Build complete end-to-end solutions\n• Optimize and refine implementations';
    }
    
    // Fill skill data
    document.getElementById('skill1Name').value = 'Terraform';
    document.getElementById('skill1Desc').value = 'Infrastructure automation, AWS resources';
    
    // Add second skill for sample
    if (skillCount === 1) {
        addSkill();
        document.getElementById('skill2Name').value = 'Kubernetes';
        document.getElementById('skill2Desc').value = 'Container orchestration, microservices';
    }
    
    // Fill sample checklist items
    document.getElementById('checklist1_1').value = 'Complete initial setup and configuration';
    document.getElementById('checklist1_2').value = 'Finish foundational learning materials';
    document.getElementById('checklist1_3').value = 'Practice basic concepts and commands';
    
    if (phaseCount >= 2) {
        addItemToPhase(2);
        addItemToPhase(2);
        addItemToPhase(2);
        document.getElementById('checklist2_1').value = 'Build hands-on practice projects';
        document.getElementById('checklist2_2').value = 'Master advanced concepts';
        document.getElementById('checklist2_3').value = 'Complete specialization courses';
    }
    
    if (phaseCount >= 3) {
        addItemToPhase(3);
        addItemToPhase(3);
        document.getElementById('checklist3_1').value = 'Deploy production solutions';
        document.getElementById('checklist3_2').value = 'Optimize implementations';
    }
    
    // Fill milestone data
    document.getElementById('milestone1').value = 'Complete foundational learning phase';
    document.getElementById('milestone2').value = 'Master core technology specialization';
    document.getElementById('milestone3').value = 'Deploy production-ready implementations';
    
    updateContent();
}

// Clear all data
function clearData() {
    document.querySelectorAll('input').forEach(input => input.value = '');
    document.querySelectorAll('textarea').forEach(textarea => textarea.value = '');
    
    // Reset to single phase
    const phaseFields = document.getElementById('phaseFields');
    phaseFields.innerHTML = `
        <div class="phase-group" data-phase-id="1">
            <div class="form-row">
                <label>Phase 1 Time:</label>
                <input type="text" id="phase1Time" placeholder="e.g., M 1-2" onchange="updateContent()">
                <button type="button" class="remove-phase-btn" onclick="removePhase(1)" style="background: #f56565; color: white; border: none; padding: 5px 8px; border-radius: 3px; font-size: 12px; cursor: pointer; margin-left: 10px; display: none;">×</button>
            </div>
            <div class="form-row">
                <label>Phase 1 Title:</label>
                <input type="text" id="phase1Title" placeholder="e.g., Foundation" onchange="updateContent()">
            </div>
            <div class="form-row">
                <label>Phase 1 Description:</label>
                <textarea id="phase1Desc" placeholder="• Bullet point 1&#10;• Bullet point 2&#10;• Bullet point 3" onchange="updateContent()" style="min-height: 60px;"></textarea>
            </div>
        </div>
    `;
    phaseCount = 1;
    document.getElementById('addPhaseBtn').style.display = 'inline-block';
    
    // Reset to single skill
    const skillFields = document.getElementById('skillFields');
    skillFields.innerHTML = `
        <div class="skill-group" data-skill-id="1">
            <div class="form-row">
                <label>Skill Name:</label>
                <input type="text" id="skill1Name" placeholder="e.g., Terraform" onchange="updateContent()">
                <button type="button" class="remove-skill-btn" onclick="removeSkill(1)" style="background: #f56565; color: white; border: none; padding: 5px 8px; border-radius: 3px; font-size: 12px; cursor: pointer; margin-left: 10px; display: none;">×</button>
            </div>
            <div class="form-row">
                <label>Skill Description:</label>
                <input type="text" id="skill1Desc" placeholder="e.g., Infrastructure automation, AWS resources" onchange="updateContent()">
            </div>
        </div>
    `;
    skillCount = 1;
    document.getElementById('addSkillBtn').style.display = 'inline-block';
    
    // Reset checklist
    const checklistFields = document.getElementById('checklistFields');
    checklistFields.innerHTML = `
        <div class="phase-group" data-checklist-phase="1">
            <div class="form-row">
                <label>Phase 1 Items (3):</label>
                <button type="button" onclick="addItemToPhase(1)" style="background: #805ad5; color: white; border: none; padding: 3px 6px; border-radius: 2px; font-size: 11px; cursor: pointer;">+</button>
            </div>
            <div class="checklist-items" data-phase="1">
                <div class="form-row">
                    <input type="text" id="checklist1_1" placeholder="Complete initial setup and configuration" onchange="updateContent()" style="flex: 1;">
                    <button type="button" onclick="removeChecklistItem(1, 1)" style="background: #f56565; color: white; border: none; padding: 3px 6px; border-radius: 2px; font-size: 11px; cursor: pointer; margin-left: 5px; display: none;">×</button>
                </div>
                <div class="form-row">
                    <input type="text" id="checklist1_2" placeholder="Finish foundational learning materials" onchange="updateContent()" style="flex: 1;">
                    <button type="button" onclick="removeChecklistItem(1, 2)" style="background: #f56565; color: white; border: none; padding: 3px 6px; border-radius: 2px; font-size: 11px; cursor: pointer; margin-left: 5px;">×</button>
                </div>
                <div class="form-row">
                    <input type="text" id="checklist1_3" placeholder="Practice basic concepts and commands" onchange="updateContent()" style="flex: 1;">
                    <button type="button" onclick="removeChecklistItem(1, 3)" style="background: #f56565; color: white; border: none; padding: 3px 6px; border-radius: 2px; font-size: 11px; cursor: pointer; margin-left: 5px;">×</button>
                </div>
            </div>
        </div>
    `;
    checklistItems = {1: 3};
    
    // Reset milestones
    const milestoneFields = document.getElementById('milestoneFields');
    milestoneFields.innerHTML = `
        <div class="milestone-group" data-milestone-id="1">
            <div class="form-row">
                <label>Milestone 1:</label>
                <input type="text" id="milestone1" placeholder="Complete foundational learning phase" onchange="updateContent()" style="flex: 1;">
                <button type="button" class="remove-milestone-btn" onclick="removeMilestone(1)" style="background: #f56565; color: white; border: none; padding: 5px 8px; border-radius: 3px; font-size: 12px; cursor: pointer; margin-left: 10px; display: none;">×</button>
            </div>
        </div>
        <div class="milestone-group" data-milestone-id="2">
            <div class="form-row">
                <label>Milestone 2:</label>
                <input type="text" id="milestone2" placeholder="Master core technology specialization" onchange="updateContent()" style="flex: 1;">
                <button type="button" class="remove-milestone-btn" onclick="removeMilestone(2)" style="background: #f56565; color: white; border: none; padding: 5px 8px; border-radius: 3px; font-size: 12px; cursor: pointer; margin-left: 10px;">×</button>
            </div>
        </div>
        <div class="milestone-group" data-milestone-id="3">
            <div class="form-row">
                <label>Milestone 3:</label>
                <input type="text" id="milestone3" placeholder="Deploy production-ready implementations" onchange="updateContent()" style="flex: 1;">
                <button type="button" class="remove-milestone-btn" onclick="removeMilestone(3)" style="background: #f56565; color: white; border: none; padding: 5px 8px; border-radius: 3px; font-size: 12px; cursor: pointer; margin-left: 10px;">×</button>
            </div>
        </div>
    `;
    milestoneCount = 3;
    document.getElementById('addMilestoneBtn').style.display = 'inline-block';
    
    // Reset section visibility
    showAllSections();
    
    updateRemoveButtons();
    updateContent();
}

// Export to PDF
async function exportToPDF() {
    try {
        // Show loading indicator
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Exporting...';
        button.disabled = true;
        
        // Check if libraries are available
        if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
            throw new Error('Required libraries not loaded');
        }
        
        const element = document.getElementById('exportContent');
        
        // Ensure all sections are visible for export
        const originalVisibility = {...sectionVisibility};
        showAllSections();
        
        // Wait a bit for rendering to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: 0,
            windowWidth: 1200,
            windowHeight: 800
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        // Create PDF using the correct jsPDF constructor
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 0;
        
        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
        
        // Add additional pages if needed
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }
        
        // Generate filename
        const planTitle = document.getElementById('planTitle').value || 'development-plan';
        const filename = planTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.pdf';
        
        // Save the PDF
        pdf.save(filename);
        
        // Restore original section visibility
        Object.keys(originalVisibility).forEach(section => {
            if (!originalVisibility[section]) {
                toggleSection(section);
            }
        });
        
        // Restore button state
        button.textContent = originalText;
        button.disabled = false;
        
    } catch (error) {
        console.error('PDF export failed:', error);
        
        // Restore button state first
        if (event && event.target) {
            event.target.textContent = 'Export to PDF';
            event.target.disabled = false;
        }
        
        // Fallback to print
        const userChoice = confirm('Advanced PDF export failed. Would you like to use the browser\'s print function instead? (Click OK to print, Cancel to abort)');
        if (userChoice) {
            // Store original visibility state
            const originalVisibility = {...sectionVisibility};
            
            // Show all sections for printing
            showAllSections();
            
            // Wait a moment for rendering
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Trigger print dialog
            window.print();
            
            // Restore original visibility after a delay
            setTimeout(() => {
                Object.keys(originalVisibility).forEach(section => {
                    if (!originalVisibility[section]) {
                        toggleSection(section);
                    }
                });
            }, 1000);
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    fillSampleData();
    updateContent();
    
    // Force chart initialization after a delay to ensure DOM and libraries are ready
    setTimeout(() => {
        console.log('Force initializing chart after delay...');
        if (typeof Chart !== 'undefined') {
            initChart();
        } else {
            console.warn('Chart.js still not loaded after delay, retrying...');
            setTimeout(() => {
                if (typeof Chart !== 'undefined') {
                    initChart();
                } else {
                    console.error('Chart.js failed to load completely');
                    const fallbackElement = document.getElementById('chartFallback');
                    if (fallbackElement) {
                        fallbackElement.style.display = 'block';
                        fallbackElement.innerHTML = '<p>❌ Chart.js library failed to load</p><p style="font-size: 12px;">Please refresh the page or check your internet connection</p>';
                    }
                }
            }, 1000);
        }
    }, 500);
});
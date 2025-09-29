// Global variables
let i18nData = {};
let currentLang = 'en';

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    await loadData();
    initializeLanguageSwitcher();
    updateTexts(); // Initialize texts with current language
    renderPage();
    initializeMermaid();
    
    // Force update language button text after everything is loaded
    setTimeout(() => {
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.textContent = currentLang === 'en' ? 'EN' : '中文';
        }
    }, 100);
});

// Load data from JSON files
async function loadData() {
    try {
        console.log('Starting to load data...');
        const [enResponse, zhResponse] = await Promise.all([
            fetch('data/en.json'),
            fetch('data/zh.json')
        ]);
        
        console.log('Responses received:', enResponse.status, zhResponse.status);
        
        const enData = await enResponse.json();
        const zhData = await zhResponse.json();
        
        console.log('Data loaded successfully:', {
            enData: !!enData,
            zhData: !!zhData,
            enTeamMembers: enData?.team_members?.length,
            enUserStories: enData?.user_stories?.length
        });
        
        // Set up data structures
        i18nData = {
            en: enData,
            zh: zhData
        };
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Initialize language switcher
function initializeLanguageSwitcher() {
    const langToggle = document.getElementById('lang-toggle');
    
    if (langToggle) {
        // Set initial button text
        langToggle.textContent = currentLang === 'en' ? 'EN' : '中文';
        
        langToggle.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'zh' : 'en';
            switchLanguage(newLang);
        });
    } else {
        console.log('Language toggle button not found');
    }
}

// Switch language
function switchLanguage(lang) {
    currentLang = lang;
    
    // Update button text
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.textContent = lang === 'en' ? 'EN' : '中文';
    }
    
    // Update page content
    updateTexts();
    renderPage();
    
    // Force re-render specific sections that contain dynamic content
    setTimeout(() => {
        renderSprintBacklog();
        renderTaskBoard();
    }, 50);
}

// Update text content based on current language
function updateTexts() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = getI18nText(key);
        if (text) {
            if (element.tagName.toLowerCase() === 'title') {
                element.textContent = text;
                document.title = text;
            } else {
                element.textContent = text;
            }
        }
    });
}

// Get internationalized text
function getI18nText(key) {
    const keys = key.split('.');
    let value = i18nData[currentLang];
    
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            return null;
        }
    }
    
    return value;
}

// Render the entire page
function renderPage() {
    renderTeamMembers();
    renderUserStories();
    renderPriorityAndCapacity();
    renderSprintBacklog();
    renderTaskBoard();
    renderDeliverables();
    renderPresentationPoints();
    renderEstimationLogic();
    updateTexts();
}

// Render team members
function renderTeamMembers() {
    const currentData = i18nData[currentLang];
    console.log('Rendering team members:', currentData?.team_members?.length);
    const container = document.getElementById('team-members');
    if (!container) {
        console.error('Team members container not found');
        return;
    }
    container.innerHTML = '';
    
    if (!currentData?.team_members) {
        console.error('No team members data available');
        return;
    }
    
    currentData.team_members.forEach(member => {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'team-member fade-in';
        
        // Get localized role and skills
        const localizedRole = getI18nText(`team.roles.${member.role}`) || member.role;
        const localizedSkills = getI18nText(`team.skills.${member.skills}`) || member.skills;
        
        memberDiv.innerHTML = `
            <div class="member-name">${member.name}</div>
            <div class="member-role">${localizedRole}</div>
            <div class="member-skills">${localizedSkills}</div>
        `;
        container.appendChild(memberDiv);
    });
}

// Render user stories with subtasks
function renderUserStories() {
    const currentData = i18nData[currentLang];
    const container = document.getElementById('user-stories-table');
    const hoursSuffix = getI18nText('taskboard.hours_suffix') || 'h';
    
    if (!currentData?.user_stories) {
        console.error('No user stories data available');
        return;
    }
    
    const table = document.createElement('table');
    table.className = 'story-table';
    
    // Headers
    const headerRow = document.createElement('tr');
    const headers = ['id', 'title', 'description', 'story_points', 'hours', 'priority'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.setAttribute('data-i18n', `user_stories.headers.${header}`);
        th.textContent = getI18nText(`user_stories.headers.${header}`) || header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    
    // User stories and subtasks
    currentData.user_stories.forEach(story => {
        // Get localized story content
        const localizedTitle = getI18nText(`user_stories.stories.${story.id}.title`) || story.title;
        const localizedDescription = getI18nText(`user_stories.stories.${story.id}.description`) || story.description;
        
        // Main story row
        const storyRow = document.createElement('tr');
        storyRow.innerHTML = `
            <td><strong>${story.id}</strong></td>
            <td><strong>${localizedTitle}</strong></td>
            <td>${localizedDescription}</td>
            <td><span class="story-points">${story.story_points}</span></td>
            <td><span class="effort-hours">${story.total_hours}${hoursSuffix}</span></td>
            <td><strong>${story.priority}</strong></td>
        `;
        table.appendChild(storyRow);
        
        // Subtasks
        story.subtasks.forEach(subtask => {
            const subtaskRow = document.createElement('tr');
            subtaskRow.style.backgroundColor = '#f9f9f9';
            
                          // Get localized subtask content
              const localizedSubtaskTitle = getI18nText(`user_stories.subtasks.${subtask.id}.title`) || subtask.title;
              const localizedSubtaskDescription = getI18nText(`user_stories.subtasks.${subtask.id}.description`) || subtask.description;
            const localizedCategory = getI18nText(`user_stories.categories.${subtask.category}`) || subtask.category;
            
            subtaskRow.innerHTML = `
                <td style="padding-left: 30px;">${subtask.id}</td>
                <td style="padding-left: 30px;">${localizedSubtaskTitle}</td>
                <td>${localizedSubtaskDescription}</td>
                <td><span class="story-points">${subtask.story_points}</span></td>
                <td><span class="effort-hours">${subtask.hours}${hoursSuffix}</span></td>
                <td>${subtask.assignee} (${localizedCategory})</td>
            `;
            table.appendChild(subtaskRow);
        });
    });
    
    container.innerHTML = '';
    container.appendChild(table);
}

// Render priority and capacity planning
function renderPriorityAndCapacity() {
    // Priority list
    const priorityContainer = document.getElementById('priority-list');
    if (!priorityContainer) {
        console.error('Priority list container not found');
        return;
    }
    priorityContainer.innerHTML = '';
    
    // Get current language data
    const currentData = i18nData[currentLang];
    if (!currentData || !currentData.user_stories) {
        console.error('No user stories data available for priority rendering');
        return;
    }
    
    // Create priority section wrapper
    const prioritySection = document.createElement('div');
    prioritySection.className = 'priority-section';
    

    // Group user stories by priority
    const priorityGroups = {
        'P1': [],
        'P2': [],
        'P3': []
    };
    
    currentData.user_stories.forEach(story => {
        if (priorityGroups[story.priority]) {
            priorityGroups[story.priority].push(story.id);
        }
    });
    
    // Render each priority group
    Object.keys(priorityGroups).forEach(priorityLevel => {
        if (priorityGroups[priorityLevel].length > 0) {
            const priorityDiv = document.createElement('div');
            priorityDiv.className = `priority-item priority-${priorityLevel.toLowerCase()}`;
            
            // Get localized priority content
            const localizedTitle = getI18nText(`priority.priorities.${priorityLevel}.title`) || `Priority ${priorityLevel}`;
            const localizedDescription = getI18nText(`priority.priorities.${priorityLevel}.description`) || '';
            const storiesLabel = getI18nText('priority.stories_label') || 'Stories:';
            
            priorityDiv.innerHTML = `
                <div class="priority-title">${priorityLevel}: ${localizedTitle}</div>
                <div class="priority-description">${localizedDescription}</div>
                <div class="priority-stories">${storiesLabel} ${priorityGroups[priorityLevel].join(', ')}</div>
            `;
            prioritySection.appendChild(priorityDiv);
        }
    });
    
    priorityContainer.appendChild(prioritySection);
    
    // Capacity chart
    const capacityContainer = document.getElementById('capacity-chart');
    if (!capacityContainer) {
        console.error('Capacity chart container not found');
        return;
    }
    
    if (!currentData.metrics) {
        console.error('No metrics data available for capacity rendering');
        return;
    }
    
    const metrics = currentData.metrics;
    const commitmentPercentage = (metrics.committed_hours / metrics.team_capacity) * 100;
    const bufferPercentage = metrics.buffer_percentage;
    const hoursSuffix = getI18nText('taskboard.hours_suffix') || 'h';
    
    // Get localized labels
    const capacityTitle = getI18nText('priority.capacity.title') || 'Capacity Planning';
    const totalCapacityLabel = getI18nText('priority.capacity.team_capacity') || 'Total Capacity';
    const committedWorkLabel = getI18nText('priority.capacity.committed_work') || 'Committed Work';
    const bufferTimeLabel = getI18nText('priority.capacity.buffer_time') || 'Buffer Time';
    
    // Calculate team member workload
    const memberWorkload = {};
    currentData.team_members.forEach(member => {
        memberWorkload[member.name] = 0;
    });
    
    // Aggregate hours by assignee
    currentData.user_stories.forEach(story => {
        story.subtasks.forEach(subtask => {
            if (memberWorkload.hasOwnProperty(subtask.assignee)) {
                memberWorkload[subtask.assignee] += subtask.hours;
            }
        });
    });
    
    // Generate member workload breakdown HTML
    const memberBreakdownHTML = Object.entries(memberWorkload)
        .map(([name, hours]) => {
            const percentage = (hours / metrics.committed_hours * 100).toFixed(1);
            return `
                <div class="member-workload">
                    <span class="member-name">${name}:</span>
                    <span class="member-hours">${hours}${hoursSuffix} (${percentage}%)</span>
                </div>
            `;
        }).join('');
    
    capacityContainer.innerHTML = `
        <div class="capacity-chart">
            <div class="capacity-bar">
                <div class="capacity-bar-label">
                    <span>${totalCapacityLabel}</span>
                    <span>${metrics.team_capacity}${hoursSuffix}</span>
                </div>
                <div class="capacity-bar-fill">
                    <div class="capacity-bar-progress total" style="width: 100%;">
                        <span class="capacity-value">${metrics.team_capacity}${hoursSuffix}</span>
                    </div>
                </div>
            </div>
            
            <div class="capacity-bar">
                <div class="capacity-bar-label">
                    <span>${committedWorkLabel}</span>
                    <span>${metrics.committed_hours}${hoursSuffix} (${Math.round(commitmentPercentage)}%)</span>
                </div>
                <div class="capacity-bar-fill">
                    <div class="capacity-bar-progress committed" style="width: ${commitmentPercentage}%;">
                        <span class="capacity-value">${metrics.committed_hours}${hoursSuffix}</span>
                    </div>
                </div>
                <div class="member-breakdown">
                    ${memberBreakdownHTML}
                </div>
            </div>
            
            <div class="capacity-bar">
                <div class="capacity-bar-label">
                    <span>${bufferTimeLabel}</span>
                    <span>${metrics.team_capacity - metrics.committed_hours}${hoursSuffix} (${bufferPercentage}%)</span>
                </div>
                <div class="capacity-bar-fill">
                    <div class="capacity-bar-progress buffer" style="width: ${bufferPercentage}%;">
                        <span class="capacity-value">${metrics.team_capacity - metrics.committed_hours}${hoursSuffix}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render sprint backlog assignment
function renderSprintBacklog() {
    const currentData = i18nData[currentLang];
    if (!currentData?.team_members || !currentData?.user_stories) {
        console.error('No team members or user stories data available');
        return;
    }
    
    const container = document.getElementById('backlog-table');
    
    // Calculate assignments per team member
    const assignments = {};
    currentData.team_members.forEach(member => {
        assignments[member.name] = {
            role: member.role,
            tasks: [],
            totalPoints: 0,
            totalHours: 0
        };
    });
    
    // Aggregate tasks by assignee
    currentData.user_stories.forEach(story => {
        story.subtasks.forEach(subtask => {
            if (assignments[subtask.assignee]) {
                // Get localized task title
                const localizedTitle = getI18nText(`user_stories.subtasks.${subtask.id}.title`) || subtask.title;
                assignments[subtask.assignee].tasks.push(`${subtask.id}: ${localizedTitle}`);
                assignments[subtask.assignee].totalPoints += subtask.story_points;
                assignments[subtask.assignee].totalHours += subtask.hours;
            }
        });
    });
    
    const table = document.createElement('table');
    table.className = 'backlog-table';
    
    // Headers
    const headerRow = document.createElement('tr');
    const headers = ['member', 'role', 'tasks', 'story_points', 'hours'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.setAttribute('data-i18n', `backlog.headers.${header}`);
        th.textContent = getI18nText(`backlog.headers.${header}`) || header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    
    // Assignment rows
    const hoursSuffix = getI18nText('taskboard.hours_suffix') || 'h';
    Object.entries(assignments).forEach(([name, assignment]) => {
        const row = document.createElement('tr');
        
        // Get localized role
        const localizedRole = getI18nText(`team.roles.${assignment.role}`) || assignment.role;
        
        row.innerHTML = `
            <td><strong>${name}</strong></td>
            <td>${localizedRole}</td>
            <td>${assignment.tasks.join('<br>')}</td>
            <td><span class="story-points">${assignment.totalPoints}</span></td>
            <td><span class="effort-hours">${assignment.totalHours}${hoursSuffix}</span></td>
        `;
        table.appendChild(row);
    });
    
    container.innerHTML = '';
    container.appendChild(table);
}

// Render task board
function renderTaskBoard() {
    const currentData = i18nData[currentLang];
    if (!currentData?.tasks) {
        console.error('No tasks data available');
        return;
    }
    
    const todoContainer = document.getElementById('todo-tasks');
    const progressContainer = document.getElementById('progress-tasks');
    const doneContainer = document.getElementById('done-tasks');
    
    // Clear containers
    [todoContainer, progressContainer, doneContainer].forEach(container => {
        container.innerHTML = '';
    });
    
    // Render tasks in each column
    const containers = {
        'todo': todoContainer,
        'in_progress': progressContainer,
        'done': doneContainer
    };
    
    Object.entries(currentData.tasks).forEach(([status, tasks]) => {
        const container = containers[status];
        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task-item slide-up';
            
            // Get localized assignee label and task title
            const assigneeLabel = getI18nText('taskboard.assignee_label') || 'Assignee:';
            const spSuffix = getI18nText('taskboard.story_points_suffix') || 'SP';
            const hoursSuffix = getI18nText('taskboard.hours_suffix') || 'h';
            // Try board_tasks first, then subtasks, then fall back to original title
            const localizedTitle = getI18nText(`user_stories.board_tasks.${task.id}.title`) || 
                                   getI18nText(`user_stories.subtasks.${task.id}.title`) || 
                                   task.title;
            
            taskDiv.innerHTML = `
                <div class="task-title">${localizedTitle}</div>
                <div class="task-assignee">${assigneeLabel} ${task.assignee}</div>
                <div class="task-meta">
                    <span class="story-points">${task.story_points} ${spSuffix}</span>
                    <span class="effort-hours">${task.hours}${hoursSuffix}</span>
                </div>
            `;
            container.appendChild(taskDiv);
        });
    });
}

// Render deliverables
function renderDeliverables() {
    const currentData = i18nData[currentLang];
    if (!currentData?.deliverables?.items) {
        console.log('No deliverables data available, skipping render');
        return;
    }
    
    const functionalContainer = document.getElementById('functional-deliverables');
    const documentationContainer = document.getElementById('documentation-deliverables');
    const processContainer = document.getElementById('process-deliverables');
    
    const containers = {
        'functional': functionalContainer,
        'documentation': documentationContainer,
        'process': processContainer
    };
    
    Object.entries(currentData.deliverables.items).forEach(([category, items]) => {
        const container = containers[category];
        if (!container) {
            console.log(`Container for category ${category} not found`);
            return;
        }
        
        container.innerHTML = '';
        
        if (Array.isArray(items)) {
            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'deliverable-item fade-in';
                
                itemDiv.textContent = item;
                container.appendChild(itemDiv);
            });
        }
    });
}

// Render presentation points
function renderPresentationPoints() {
    const currentData = i18nData[currentLang];
    if (!currentData?.presentation?.points) {
        console.log('No presentation points data available, skipping render');
        return;
    }
    
    const container = document.getElementById('presentation-points');
    container.innerHTML = '';
    
    const pointsDiv = document.createElement('div');
    pointsDiv.className = 'presentation-points';
    
    currentData.presentation.points.forEach(point => {
        const pointDiv = document.createElement('div');
        pointDiv.className = 'presentation-point slide-up';
        
        pointDiv.innerHTML = `
            <div class="point-title">${point.title}</div>
            <div class="point-description">${point.description}</div>
        `;
        pointsDiv.appendChild(pointDiv);
    });
    
    container.appendChild(pointsDiv);
}

// Render estimation logic
function renderEstimationLogic() {
    const currentData = i18nData[currentLang];
    if (!currentData?.estimation?.methods) {
        console.log('No estimation logic data available, skipping render');
        return;
    }
    
    const container = document.getElementById('estimation-logic');
    container.innerHTML = '';
    
    const logicDiv = document.createElement('div');
    logicDiv.className = 'estimation-logic';
    
    currentData.estimation.methods.forEach(logic => {
        const methodDiv = document.createElement('div');
        methodDiv.className = 'estimation-method fade-in';
        
        methodDiv.innerHTML = `
            <div class="method-title">${logic.method}</div>
            <div class="method-description">${logic.description}</div>
        `;
        logicDiv.appendChild(methodDiv);
    });
    
    container.appendChild(logicDiv);
}

// Initialize Mermaid
function initializeMermaid() {
    mermaid.initialize({ 
        startOnLoad: true,
        theme: 'default',
        flowchart: {
            useMaxWidth: true,
            htmlLabels: true
        }
    });
    
}

// Utility function to animate elements on scroll
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.1s';
                entry.target.classList.add('fade-in');
            }
        });
    });
    
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(animateOnScroll, 100);
}); 
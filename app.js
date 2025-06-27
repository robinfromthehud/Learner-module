// Global state
let currentStudents = [];
let currentStudent = null;
let charts = {};

// API Base URL - assuming same origin
const API_BASE = 'http://127.0.0.1:8000/api';

// Mock data for demonstration
const MOCK_STUDENTS_SUMMARY = [
    {
        studentId: "asmijit_2025",
        name: "Asmjit Kaur",
        city: "Chandigarh",
        institution: "Panjab University",
        progress: 75,
        lastActivity: "2025-06-26T09:40:00Z",
        coursesEnrolled: 1,
        overallGPA: 4.2
    },
    {
        studentId: "john_2025",
        name: "John Smith",
        city: "Mumbai",
        institution: "IIT Mumbai",
        progress: 88,
        lastActivity: "2025-06-25T14:30:00Z",
        coursesEnrolled: 2,
        overallGPA: 4.5
    },
    {
        studentId: "sara_2025",
        name: "Sara Johnson",
        city: "Delhi",
        institution: "Delhi University",
        progress: 65,
        lastActivity: "2025-06-24T11:20:00Z",
        coursesEnrolled: 1,
        overallGPA: 3.8
    }
];

const MOCK_STUDENT_DETAILS = {
    "asmijit_2025": {
        "studentId": "asmijit_2025",
        "metadata": {
            "createdAt": { "$date": "2025-06-26T10:55:00Z" },
            "lastUpdated": { "$date": "2025-06-26T10:55:00Z" },
            "schemaVersion": "1.0",
            "lmsVersion": "2024.1"
        },
        "personalInformation": {
            "name": "Asmjit Kaur",
            "age": 22,
            "gender": "Female",
            "location": {
                "city": "Chandigarh",
                "state": "Punjab",
                "country": "India"
            },
            "educationLevel": "Graduate",
            "institution": "Panjab University"
        },
        "professionalInformation": {
            "currentRole": "Data Analyst Intern",
            "organization": "TechSolutions Pvt. Ltd.",
            "industry": "Information Technology",
            "experienceYears": 1,
            "skills": ["Python", "SQL", "Data Visualization"]
        },
        "Courses": {
            "Foundations-of-AI": {
                "status": "In Progress",
                "startDate": { "$date": "2025-05-01T00:00:00Z" },
                "progress": 75,
                "modules": {
                    "Module-1": {
                        "title": "Introduction to AI",
                        "progress": 90,
                        "lastActivity": { "$date": "2025-06-25T18:30:00Z" },
                        "subModules": {
                            "Sub-Module 1": {
                                "title": "AI Basics",
                                "status": "Completed",
                                "activities": {
                                    "quizzes": [82, 78, 85],
                                    "labs": [88, 92],
                                    "assignments": [87]
                                }
                            },
                            "Sub-Module 2": {
                                "title": "Machine Learning Overview",
                                "status": "In Progress",
                                "activities": {
                                    "quizzes": [75, 80],
                                    "labs": [84, 86],
                                    "assignments": [79, 83]
                                }
                            },
                            "Sub-Module 3": {
                                "title": "AI Ethics",
                                "status": "Not Started",
                                "activities": {
                                    "quizzes": [90],
                                    "assignments": [92]
                                }
                            }
                        }
                    },
                    "Module-2": {
                        "title": "Advanced AI Concepts",
                        "progress": 45,
                        "lastActivity": { "$date": "2025-06-24T15:20:00Z" },
                        "subModules": {
                            "Sub-Module 1": {
                                "title": "Neural Networks",
                                "status": "In Progress",
                                "activities": {
                                    "quizzes": [78, 82],
                                    "labs": [85]
                                }
                            }
                        }
                    }
                }
            },
            "CourseProjectGrade": ["A-"]
        },
        "engagement Metrics": {
            "platform Engagement": {
                "login frequency": {
                    "daily Average": 3,
                    "weekly Total": 18,
                    "longest Streak": 21,
                    "current Streak": 12
                },
                "session Duration": {
                    "average Minutes": 37,
                    "total Hours": 42,
                    "longest Session": 95
                },
                "Preffered Times": ["evening"],
                "last Activity": { "$date": "2025-06-26T09:40:00Z" }
            },
            "content Interaction": {
                "videos Watched": {
                    "total": 64,
                    "completion Rate": 88,
                    "average Watch Time": 19
                },
                "documents Accessed": 57,
                "forum Posts": 14,
                "discussion Contributions": {
                    "posts Created": 6,
                    "replies Given": 22,
                    "likes Received": 35,
                    "quality Score": 4.2
                }
            },
            "assignment Submission": {
                "on Time Submissions": 15,
                "late Submissions": 1,
                "punctuality Score": 94
            }
        },
        "cognitive Profile": {
            "learning Preferences": {
                "primary Style": "visual",
                "Preferred Tone": "Casual",
                "response Format": "Detailed with examples"
            },
            "processing Speed": {
                "reading Speed": 290,
                "decision Making Speed": "quick"
            }
        },
        "feedback Response": {
            "receptivity": {
                "openness Level": "very open",
                "feedback Seeking": "proactive"
            },
            "coaching Integration": {
                "session Attendance": 92,
                "engagement Level": "highly engaged",
                "goal Alignment": "aligned",
                "progress Reporting": "detailed"
            },
            "adaptation Rate": {
                "behavior Change Speed": "rapid",
                "strategy Modification": "flexible",
                "habit Formation": "strong",
                "sustainability Rate": 88
            }
        }
    },
    "john_2025": {
        "studentId": "john_2025",
        "personalInformation": {
            "name": "John Smith",
            "age": 24,
            "gender": "Male",
            "location": {
                "city": "Mumbai",
                "state": "Maharashtra",
                "country": "India"
            },
            "educationLevel": "Masters",
            "institution": "IIT Mumbai"
        },
        "professionalInformation": {
            "currentRole": "Software Developer",
            "organization": "Tech Corp",
            "industry": "Software Development",
            "experienceYears": 2,
            "skills": ["JavaScript", "React", "Node.js"]
        },
        "Courses": {
            "Web-Development": {
                "status": "In Progress",
                "progress": 88,
                "modules": {
                    "Module-1": {
                        "title": "Frontend Basics",
                        "progress": 100,
                        "subModules": {
                            "Sub-Module 1": {
                                "title": "HTML & CSS",
                                "status": "Completed",
                                "activities": {
                                    "quizzes": [95, 92, 88]
                                }
                            }
                        }
                    }
                }
            }
        },
        "engagement Metrics": {
            "platform Engagement": {
                "login frequency": {
                    "daily Average": 4,
                    "weekly Total": 25,
                    "longest Streak": 30,
                    "current Streak": 15
                },
                "session Duration": {
                    "average Minutes": 45,
                    "total Hours": 55,
                    "longest Session": 120
                }
            },
            "content Interaction": {
                "videos Watched": {
                    "total": 78
                },
                "documents Accessed": 62,
                "forum Posts": 18
            }
        },
        "cognitive Profile": {
            "learning Preferences": {
                "primary Style": "kinesthetic",
                "Preferred Tone": "Professional"
            },
            "processing Speed": {
                "reading Speed": 320,
                "decision Making Speed": "moderate"
            }
        },
        "feedback Response": {
            "receptivity": {
                "openness Level": "open",
                "feedback Seeking": "regular"
            },
            "coaching Integration": {
                "session Attendance": 95,
                "engagement Level": "engaged"
            },
            "adaptation Rate": {
                "behavior Change Speed": "steady",
                "sustainability Rate": 92
            }
        }
    }
};

// DOM Elements
const loadingOverlay = document.getElementById('loadingOverlay');
const studentsListView = document.getElementById('studentsListView');
const studentDetailView = document.getElementById('studentDetailView');
const backBtn = document.getElementById('backBtn');
const studentsGrid = document.getElementById('studentsGrid');
const searchInput = document.getElementById('searchInput');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const toastClose = document.getElementById('toastClose');

// Utility functions
function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

function showToast(message, type = 'error') {
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 5000);
}

function getInitials(name) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    } catch (e) {
        return 'N/A';
    }
}

function formatProgress(progress) {
    return Math.round(progress || 0);
}

// API functions with fallback to mock data
async function fetchStudentsSummary() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/students/summary`);
        if (!response.ok) throw new Error('API not available');
        const data = await response.json();
        console.log("AB ayega data");
        console.log(data)
        if (Array.isArray(data)) {
            return data;
        } else if (data && Array.isArray(data.students)) {
            return data.students;
        } else {
            console.error("Unexpected data format:", data);
            return [];
        }
    } catch (error) {
        console.log('Using mock data - API not available');
        // Use mock data as fallback
        return MOCK_STUDENTS_SUMMARY;
    } finally {
        hideLoading();
    }
}

async function fetchStudentDetails(studentId) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/students/${studentId}`);
        if (!response.ok) throw new Error('API not available');
        const data = await response.json();
        console.log("Student details response:", data);
        return data;
    } catch (error) {
        console.log('Using mock data - API not available');
        showToast('Failed to load student details. Using mock data.', 'warning');
        // Use mock data as fallback
        return MOCK_STUDENT_DETAILS[studentId] || null;
    } finally {
        hideLoading();
    }
}

async function fetchStudentAnalytics(studentId) {
    try {
        const response = await fetch(`${API_BASE}/students/${studentId}/analytics`);
        if (!response.ok) throw new Error('API not available');
        return await response.json();
    } catch (error) {
        console.log('Analytics not available - using embedded data');
        return null;
    }
}

// Routing
function getCurrentRoute() {
    const hash = window.location.hash.slice(1) || '/students';
    return hash;
}

function navigateTo(route) {
    window.location.hash = route;
}

function handleRouteChange() {
    const route = getCurrentRoute();
    
    if (route === '/students' || route === '') {
        showStudentsListView();
    } else if (route.startsWith('/students/')) {
        const studentId = route.split('/')[2];
        if (studentId) {
            showStudentDetailView(studentId);
        }
    }
}

// View functions
function showStudentsListView() {
    studentsListView.classList.remove('hidden');
    studentDetailView.classList.add('hidden');
    backBtn.classList.add('hidden');
    
    if (currentStudents.length === 0) {
        loadStudents();
    }
}

function showStudentDetailView(studentId) {
    studentsListView.classList.add('hidden');
    studentDetailView.classList.remove('hidden');
    backBtn.classList.remove('hidden');
    
    loadStudentDetails(studentId);
}

// Students list rendering
async function loadStudents() {
    currentStudents = await fetchStudentsSummary();
    renderStudentsGrid(currentStudents);
}

function renderStudentsGrid(students) {

    console.log("Rendering students:", students);
    if (!students || (Array.isArray(students) && students.length === 0)) {
        studentsGrid.innerHTML = '<div class="text-center"><p>No students found.</p></div>';
        return;
    }

    if (typeof students === 'object' && !Array.isArray(students)) {
        if (students.students) {
            students = students.students;
        } else {
            // Convert object to array if it's a single student
            students = [students];
        }
    }
    
    studentsGrid.innerHTML = students.map(student => `
        <div class="student-card card" onclick="navigateTo('/students/${student.studentId}')">
            <div class="card__body">
                <div class="student-header">
                    <div class="student-avatar">
                        ${getInitials(student.name)}
                    </div>
                    <div class="student-info">
                        <h3>${student.name}</h3>
                        <p>${student.institution || 'Institution not specified'}</p>
                        <p class="text-sm text-secondary">${student.city || 'Location not specified'}</p>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${formatProgress(student.progress)}%"></div>
                </div>
                <div class="student-stats">
                    <div class="stat-item">
                        <span class="stat-value">${formatProgress(student.progress)}%</span>
                        <div class="stat-label">Overall Progress</div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${student.coursesEnrolled || 0}</span>
                        <div class="stat-label">Courses</div>
                    </div>
                </div>
                <div class="mt-16 text-sm text-secondary">
                    Last Activity: ${formatDate(student.lastActivity)}
                </div>
            </div>
        </div>
    `).join('');
}

// Student detail rendering
async function loadStudentDetails(studentId) {
    currentStudent = await fetchStudentDetails(studentId);
    if (!currentStudent) {
        showToast('Student not found');
        navigateTo('/students');
        return;
    }
    
    renderStudentProfile(currentStudent);
    renderAcademicTab(currentStudent);
    renderEngagementTab(currentStudent);
    renderCognitiveTab(currentStudent);
    renderFeedbackTab(currentStudent);
}

function renderStudentProfile(student) {
    const profile = document.getElementById('studentProfile');
    const personal = student.personalInformation || {};
    const professional = student.professionalInformation || {};
    
    profile.innerHTML = `
        <div class="card__body">
            <div class="profile-header">
                <div class="profile-avatar">
                    ${getInitials(personal.name || 'Unknown')}
                </div>
                <div class="profile-info">
                    <h2>${personal.name || 'Unknown Student'}</h2>
                    <p>${professional.currentRole || personal.educationLevel || 'Student'}</p>
                    <p class="text-secondary">${personal.location?.city || ''}, ${personal.location?.country || ''}</p>
                </div>
            </div>
            <div class="profile-details">
                <div class="detail-section">
                    <h4>Personal Information</h4>
                    <ul class="detail-list">
                        <li><span class="label">Age:</span> <span class="value">${personal.age || 'N/A'}</span></li>
                        <li><span class="label">Gender:</span> <span class="value">${personal.gender || 'N/A'}</span></li>
                        <li><span class="label">Education:</span> <span class="value">${personal.educationLevel || 'N/A'}</span></li>
                        <li><span class="label">Institution:</span> <span class="value">${personal.institution || 'N/A'}</span></li>
                    </ul>
                </div>
                <div class="detail-section">
                    <h4>Professional Information</h4>
                    <ul class="detail-list">
                        <li><span class="label">Role:</span> <span class="value">${professional.currentRole || 'N/A'}</span></li>
                        <li><span class="label">Organization:</span> <span class="value">${professional.organization || 'N/A'}</span></li>
                        <li><span class="label">Industry:</span> <span class="value">${professional.industry || 'N/A'}</span></li>
                        <li><span class="label">Experience:</span> <span class="value">${professional.experienceYears || 0} years</span></li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

function renderAcademicTab(student) {
    const container = document.getElementById('coursesContainer');
    const courses = student.Courses || {};
    
    if (Object.keys(courses).length === 0) {
        container.innerHTML = '<div class="text-center"><p>No courses found.</p></div>';
        return;
    }
    
    container.innerHTML = Object.entries(courses)
        .filter(([key]) => key !== 'CourseProjectGrade')
        .map(([courseKey, course]) => {
            const courseName = courseKey.replace(/-/g, ' ');
            const progress = course.progress || 0;
            const modules = course.modules || {};
            
            return `
                <div class="course-card">
                    <div class="course-header" onclick="toggleCourseModules('${courseKey}')">
                        <h3>${courseName}</h3>
                        <div class="course-progress">
                            <span class="course-progress-text">${formatProgress(progress)}%</span>
                            <svg class="expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6,9 12,15 18,9"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div class="course-modules" id="modules-${courseKey}">
                        ${Object.entries(modules).map(([moduleKey, module]) => `
                            <div class="module-item">
                                <div class="module-header" onclick="toggleModuleContent('${courseKey}', '${moduleKey}')">
                                    <h4>${module.title || moduleKey}</h4>
                                    <span class="module-progress">${formatProgress(module.progress || 0)}%</span>
                                </div>
                                <div class="module-content" id="content-${courseKey}-${moduleKey}">
                                    ${renderSubModules(module.subModules || {})}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
}

function renderSubModules(subModules) {
    return Object.entries(subModules).map(([subKey, subModule]) => `
        <div class="submodule-item">
            <div class="submodule-header">
                <span class="submodule-title">${subModule.title || subKey}</span>
                <span class="status ${subModule.status === 'Completed' ? 'status--success' : subModule.status === 'In Progress' ? 'status--warning' : 'status--info'}">
                    ${subModule.status || 'Not Started'}
                </span>
            </div>
            ${renderActivities(subModule.activities || {})}
        </div>
    `).join('');
}

function renderActivities(activities) {
    const activityTypes = Object.keys(activities);
    if (activityTypes.length === 0) return '<p class="text-sm text-secondary">No activities available</p>';
    
    return `
        <div class="activities-grid">
            ${activityTypes.map(type => `
                <div class="activity-group">
                    <h5>${type}</h5>
                    <div class="activity-scores">
                        ${activities[type].map(score => `
                            <span class="score-badge">${score}</span>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderEngagementTab(student) {
    const engagement = student['engagementMetrics'] || {};
    const platform = engagement['platformEngagement'] || {};
    const content = engagement['contentInteraction'] || {};
    
    // Platform Engagement Chart
    renderEngagementChart(platform);
    
    // Content Interaction Chart
    renderContentChart(content);
    
    // Session Analytics Chart
    renderSessionChart(platform['sessionDuration'] || {});
}

function renderEngagementChart(platform) {
    const ctx = document.getElementById('engagementChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (charts.engagement) {
        charts.engagement.destroy();
    }
    
    const loginData = platform['loginFrequency'] || {};
    
    charts.engagement = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Daily Average', 'Weekly Total', 'Current Streak', 'Longest Streak'],
            datasets: [{
                label: 'Login Metrics',
                data: [
                    loginData['dailyAverage'] || 0,
                    loginData['weeklyTotal'] || 0,
                    loginData['currentStreak'] || 0,
                    loginData['longestStreak'] || 0
                ],
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function renderContentChart(content) {
    const ctx = document.getElementById('contentChart');
    if (!ctx) return;
    
    if (charts.content) {
        charts.content.destroy();
    }
    
    const videos = content['videosWatched']?.total || 0;
    const documents = content['documentsAccessed'] || 0;
    const posts = content['forumPosts'] || 0;
    
    charts.content = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Videos Watched', 'Documents Accessed', 'Forum Posts'],
            datasets: [{
                data: [videos, documents, posts],
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function renderSessionChart(sessionData) {
    const ctx = document.getElementById('sessionChart');
    if (!ctx) return;
    
    if (charts.session) {
        charts.session.destroy();
    }
    
    charts.session = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Average Minutes', 'Total Hours', 'Longest Session'],
            datasets: [{
                label: 'Session Duration',
                data: [
                    sessionData['averageMinutes'] || 0,
                    sessionData['totalHours'] || 0,
                    sessionData['longestSession'] || 0
                ],
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function renderCognitiveTab(student) {
    const cognitive = student['cognitiveProfile'] || {};
    const preferences = cognitive['learningPreferences'] || {};
    const processing = cognitive['processingSpeed'] || {};
    
    document.getElementById('learningPreferences').innerHTML = Object.entries(preferences)
        .map(([key, value]) => `
            <div class="key-value-item">
                <span class="key-value-key">${key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span class="key-value-value">${value}</span>
            </div>
        `).join('');
    
    document.getElementById('processingSpeed').innerHTML = Object.entries(processing)
        .map(([key, value]) => `
            <div class="key-value-item">
                <span class="key-value-key">${key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span class="key-value-value">${value}</span>
            </div>
        `).join('');
}

function renderFeedbackTab(student) {
    const feedback = student['feedbackResponse'] || {};
    const receptivity = feedback.receptivity || {};
    const coaching = feedback['coachingIntegration'] || {};
    const adaptation = feedback['adaptationRate'] || {};
    
    document.getElementById('receptivity').innerHTML = Object.entries(receptivity)
        .map(([key, value]) => `
            <div class="key-value-item">
                <span class="key-value-key">${key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span class="key-value-value">${value}</span>
            </div>
        `).join('');
    
    document.getElementById('coachingIntegration').innerHTML = Object.entries(coaching)
        .map(([key, value]) => `
            <div class="key-value-item">
                <span class="key-value-key">${key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span class="key-value-value">${value}</span>
            </div>
        `).join('');
    
    document.getElementById('adaptationRate').innerHTML = Object.entries(adaptation)
        .map(([key, value]) => `
            <div class="key-value-item">
                <span class="key-value-key">${key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span class="key-value-value">${value}</span>
            </div>
        `).join('');
}

// Interactive functions
function toggleCourseModules(courseKey) {
    const modules = document.getElementById(`modules-${courseKey}`);
    const header = modules.previousElementSibling;
    
    if (modules.classList.contains('expanded')) {
        modules.classList.remove('expanded');
        header.classList.remove('expanded');
    } else {
        modules.classList.add('expanded');
        header.classList.add('expanded');
    }
}

function toggleModuleContent(courseKey, moduleKey) {
    const content = document.getElementById(`content-${courseKey}-${moduleKey}`);
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
    } else {
        content.classList.add('expanded');
    }
}

// Tab switching
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Add active class to selected tab button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Search functionality
function filterStudents(searchTerm) {
    const filtered = currentStudents.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.institution && student.institution.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.city && student.city.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    renderStudentsGrid(filtered);
}

// Event listeners
window.addEventListener('hashchange', handleRouteChange);

backBtn.addEventListener('click', () => {
    navigateTo('/students');
});

searchInput.addEventListener('input', (e) => {
    filterStudents(e.target.value);
});

toastClose.addEventListener('click', () => {
    toast.classList.add('hidden');
});

// Tab button event listeners
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        switchTab(tabName);
    });
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    handleRouteChange();
});

// Handle initial route
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleRouteChange);
} else {
    handleRouteChange();
}
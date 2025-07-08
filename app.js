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
        "engagementMetrics": {
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
            },
            "dailyActivity": {
                "2025-06-20": { "totalMinutes": 45, "sessions": 3 },
                "2025-06-21": { "totalMinutes": 32, "sessions": 2 },
                "2025-06-22": { "totalMinutes": 28, "sessions": 1 },
                "2025-06-23": { "totalMinutes": 56, "sessions": 4 },
                "2025-06-24": { "totalMinutes": 42, "sessions": 3 },
                "2025-06-25": { "totalMinutes": 38, "sessions": 2 },
                "2025-06-26": { "totalMinutes": 51, "sessions": 3 }
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
        "engagementMetrics": {
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
            },
            "dailyActivity": {
                "2025-06-20": { "totalMinutes": 45, "sessions": 3 },
                "2025-06-21": { "totalMinutes": 32, "sessions": 2 },
                "2025-06-22": { "totalMinutes": 28, "sessions": 1 },
                "2025-06-23": { "totalMinutes": 56, "sessions": 4 },
                "2025-06-24": { "totalMinutes": 42, "sessions": 3 },
                "2025-06-25": { "totalMinutes": 38, "sessions": 2 },
                "2025-06-26": { "totalMinutes": 51, "sessions": 3 }
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

// Add this to your MOCK_STUDENT_DETAILS for each student

// Add these utility functions
function getDateRange(days) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    return { startDate, endDate };
}

function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
}

// Add this function to render daily activity
function renderDailyActivityChart(student, startDate, endDate) {
    const dailyActivity = student['engagementMetrics']?.dailyActivity || {};
    const ctx = document.getElementById('dailyActivityChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (charts.dailyActivity) {
        charts.dailyActivity.destroy();
    }
    
    // Filter activities within date range
    const filteredActivities = {};
    const datesInRange = getDatesInRange(startDate, endDate);
    
    datesInRange.forEach(date => {
        const dateStr = formatDateForInput(date);
        if (dailyActivity[dateStr]) {
            filteredActivities[dateStr] = dailyActivity[dateStr];
        } else {
            filteredActivities[dateStr] = { 
                totalMinutes: 0, 
                sessions: 0,
                videos: 0,
                docs: 0
            };
        }
    });
    
    // Prepare data for chart
    const labels = Object.keys(filteredActivities).map(date => 
        new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    
    // Calculate average session time
    const totalMinutes = Object.values(filteredActivities).reduce((sum, day) => sum + day.totalMinutes, 0);
    const totalSessions = Object.values(filteredActivities).reduce((sum, day) => sum + day.sessions, 0);
    const avgSessionTime = totalSessions > 0 ? (totalMinutes / totalSessions).toFixed(1) : 0;
    
    // Update average session time display
    document.getElementById('avgSessionTime').textContent = 
        totalSessions > 0 ? `${avgSessionTime} minutes` : 'No data';
    
    // Create chart with multiple datasets
    charts.dailyActivity = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Session Time (mins)',
                    data: Object.values(filteredActivities).map(day => day.totalMinutes),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'Lecture Time (mins)',
                    data: Object.values(filteredActivities).map(day => day.videos || 0),
                    borderColor: '#FF6384',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    borderDash: [5, 5],
                    tension: 0.4,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Time (minutes)'
                    },
                    beginAtZero: true
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const date = Object.keys(filteredActivities)[context.dataIndex];
                            const dayData = filteredActivities[date];
                            return [
                                `Sessions: ${dayData.sessions}`,
                                `Documents Accessed: ${dayData.docs || 0}`
                            ].join('\n');
                        }
                    }
                }
            }
        }
    });
}

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
        console.log("ab id ayegi");
        console.log(studentId);
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
                        <p>${student.studentId || 'ID not specified'}</p>
                        <p class="text-sm text-secondary">${student.email || 'Email not specified'}</p>
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
                    Phone : ${formatDate(student.phone)}
                </div>
            </div>
        </div>
    `).join('');
}

// Student detail rendering
async function loadStudentDetails(studentId) {
    currentStudent = await fetchStudentDetails(studentId);
    console.log("ye aya student fetch hoke");
    console.log(currentStudent);
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
                        <li><span class="label">DOB:</span> <span class="value">${personal.dob || 'N/A'}</span></li>
                        <li><span class="label">Gender:</span> <span class="value">${personal.gender || 'N/A'}</span></li>
                        <li><span class="label">Country:</span> <span class="value">${personal.country || 'N/A'}</span></li>
                        <li><span class="label">Phone:</span> <span class="value">${personal.phone || 'N/A'}</span></li>
                    </ul>
                </div>
                <div class="detail-section">
                    <h4>Professional Information</h4>
                    <ul class="detail-list">
                        <li><span class="label">Role:</span> <span class="value">${professional.currentRole || 'N/A'}</span></li>
                        <li><span class="label">Organization:</span> <span class="value">${professional.organization || 'N/A'}</span></li>
                        <li><span class="label">Industry:</span> <span class="value">${professional.industry || 'N/A'}</span></li>
                        <li><span class="label">Experience:</span> <span class="value">${professional.experienceYears || 'N/A'} years</span></li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

function renderAcademicTab(student) {
    const container = document.getElementById('coursesContainer');
    const courses = student.Courses || [];
    console.log("le bc");
    console.log(student);
    if (courses.length === 0) {
        container.innerHTML = '<div class="text-center"><p>No courses found.</p></div>';
        return;
    }
    
    container.innerHTML = courses.map((course, index) => {
        const progress = course.total_modules > 0 
            ? Math.round((course.completed_modules / course.total_modules) * 100)
            : 0;
    const coursedetails = fetchCourseDetails(student.idx, course.course_id, index)
    console.log("lo priyanshi coursedetails");
        return `
            <div class="course-card" style="border-left: 4px solid ${course.primary_color || '#f0f0f0'};">
                <div class="course-header">
                    <div class="course-title-wrapper" >
                        <h3>${course.course_name}</h3>
                        <span class="course-code">${course.course_code}</span>
                    </div>
                    <div class="course-meta">
                        <span class="term-badge">${course.term_name}</span>
                        <span class="date-range">${formatDate(course.start_date)} - ${formatDate(course.end_date)}</span>
                    </div>
                    <div class="course-progress" onclick="toggleCourseModules('course-${index}')">
                        <span class="course-progress-text">${formatProgress(progress)}%</span>
                        <svg class="expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6,9 12,15 18,9"></polyline>
                        </svg>
                    </div>
                </div>
                <div class="course-details" id="modules-course-${index}">
                    <div class="course-info-row">
                        <div class="course-info">
                            <h4>Skillset</h4>
                            <p>${course.course_skillset_name} (${course.course_skillset_code})</p>
                        </div>
                        <div class="course-info">
                            <h4>Instructor</h4>
                            <p>${course.teacher_name}</p>
                        </div>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar" 
                            style="width: ${progress}%; 
                                    background-color: #2c3e50;">
                        </div>
                    </div>
                    <div class="modules-summary">
                        <span>Modules completed: ${course.completed_modules} of ${course.total_modules}</span>
                    </div>
                    ${renderActivities(course.activities || [])}
                    <div id="course-details-${index}" class="course-modules-details"></div>
                </div>
            </div>
        `;
    }).join('');
}

async function fetchCourseDetails(studentId, courseId, index) {
    try {
        const response = await fetch(`${API_BASE}/students/${studentId}/courses/${courseId}`);
        
        const data = await response.json();
        
        console.log("hogya fetch priyanshiiiiiiiiiiii");
        //console.log(data);
        if (data.success) {
            renderCourseDetails(data.data, index);
        } else {
            console.error('Failed to fetch course details:', data.message);
        }
    } catch (error) {
        console.error('Error fetching course details:', error);
    }
}

function renderCourseDetails(courseData, index) {
    const container = document.getElementById(`course-details-${index}`);
    const course = courseData.courses[0]; // Assuming first course is the one we want
    
    container.innerHTML = `
        <div class="course-modules-container">
            <h4>Course Modules</h4>
            <div class="modules-list">
                ${course.children.map(module => `
                    <div class="module-item">
                        <div class="module-header" onclick="toggleModuleDetails(this)">
                            <h5>${module.name}</h5>
                            <span class="module-status ${module.is_completed ? 'completed' : 'incomplete'}">
                                ${module.is_completed ? '✓' : '✗'}
                            </span>
                        </div>
                        <div class="module-content">
                            ${module.children ? `
                                <div class="module-resources">
                                    ${module.children.map(resource => `
                                        <div class="resource-item">
                                            <span class="resource-name">${resource.name}</span>
                                            <span class="resource-meta">
                                                ${resource.time_spent ? `${resource.time_spent} mins` : ''}
                                                ${resource.attempted_marks ? `| Score: ${resource.attempted_marks}${resource.total_points ? `/${resource.total_points}` : ''}` : ''}
                                            </span>
                                            <span class="resource-status ${resource.is_completed ? 'completed' : 'incomplete'}">
                                                ${resource.is_completed ? '✓' : '✗'}
                                            </span>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Add toggle functionality
function toggleModuleDetails(header) {
    const content = header.nextElementSibling;
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
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
    // Check if activities is an array (new structure) or object (old structure)
    if (!activities || (Array.isArray(activities) && activities.length === 0)) {
        return '<div class="no-activities">No recent activities</div>';
    }

    // Handle the array structure from your backend
    if (Array.isArray(activities)) {
        // Group activities by type if needed, or just display them sequentially
        return `
            <div class="recent-activities">
                <h4>Recent Activities</h4>
                ${activities.map(activity => `
                    <div class="activity-item">
                        <span class="activity-dot"></span>
                        <div class="activity-content">
                            <p>Course activity on ${new Date(activity.updated_at).toLocaleDateString()}</p>
                            <small>${new Date(activity.updated_at).toLocaleTimeString()}</small>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Fallback for old object structure (if you still need it)
    const activityTypes = Object.keys(activities);
    if (activityTypes.length === 0) return '<p class="text-sm text-secondary">No activities available</p>';
    
    return `
        <div class="activities-grid">
            ${activityTypes.map(type => {
                const items = Array.isArray(activities[type]) ? activities[type] : [activities[type]];
                return `
                    <div class="activity-group">
                        <h5>${type}</h5>
                        <div class="activity-scores">
                            ${items.map(score => `
                                <span class="score-badge">${score}</span>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderEngagementTab(student) {
    const engagement = student['engagementMetrics'] || {};
    const platform = engagement['platformEngagement'] || {};
    const content = engagement['contentInteraction'] || {};
    
    // Set default date range (last 7 days)
    const defaultRange = getDateRange(7);
    renderDailyActivityChart(student, defaultRange.startDate, defaultRange.endDate);
    
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
// Updated toggle function for the new course structure
function toggleCourseModules(courseId) {
    const modulesElement = document.getElementById(`modules-${courseId}`);
    const header = modulesElement.previousElementSibling;
    const expandIcon = header.querySelector('.expand-icon');
    
    // Toggle expanded state
    modulesElement.classList.toggle('expanded');
    header.classList.toggle('expanded');
    expandIcon.classList.toggle('expanded');
    
    // Smooth height transition
    if (modulesElement.classList.contains('expanded')) {
        modulesElement.style.maxHeight = modulesElement.scrollHeight + 'px';
    } else {
        modulesElement.style.maxHeight = '0';
    }
}

// You might also want to add this helper function for animations
function animateHeight(element, from, to) {
    element.style.transition = 'max-height 0.3s ease';
    element.style.maxHeight = from;
    // Force reflow to trigger the transition
    void element.offsetHeight;
    element.style.maxHeight = to;
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
    
    // Add event listeners for the filter buttons
    document.querySelectorAll('[data-range]').forEach(button => {
        button.addEventListener('click', function() {
            const days = parseInt(this.dataset.range);
            const range = getDateRange(days);
            document.getElementById('startDate').value = formatDateForInput(range.startDate);
            document.getElementById('endDate').value = formatDateForInput(range.endDate);
            if (currentStudent) {
                renderDailyActivityChart(currentStudent, range.startDate, range.endDate);
            }
        });
    });

    document.getElementById('applyDateRange')?.addEventListener('click', function() {
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        
        if (startDate && endDate && startDate <= endDate && currentStudent) {
            renderDailyActivityChart(currentStudent, startDate, endDate);
        } else {
            showToast('Please select a valid date range', 'error');
        }
    });

    // Initialize date inputs with default range (last 7 days)
    const defaultRange = getDateRange(7);
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (startDateInput && endDateInput) {
        startDateInput.value = formatDateForInput(defaultRange.startDate);
        endDateInput.value = formatDateForInput(defaultRange.endDate);
    }
});

// Handle initial route
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleRouteChange);
} else {
    handleRouteChange();
}
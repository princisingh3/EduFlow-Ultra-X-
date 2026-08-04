/* ==========================
EduFlow Ultra X 🚀
Script: stabilized button wiring + feature fixes
- Ensures all referenced DOM elements are selected
- Uses localStorage for notes, tasks, study goals, CGPA
- Fixes Pomodoro timer rendering
- Adds safe guards & Console logs for easier debugging
========================== */

document.addEventListener('DOMContentLoaded', () => {
  // Element references (safe lookup)
  const notesArea = document.getElementById('notesArea');
  const saveNotesBtn = document.getElementById('saveNotes');
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTask');
  const taskList = document.getElementById('taskList');
  const calcAttendanceBtn = document.getElementById('calcAttendance');
  const attendedInput = document.getElementById('attended');
  const totalInput = document.getElementById('total');
  const attendanceOutput = document.getElementById('attendanceOutput');
  const attendanceResult = document.getElementById('attendanceResult');
  const cgpaInput = document.getElementById('cgpaInput');
  const saveCgpaBtn = document.getElementById('saveCGPA');
  const cgpaOutput = document.getElementById('cgpaOutput');
  const cgpaDisplay = document.getElementById('cgpaDisplay');
  const studyInput = document.getElementById('studyTask');
  const addStudyBtn = document.getElementById('addStudyTask');
  const studyList = document.getElementById('studyList');
  const startTimerBtn = document.getElementById('startTimer');
  const resetTimerBtn = document.getElementById('resetTimer');
  const timerDisplay = document.getElementById('timer');
  const examDateInput = document.getElementById('examDate');
  const calculateExamBtn = document.getElementById('calculateExam');
  const examResult = document.getElementById('examResult');
  const themeToggle = document.getElementById('themeToggle');
  const noteCountEl = document.getElementById('noteCount');
  const taskCountEl = document.getElementById('taskCount');

  // Local state
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  let studyTasks = JSON.parse(localStorage.getItem('studyTasks') || '[]');
  let pomodoroInterval = null;
  const POMODORO_DEFAULT = 25 * 60; // seconds
  let pomodoroRemaining = POMODORO_DEFAULT;

  // --- Helpers ---
  function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function showMessage(targetEl, text) {
    // prefer targetEl; fallback to alert
    if (targetEl && typeof targetEl.textContent !== 'undefined') {
      targetEl.textContent = text;
      // clear after 4s
      setTimeout(() => {
        if (targetEl.textContent === text) targetEl.textContent = '';
      }, 4000);
    } else {
      console.log(text);
    }
  }

  // --- Notes ---
  // load saved notes
  const savedNotes = localStorage.getItem('notes');
  if (savedNotes && notesArea) notesArea.value = savedNotes;

  if (saveNotesBtn && notesArea) {
    saveNotesBtn.addEventListener('click', () => {
      localStorage.setItem('notes', notesArea.value);
      updateDashboard();
      showMessage(null, 'Notes saved ✓');
    });
  }

  if (notesArea) {
    notesArea.addEventListener('input', () => {
      // auto-save on input
      localStorage.setItem('notes', notesArea.value);
      updateDashboard();
    });
  }

  // --- Tasks (To-Do) ---
  function renderTasks() {
    if (!taskList) return;
    taskList.innerHTML = '';
    tasks.forEach((t, idx) => {
      const li = document.createElement('li');
      li.textContent = t;
      const del = document.createElement('button');
      del.textContent = '✖';
      del.className = 'small-btn';
      del.addEventListener('click', () => {
        tasks.splice(idx, 1);
        saveToStorage('tasks', tasks);
        renderTasks();
        updateDashboard();
      });
      li.appendChild(del);
      taskList.appendChild(li);
    });
  }

  if (addTaskBtn && taskInput) {
    addTaskBtn.addEventListener('click', () => {
      const txt = taskInput.value.trim();
      if (!txt) return showMessage(null, 'Enter a task');
      tasks.push(txt);
      saveToStorage('tasks', tasks);
      taskInput.value = '';
      renderTasks();
      updateDashboard();
      showMessage(null, 'Task added ✓');
    });
  }

  // Enter key to add task
  if (taskInput) {
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTaskBtn && addTaskBtn.click();
      }
    });
  }

  // initial render
  renderTasks();

  // --- Attendance ---
  if (calcAttendanceBtn) {
    calcAttendanceBtn.addEventListener('click', () => {
      const attended = parseInt(attendedInput && attendedInput.value, 10);
      const total = parseInt(totalInput && totalInput.value, 10);
      if (isNaN(attended) || isNaN(total) || total <= 0) {
        alert('Enter valid values');
        return;
      }
      const percent = ((attended / total) * 100).toFixed(2);
      if (attendanceOutput) attendanceOutput.textContent = `${percent}% Attendance`;
      if (attendanceResult) attendanceResult.textContent = `${percent}%`;
    });
  }

  // --- CGPA ---
  const savedCGPA = localStorage.getItem('cgpa');
  if (savedCGPA && cgpaDisplay) {
    cgpaDisplay.textContent = savedCGPA;
    if (cgpaOutput) cgpaOutput.textContent = `CGPA : ${savedCGPA}`;
  }

  if (saveCgpaBtn && cgpaInput) {
    saveCgpaBtn.addEventListener('click', () => {
      const val = parseFloat(cgpaInput.value);
      if (isNaN(val)) return showMessage(cgpaOutput, 'Enter valid CGPA');
      localStorage.setItem('cgpa', val.toFixed(2));
      if (cgpaDisplay) cgpaDisplay.textContent = val.toFixed(2);
      if (cgpaOutput) cgpaOutput.textContent = `CGPA : ${val.toFixed(2)}`;
      showMessage(null, 'CGPA saved ✓');
      updateDashboard();
    });
  }

  // --- Study Planner ---
  function renderStudy() {
    if (!studyList) return;
    studyList.innerHTML = '';
    studyTasks.forEach((t, idx) => {
      const li = document.createElement('li');
      li.textContent = t;
      const del = document.createElement('button');
      del.textContent = '✖';
      del.className = 'small-btn';
      del.addEventListener('click', () => {
        studyTasks.splice(idx, 1);
        saveToStorage('studyTasks', studyTasks);
        renderStudy();
        updateDashboard();
      });
      li.appendChild(del);
      studyList.appendChild(li);
    });
  }

  if (addStudyBtn && studyInput) {
    addStudyBtn.addEventListener('click', () => {
      const txt = studyInput.value.trim();
      if (!txt) return showMessage(null, 'Enter a study goal');
      studyTasks.push(txt);
      saveToStorage('studyTasks', studyTasks);
      studyInput.value = '';
      renderStudy();
      updateDashboard();
      showMessage(null, 'Goal added ✓');
    });
  }

  if (studyInput) {
    studyInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addStudyBtn && addStudyBtn.click();
      }
    });
  }

  renderStudy();

  // --- Pomodoro ---
  function formatTime(sec) {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function updateTimerDisplay() {
    if (timerDisplay) timerDisplay.textContent = formatTime(pomodoroRemaining);
  }

  function startPomodoro() {
    if (pomodoroInterval) return; // already running
    pomodoroInterval = setInterval(() => {
      pomodoroRemaining -= 1;
      if (pomodoroRemaining <= 0) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
        pomodoroRemaining = POMODORO_DEFAULT;
        showMessage(null, 'Pomodoro finished');
      }
      updateTimerDisplay();
    }, 1000);
    showMessage(null, 'Pomodoro started');
  }

  function resetPomodoro() {
    if (pomodoroInterval) {
      clearInterval(pomodoroInterval);
      pomodoroInterval = null;
    }
    pomodoroRemaining = POMODORO_DEFAULT;
    updateTimerDisplay();
    showMessage(null, 'Pomodoro reset');
  }

  if (startTimerBtn) startTimerBtn.addEventListener('click', startPomodoro);
  if (resetTimerBtn) resetTimerBtn.addEventListener('click', resetPomodoro);
  updateTimerDisplay();

  // --- Exam Countdown ---
  if (calculateExamBtn && examDateInput) {
    calculateExamBtn.addEventListener('click', () => {
      const val = examDateInput.value;
      if (!val) return showMessage(examResult, 'Choose a date');
      const then = new Date(val);
      const now = new Date();
      const diffMs = then - now;
      if (diffMs <= 0) return showMessage(examResult, 'Date must be in future');
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (examResult) examResult.textContent = `${days} day(s) remaining`;
    });
  }

  // --- Theme Toggle ---
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      showMessage(null, 'Theme toggled');
    });
  }

  // --- Dashboard ---
  function updateDashboard() {
    if (noteCountEl) noteCountEl.textContent = (notesArea && notesArea.value.trim()) ? '1' : '0';
    if (taskCountEl) taskCountEl.textContent = String(tasks.length);
  }

  updateDashboard();

  // --- Service worker registration (safe) ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js').catch((err) => console.log('SW reg failed', err));
    });
  }

  // Save initial state back to storage (ensure consistency)
  saveToStorage('tasks', tasks);
  saveToStorage('studyTasks', studyTasks);
});

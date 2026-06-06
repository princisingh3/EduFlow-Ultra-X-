/* ==========================
EduFlow Ultra X 🚀
Fixes
========================== */

// Attendance Validation

calcAttendance.addEventListener("click",()=>{

let attended =
parseInt(document.getElementById("attended").value);

let total =
parseInt(document.getElementById("total").value);

if(
    isNaN(attended) ||
    isNaN(total) ||
    total <= 0
){
    alert("Enter valid values");
    return;
}

let percent =
((attended/total)*100).toFixed(2);

document.getElementById(
"attendanceOutput"
).innerHTML =
percent + "% Attendance";

document.getElementById(
"attendanceResult"
).innerHTML =
percent + "%";

});

// Pomodoro Timer Fix

timerDisplay.innerHTML =
"${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}";

// Dashboard Fix

function updateDashboard(){

document.getElementById(
"noteCount"
).innerHTML =
notesArea.value.trim() ? 1 : 0;

document.getElementById(
"taskCount"
).innerHTML =
tasks.length;

}

// CGPA Auto Load

const savedCGPA =
localStorage.getItem("cgpa");

if(savedCGPA){

document.getElementById(
"cgpaDisplay"
).innerHTML =
savedCGPA;

document.getElementById(
"cgpaOutput"
).innerHTML =
"CGPA : " + savedCGPA;

}

// Auto Save Notes

notesArea.addEventListener("input",()=>{

localStorage.setItem(
"notes",
notesArea.value
);

updateDashboard();

});

// Enter Key Add Task

taskInput.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

    addTaskBtn.click();

}

});

// Enter Key Add Goal

studyInput.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

    addStudyTask.click();

}

});
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}

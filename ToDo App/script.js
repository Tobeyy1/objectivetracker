"use strict";
let touchtime = 0;
let counter = [0, 0];
let percentageCounter = 100;
let value, html, objectives, progressNumber;
let number = document.querySelector("#number");
let progressBar = document.querySelector(".progressBar");
let text, task, content, time, actions, edit, done, deleted, blurr;

const root = document.querySelector(":root");
const editBtn = document.querySelector(".edit");
const curTask = document.querySelector(".task");
const doneBtn = document.querySelector(".done");
const delBtn = document.querySelector(".deleted");
const add = document.querySelector("#submitIcon");
const tasksList = document.querySelector("#tasks");
const taskContent = document.querySelector("#text");
const addTask = document.querySelector(".SubmitNewTask");
const newTaskInput = document.querySelector("#newTaskInput");
const themeToggler = document.querySelector(".themeToggler");

////////////////////// TIME //////////////////////////////////////////////
console.log;
const options = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
};
const currentTime = new Intl.DateTimeFormat(navigator.language, options).format(
  new Date()
);

//Get Local Storage Items when document loads
document.addEventListener("DOMContentLoaded", getLocal);

//////////////////////// ADD TASK ////////////////////////////////////////////////
[add, addTask].forEach((cur) => {
  cur.addEventListener("click", function (e) {
    e.preventDefault();
    let text, task, content, time, actions, edit, done, deleted, blurr;
    value = newTaskInput.value;
    saveLocal(newTaskInput.value);

    //GUARD CLAUSE
    if (!newTaskInput.value) {
      console.log(newTaskInput.value);
      alert("Input a Task!");
      return;
    }
    /////////////// CREATING THE HTML //////////////////////////////////
    renderHTML(value);
    // value = newTaskInput.value;
    counter[0]++;
    newTaskInput.value = "";
    ////////////// RENDER FUNCTIONS /////////////////////////////
    renderProgressNumber();
    renderProgressBar();

    function renderProgressNumber() {
      progressNumber = Math.round(
        (tasksList.getElementsByClassName("completed").length /
          tasksList.childElementCount) *
          100
      );
      number.textContent = "";
      if (tasksList.childElementCount == 1) {
        if (tasksList.getElementsByClassName("completed").length == 1) {
          number.textContent = `${progressNumber}%`;
        } else {
          number.textContent = "0%";
        }
      } else if (tasksList.childElementCount > 1) {
        progressNumber = Math.round(
          (tasksList.getElementsByClassName("completed").length /
            tasksList.childElementCount) *
            100
        );
        number.innerText = `${progressNumber}%`;
        console.log(
          `${tasksList.getElementsByClassName("completed").length} numerator`
        );
        console.log(`${tasksList.childElementCount} denominator`);
        console.log(`answer: ${number.innerText}`);
      }
    }

    function renderProgressBar() {
      if (document.querySelector("body").classList.contains("darkMode"))
        document
          .querySelector(".darkMode")
          .style.setProperty("--width", `${number.innerText}`);

      root.style.setProperty("--width", `${number.innerText}`);
      // progressBar.style.width = number.innerText;
      let offSet = +progressNumber;
      console.log(offSet);
      // prettier-ignore
      document.querySelector("circle").style.strokeDashoffset = `${
        1065 - (1065 * (offSet / 100))
      }`;

      console.log(document.querySelector("circle").style.strokeDashoffset);
      // ==============End of Renders ================================
    }
  });
});

/////////////// THEME TOGGLER ////////////////////////////
themeToggler.addEventListener("click", function () {
  document.body.classList.toggle("darkMode");
});

// ////////////////////////////////////////////////////////////////////////
// ================== LOCAL STORAGE FUNCTIONS ==============================
// /////////////////////////////////////////////////////////////////////////
function saveLocal(objective, pos) {
  localStorageVerificator();
  // objectives.push(objective);
  (objectives[pos] = objective) ?? objectives.push(objective);
  localStorage.setItem("objectives", JSON.stringify(objectives));
}

function getLocal() {
  let text, task, content, time, actions, edit, done, deleted, blurr;
  localStorageVerificator();
  objectives.forEach(function (objective) {
    renderHTML(objective);
  });
}

function deleteLocal(objective) {
  localStorageVerificator();
  const objectiveElement = objective.children[0].children[0].value;
  console.log(objectiveElement);
  objectives.splice(objectives.indexOf(objectiveElement), 1);
  localStorage.setItem("objectives", JSON.stringify(objectives));
}

document.querySelector(".reset").addEventListener("click", function () {
  localStorage.clear("objectives");
  window.location.reload();
});

function localStorageVerificator() {
  if (localStorage.getItem("objectives") === null) {
    //If not present, create
    objectives = [];
  } else {
    //if present, get all data
    objectives = JSON.parse(localStorage.getItem("objectives"));
  }
}
// ========== LOCAL STORAGE END =========================

// //////////////////////////////////////////////////////////////////////
// |||||||||||||||||| RENDER HTML ||||||||||||||||||||||||||||||||||||||
// //////////////////////////////////////////////////////////////////////
function renderHTML(innerText) {
  let text, task, content, time, actions, edit, done, deleted, blurr;

  //Task
  task = document.createElement("div");
  task.setAttribute("id", `task${counter[1]}`);
  task.classList.add("task");
  tasksList.appendChild(task);
  //Content
  content = document.createElement("div");
  content.classList.add("content");
  task.appendChild(content);
  //Text
  text = document.createElement("input");
  text.classList.add("text");
  text.value = innerText;
  text.setAttribute("readonly", "readonly");
  content.appendChild(text);
  //Time
  time = document.createElement("div");
  time.classList.add("time");
  time.innerText = currentTime;
  content.appendChild(time);
  //Actions
  actions = document.createElement("div");
  actions.classList.add("actions");
  task.appendChild(actions);
  //Edit
  edit = document.createElement("button");
  edit.classList.add(`edit`);
  edit.setAttribute("id", `edit${counter[1]}`);
  edit.innerHTML = '<span class="material-icons-sharp">edit</span>';
  actions.appendChild(edit);
  //Done
  done = document.createElement("button");
  done.classList.add("done");
  done.setAttribute("id", `done${counter[1]}`);
  done.innerHTML = '<span class="material-icons-sharp">task_alt</span>';
  actions.appendChild(done);
  //Deleted
  deleted = document.createElement("button");
  deleted.classList.add("deleted");
  deleted.setAttribute("id", `deleted${counter[1]}`);
  deleted.innerHTML =
    '<span class="material-icons-sharp">delete_forever</span>';
  actions.appendChild(deleted);
  //blur and completed
  blurr = document.createElement("div");
  blurr.textContent = "Double Tap to Undo ✅";
  blurr.classList.add("blurr");
  task.appendChild(blurr);

  // =================================================
  // ---- Event Listeners --------------
  // =================================================
  edit.addEventListener("click", edited);

  done.addEventListener("click", accomplished);

  deleted.addEventListener("click", removed);

  blurr.addEventListener("click", blurred);
  // -----------------End of Event Listeners----------------------

  // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  //============= Event Listener Functions======================
  let x = [0];
  function edited() {
    if (edit.innerHTML == '<span class="material-icons-sharp">edit</span>') {
      text.removeAttribute("readonly");
      text.focus();
      text.style.background = "white";
      edit.innerHTML = '<span class="material-icons-sharp">bookmark</span>';
      x[0] = objectives.indexOf(text.value);
    } else {
      saveLocal(text.value, x[0]);
      text.setAttribute("readonly", "readonly");
      text.style.background = "transparent";
      edit.innerHTML = '<span class="material-icons-sharp">edit</span>';
      x[0] = 0;
    }
  }

  function accomplished() {
    blurr.classList.add("completed");
    renderProgressNumber();
    renderProgressBar();
    counter[0]--;
  }

  function removed() {
    deleteLocal(task);
    tasksList.removeChild(task);
    renderProgressNumber();
    renderProgressBar();
    counter[0]--;
  }

  function blurred() {
    if (touchtime == 0) {
      // set first click
      touchtime = new Date().getTime();
    } else {
      // compare first click to this click and see if they occurred within double click threshold
      if (new Date().getTime() - touchtime < 800) {
        // double click occurred
        blurr.classList.remove("completed");
        console.log("it works");
        counter[0]++;
        renderProgressNumber();
        renderProgressBar();
        touchtime = 0;
      } else {
        // not a double click so set as a new first click
        touchtime = new Date().getTime();
      }
    }
  }

  // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  ////////////// RENDER FUNCTIONS /////////////////////////////
  // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  function renderProgressNumber() {
    progressNumber = Math.round(
      (tasksList.getElementsByClassName("completed").length /
        tasksList.childElementCount) *
        100
    );
    number.textContent = "";
    if (tasksList.childElementCount == 1) {
      if (tasksList.getElementsByClassName("completed").length == 1) {
        number.textContent = `${progressNumber}%`;
      } else {
        number.textContent = "0%";
      }
    } else if (tasksList.childElementCount > 1) {
      progressNumber = Math.round(
        (tasksList.getElementsByClassName("completed").length /
          tasksList.childElementCount) *
          100
      );
      number.innerText = `${progressNumber}%`;
    }
  }

  function renderProgressBar() {
    if (document.querySelector("body").classList.contains("darkMode"))
      document
        .querySelector(".darkMode")
        .style.setProperty("--width", `${number.innerText}`);

    root.style.setProperty("--width", `${number.innerText}`);
    // progressBar.style.width = number.innerText;
    let offSet = +progressNumber;
    // prettier-ignore
    document.querySelector("circle").style.strokeDashoffset = `${
      1065 - (1065 * (offSet / 100))
    }`;

    // ==============End of Renders ================================
  }
  counter[1]++;
}

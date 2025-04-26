import { useState, useEffect } from "react";
import "./style.css";
import "./tasks.css";
import "./container.css";
import Form from "./Form";

// localStorage.removeItem(`tasks`);

let count = 0;
let edit = 0;

const getLocalTasks = () => {
  let list = localStorage.getItem(`tasks`);

  if (list) return JSON.parse(list);
  else return [];
};

let clickTimeout;
let CLICK_DELAY = 250;

export default function Todoo() {
  let [task, setTask] = useState(``);
  let [tasks, setTasks] = useState(getLocalTasks());

  // Handle Form

  // change in input field
  function handleFormChange(e) {
    setTask(e.target.value);
  }

  // submit form
  function handleFormSubmit(e) {
    e.preventDefault();
    if (task == ``) {
      return handleFormError(e);
    }
    setTasks([
      ...tasks,
      { id: new Date().toISOString(), name: task, done: 0, pin: 0 },
    ]);
    setTask(``);
  }

  function calcErrorMessage() {
    return document
      .querySelector(`.form`)
      .querySelector(`.form__input`)
      .querySelector(`.message--error`);
  }

  function handleFormClick(e) {
    const errorMessage = calcErrorMessage();
    if (!errorMessage.classList.contains(`hidden`))
      errorMessage.classList.add(`hidden`);
    if (e.target.classList.contains(`form__input--error`))
      e.target.classList.remove(`form__input--error`);
  }

  function handleFormError(e) {
    const form = e.target.closest(`.form`);
    const input = form.querySelector(`.form__input`);
    const inputTask = input.querySelector(`.form__input--task`);
    const errorMessage = calcErrorMessage();

    inputTask.classList.add(`form__input--error`);
    errorMessage.classList.remove(`hidden`);
  }

  // Handle Tasks

  function handleTaskClick(e) {
    const clickedEl = e.target.closest(`.task--details`);

    clickedEl.classList.toggle(`task--done`);

    tasks.forEach(function (task) {
      if (clickedEl.value === task.id) task.done ^= 1;
    });

    setTasks([...tasks]);
  }

  function handleTaskDoubleClick(e) {
    const clickedEl = e.target.closest(`.task--details`);
    clickedEl.classList.toggle(`task--pin`);

    tasks.forEach(function (task) {
      if (clickedEl.value === task.id) {
        task.pin ^= 1;
      } else task.pin = 0;
    });

    const idx = tasks.findIndex((task) => task.id === clickedEl.value);

    if (tasks[idx].pin !== 0)
      for (let i = idx; i >= 1; i--)
        [tasks[i], tasks[i - 1]] = [tasks[i - 1], tasks[i]];

    setTasks([...tasks]);
  }

  function handleTaskUp(e) {
    // if already the first element
    const taskId = e.target.value;
    if (taskId === tasks[0].id) return;

    const idx = tasks.findIndex((task) => task.id === taskId);
    [tasks[idx], tasks[idx - 1]] = [tasks[idx - 1], tasks[idx]];
    setTasks([...tasks]);
  }

  function handleTaskDown(e) {
    const taskId = e.target.value;
    if (taskId === tasks[tasks.length - 1].id) return;

    const idx = tasks.findIndex((task) => task.id === taskId);
    [tasks[idx], tasks[idx + 1]] = [tasks[idx + 1], tasks[idx]];
    setTasks([...tasks]);
  }

  function handleTaskEdit(e) {
    const inputTask = document.querySelector(`.form__input--task`);
    inputTask.value = e.target.name;
    inputTask.focus();
    setTask(inputTask.value);
    handleTaskDelete(e);
  }

  function handleTaskDelete(e) {
    const taskToDelete = tasks.find((val) => {
      return val.id === e.target.value;
    });
    setTasks(tasks.filter((val) => val.id !== taskToDelete.id));
  }

  document.body.addEventListener(`keydown`, function (e) {
    if (e.key === `Delete`) {
      if (!e.target.closest(`.task`)) {
        if (tasks.length > 0) {
          const dummyTasks = tasks;
          dummyTasks.pop();
          setTasks(dummyTasks);
        }
        return;
      }
      setTasks(
        tasks.filter((val) => {
          return (
            val.id !==
            e.target.closest(`.task`).querySelector(`.task--name`).value
          );
        })
      );
    }
    if (e.key === `ArrowUp`) {
      if (!e.target.closest(`.task`)) return;
      handleTaskUp(e);
    }
    if (e.key === `ArrowDown`) {
      if (!e.target.closest(`.task`)) return;
      handleTaskDown(e);
    }
  });

  // function addPin(clickedTask, clickedEl)
  //   clickedEl.classList.add(`task--pin`);
  //   clickedTask.pin = 1;
  //   // clickedEl.insertAdjacentHTML(
  //   //   `afterbegin`,
  //   //   `<span><img src = `https://winaero.com/blog/wp-content/uploads/2013/09/Pin.png` alt=`pin-img` width=`40px`/></span>`
  //   // );
  // }

  // count the number of completed tasks
  const countDoneTasks = (arr) => {
    if (arr.length === 0) return 0;
    else return tasks.reduce((task, val) => task + val.done, 0);
  };

  // function celebrate() {
  //   const confettiContainer = document.getElementById(`confetti-container`);

  //   for (let i = 0; i < 50; i++) {
  //     const confetti = document.createElement(`div`);
  //     confetti.className = `confetti`;
  //     confetti.style.left = Math.random() * 100 + `vw`;
  //     confetti.style.animationDuration = Math.random() * 3 + 2 + `s`;
  //     confettiContainer.appendChild(confetti);
  //   }
  // }

  // whenever there is change in tasks array add that task to local storage

  useEffect(() => {
    localStorage.setItem(`tasks`, JSON.stringify(tasks));
  }, [tasks]);

  function formatDate(date) {
    if (new Date().toISOString().slice(0, 10) === date.slice(0, 10))
      return ` Today`;
    else if (
      new Date().toISOString().slice(0, 10) ===
      date.slice(0, 10) - 24 * 60 * 60
    )
      return ` Yesterday`;
    else
      return `
    ${`${new Date(date).getDate()}`.padStart(2, 0)} / 
    ${`${new Date(date).getMonth() + 1}`.padStart(2, 0)} / 
    ${new Date(date).getFullYear()}`;
  }

  function handleTasksSort() {
    let dummyTasks = tasks;

    // // sort in both orders
    // dummyTasks.sort((a, b) => {
    //   return sort === 0
    //     ? a[this].localeCompare(b[this])
    //     : b[this].localeCompare(a[this]);
    // });
    // setTasks(dummyTasks);
    // setSort(1 - sort);

    // only increasing
    dummyTasks.sort((a, b) => {
      if (a.pin === 1 || b.pin === 1) return;
      else a[this].localeCompare(b[this]);
    });
    setTasks([...dummyTasks]);
  }

  return (
    <div className={`container`}>
      {/* <button onClick={celebrate}>Complete Task</button>
      <div id=`confetti-container`></div> */}
      <h1>ToDo App</h1>
      <Form
        handleFormChange={handleFormChange}
        handleFormSubmit={handleFormSubmit}
        handleFormClick={handleFormClick}
        task={task}
      ></Form>
      <div className={`tasks__completed`}>
        <h3>{`TASKS COMPLETED: `}</h3>
        <span className={`tasks__completed--number`}>
          {`${countDoneTasks(tasks)} / ${tasks.length}`}
        </span>
      </div>
      <div className="task__alert--delete hidden">
        Are you sure! <br />
        <span className="task__alert--options">
          <button className="button--mini button--yes">Yes</button>
          <button className="button--mini button--no">No</button>
        </span>
      </div>
      <div className="task__container">
        <ul className={`tasks`}>
          {tasks.map((val) => {
            return (
              <>
                <li key={val.id} className={`task task-${val.id}`}>
                  <button
                    className={`button task--details 
                      ${val.done == 1 ? `task--done ` : ``}
                      ${val.pin == 1 ? `task--pin ` : ``}`}
                    value={val.id}
                    onClick={handleTaskClick}
                    onDoubleClick={handleTaskDoubleClick}
                    name={`${val.name}`}
                  >
                    {val.pin === 1 ? <span> 📌 </span> : ``}
                    {val.done === 1 ? <span> 🎉 Task completed</span> : ``}
                    <span className={`task--name`}>{val.name}</span>
                    <span className={`task--date-added`}>
                      Date added:{formatDate(val.id)}
                    </span>
                  </button>
                  <button
                    className={`button task--up`}
                    value={val.id}
                    onClick={handleTaskUp}
                  >
                    up
                  </button>{" "}
                  <button
                    className={`button task--down`}
                    value={val.id}
                    onClick={handleTaskDown}
                    name={`${val.name}`}
                  >
                    down
                  </button>
                  <button
                    className={`button task--edit`}
                    value={val.id}
                    onClick={handleTaskEdit}
                    name={`${val.name}`}
                  >
                    edit
                  </button>
                  <button
                    className={`button task--delete`}
                    value={val.id}
                    onClick={handleTaskDelete}
                    name={`${val.name}`}
                  >
                    X
                  </button>
                </li>
              </>
            );
          })}
          <div className="sort__container">
            <button
              className={`button tasks--sort`}
              onClick={handleTasksSort.bind("name")}
            >
              Sort
            </button>
          </div>
        </ul>
      </div>
    </div>
  );
}

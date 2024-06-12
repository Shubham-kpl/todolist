import { useState, useEffect } from "react";
import "./style.css";
import "./tasks.css";
import Form from "./Form";

// localStorage.removeItem(`tasks`);

let count = 0;

const getLocalTasks = () => {
  let list = localStorage.getItem(`tasks`);

  if (list) return JSON.parse(list);
  else return [];
};

export default function ToDoApp() {
  const [task, setTask] = useState(``);
  const [tasks, setTasks] = useState(getLocalTasks());
  const [sort, setSort] = useState(0);

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
    // console.log(tasks);
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

    if (clickedEl.pin === 1) return;

    if (!clickedEl.classList.contains(`task--done`)) {
      clickedEl.classList.add(`task--done`);
      tasks.forEach(function (val) {
        if (e.target.value === val.id) val.done = 1;
      });
    } else {
      // console.log(clickedEl.value);
      clickedEl.classList.remove(`task--done`);
      tasks.forEach(function (val) {
        if (clickedEl.value === val.id) val.done = 0;
      });
    }
    setTasks([...tasks]);
  }

  function handleTaskDoubleClick(e) {
    const clickedEl = e.target.closest(`.task--details`);

    const clickedTask = tasks.find((val) => val.id === clickedEl.value);
    // if(clickedTask.done === 1)
    // console.log(clickedTask.pin);

    if (clickedTask.pin === 1) {
      clickedTask.pin = 0;
      clickedEl.classList.remove(`task--pin`);
      // clickedEl.firstElementChild.remove();
    } else {
      clickedEl.classList.add(`task--pin`);
      clickedTask.pin = 1;
      // addPin(clickedTask, clickedEl);
    }
    setTasks([...tasks]);
  }

  function handleTaskUp(e) {
    // if already the first element
    if (
      e.target.parentElement === e.target.closest(`.tasks`).firstElementChild
    ) {
      return;
    }

    const value = e.target.value;

    const arr = [...e.target.closest(`.tasks`).querySelectorAll(`.task`)];

    const idx = arr.findIndex((val, i) =>
      val.classList.contains(`button-${value}`)
    );

    arr[idx - 1].insertAdjacentElement(`beforebegin`, arr[idx]);
  }

  function handleTaskDown(e) {
    if (
      e.target.parentElement === e.target.closest(`.tasks`).lastElementChild
    ) {
      return;
    }

    const value = e.target.value;

    const arr = [...e.target.closest(`.tasks`).querySelectorAll(`.task`)];

    const idx = arr.findIndex((val, i) =>
      val.classList.contains(`button-${value}`)
    );

    arr[idx + 1].insertAdjacentElement(`afterend`, arr[idx]);
  }

  function handleTaskEdit(e) {}

  function handleTaskDelete(e) {
    const taskToDelete = tasks.find((val) => {
      return val.id === e.target.value;
    });
    setTasks(tasks.filter((val) => val.id !== taskToDelete.id));
  }

  document.body.addEventListener(`keydown`, function (e) {
    // // console.log(e.key);
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

  // function addPin(clickedTask, clickedEl) {
  //   console.log(this);
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
    // console.log(new Date().toISOString().slice(0, 10), date.slice(0, 10));
    if (new Date().toISOString().slice(0, 10) === date.slice(0, 10))
      return ` Today`;
    if (
      new Date().toISOString().slice(0, 10) ===
      date.slice(0, 10) - 24 * 60 * 60
    )
      return ` Yesterday`;
    else
      return `
    ${new Date(date).getDate()} / 
    ${new Date(date).getMonth()} / 
    ${new Date(date).getFullYear()}`;
  }

  function handleTasksSort(comparer) {
    let dummyTasks = tasks;
    dummyTasks.sort((a, b) => {
      return sort === 0
        ? a[this].localeCompare(b[this])
        : b[this].localeCompare(a[this]);
    });
    setTasks(dummyTasks);
    setSort(1 - sort);
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

      <div className="task__container">
        <ul className={`tasks`}>
          {tasks.map((val) => {
            return (
              <>
                <li key={val.id} className={`task button button-${val.id}`}>
                  <button
                    className={`task--details ${
                      val.done == 1 ? `task--done` : ``
                    }  
                  ${val.pin == 1 ? `task--pin` : ``}`}
                    value={val.id}
                    onClick={handleTaskClick}
                    onDoubleClick={handleTaskDoubleClick}
                  >
                    <span className={`task--name`}>{val.name}</span>
                    <span className={`task--date-added`}>
                      Date added:{formatDate(val.id)}
                    </span>
                  </button>
                  <button
                    className={`task--up`}
                    value={val.id}
                    onClick={handleTaskUp}
                  >
                    up
                  </button>{" "}
                  <button
                    className={`task--down`}
                    value={val.id}
                    onClick={handleTaskDown}
                  >
                    down
                  </button>
                  <button
                    className={`task--edit`}
                    value={val.id}
                    onClick={handleTaskEdit}
                  >
                    edit
                  </button>
                  <button
                    className={`task--delete`}
                    value={val.id}
                    onClick={handleTaskDelete}
                  >
                    X
                  </button>
                </li>
              </>
            );
          })}
          <div className="sort__container">
            <button
              className={`tasks--sort`}
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

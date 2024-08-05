import "./style.css";
import "./form.css";
export default function ({
  handleFormChange,
  handleFormSubmit,
  handleFormClick,
  task,
}) {
  return (
    <>
      <form className="form">
        <div className="form__input">
          {/* <div className="form__input--title"> Enter task</div> */}
          <input
            value={task}
            onChange={handleFormChange}
            onClick={handleFormClick}
            name="task"
            className="form__input--task"
            autoComplete="off"
            autoFocus
            placeholder="enter a task..."
          />{" "}
          <br />
          <span className="message--error hidden">Enter a valid task</span>
        </div>{" "}
        <div className="form__submit">
          <button
            onClick={handleFormSubmit}
            className="button form__input--submit"
          >
            Add Item
          </button>
        </div>
        {/* <div className="form__input">
          <input
            type="date"
            onClick={handleFormClick}
            name="task"
            className="form__input--task"
            autoComplete="off"
            autoFocus
            placeholder="enter due date..."
          />
          Enter Due Date
          <br />
          <span className="message--error hidden">Enter a valid task</span>
        </div> */}
      </form>
    </>
  );
}

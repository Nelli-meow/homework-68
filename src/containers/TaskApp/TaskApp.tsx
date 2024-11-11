import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store.ts';
import { useEffect } from 'react';
import { fetchTask, deleteTask, addNewTask } from './TaskAppSlice.ts';

const TaskApp = () => {
  const tasks = useSelector((state: RootState) => state.task.tasks);
  const newTaskText = useSelector((state: RootState) => state.task.newTaskText);
  const isLoading = useSelector((state: RootState) => state.task.isLoading);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTask());
  }, [dispatch]);

  const onAddTask = () => {
    if (newTaskText.trim()) {
      dispatch(addNewTask(newTaskText));
    }
  };

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setNewTaskText(e.target.value));
  };


  const onDeleteTask = (id: string) => {
    dispatch(deleteTask(id));
  };

  return (
    <div className="container">
      <div className="mt-5">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={newTaskText}
              onChange={onTextChange}
              placeholder="Enter new task"
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={onAddTask}
            >
              Add Task
            </button>
          </div>
        </form>
        <hr />
        <div className="container">
          {isLoading && <div>Loading tasks...</div>}
          {tasks.map((task) => (
            <div className="my-5 border border-2 rounded p-4 d-flex align-items-center justify-content-sm-between" key={task.id}>
              <div className="d-flex align-items-center">
                <h3 className="me-3">{task.text}</h3>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                  />
                </div>
              </div>
              <button className="btn btn-outline-danger" onClick={() => onDeleteTask(task.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskApp;

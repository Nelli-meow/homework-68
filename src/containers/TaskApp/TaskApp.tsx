import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store.ts';
import { useEffect } from 'react';
import { fetchTask } from './TaskAppSlice.ts';

const TaskApp = () => {
  const {taskValue, status} = useSelector((state: RootState) => state.task);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTask());
  }, [dispatch]);

  return (
    <div className="container">
      <div className="mt-5">
        <form>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"/>
            <button
              className="btn btn-outline-secondary"
              type="button"
              >
              Button
            </button>
          </div>
        </form>
        <hr/>
        <div className="conteiner">
          <div className="my-5 border border-2 rounded p-4 d-flex align-items-center justify-content-sm-between">
            <h3>{taskValue.taskValue}</h3>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskApp;
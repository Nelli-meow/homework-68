import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '../../axiosAPI';
import { ITask } from '../../types';

interface TaskState {
  tasks: ITask[];
  newTaskText: string;
  isLoading: boolean;
  error: boolean;
}

const initialState: TaskState = {
  tasks: [],
  newTaskText: '',
  isLoading: false,
  error: false,
};

export const fetchTask = createAsyncThunk<ITask[]>('task/fetchTask', async () => {
  const { data } = await axiosApi<ITask[]>('task.json');
  console.log('Fetched tasks:', data);

  const tasksFromApi = Object.keys(data).map(taskKey => {
    const task = { ...data[taskKey] };

    return {
      id: taskKey,
      ...task,
    };
  });

  return tasksFromApi || [];
});


export const deleteTask = createAsyncThunk<string, string>('task/deleteTask', async (id: string) => {
  await axiosApi.delete(`task/${id}.json`);
  return id;
});


export const addNewTask = createAsyncThunk<ITask, string>('task/addNewTask', async (text: string) => {
  await axiosApi.post('task.json', { text, status: false });

  return { id: new Date().toISOString(), text, status: false };
});


export const TaskAppSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setNewTaskText: (state, action: PayloadAction<string>) => {
      state.newTaskText = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTask.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTask.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      })
      .addCase(addNewTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.newTaskText = '';
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export const { setNewTaskText } = TaskAppSlice.actions;
export const taskReducer = TaskAppSlice.reducer;

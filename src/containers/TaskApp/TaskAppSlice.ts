import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '../../axiosAPI';
import { ITask } from '../../types';

interface TaskState {
  tasks: ITask[];
  isLoading: boolean;
  error: boolean;
  newTaskText: string;
}

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: false,
  newTaskText: ''
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
    const newTask = { text, status: false };
    const { data } = await axiosApi.post('task.json', newTask);
    return { id: data.name, ...newTask };
  }
);

export const updateTaskStatus = createAsyncThunk<ITask, { id: string, text: string, status: boolean }>(
  'task/updateTaskStatus',
  async ({ id, text, status }) => {
    await axiosApi.put(`task/${id}.json`, { text, status });
    return { id, status };
  }
);


export const TaskAppSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setNewTaskText: (state, action: PayloadAction<string>) => {
      state.newTaskText = action.payload;
    },
    toggleTaskStatus: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.status = !task.status;
      }
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
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
      }
    });

  },
});

export const { setNewTaskText } = TaskAppSlice.actions;
export const taskReducer = TaskAppSlice.reducer;

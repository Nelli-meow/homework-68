import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '../../axiosAPI.ts';
import { RootState } from '../../app/store.ts';

interface TaskState {
  taskValue: string;
  status: boolean;
  isLoading: boolean;
  error: boolean;
}

const initialState: TaskState = {
  taskValue: '',
  status: false,
  isLoading: false,
  error: false,
};

export const fetchTask = createAsyncThunk('task/fetchTask', async () => {
  const { data: task } = await axiosApi<string | null>('task.json');
  return task ;
});

const changeTaskValue = createAsyncThunk<void, void, {state: RootState}>('task/changeTaskValue', async (_arg, thunkAPI) => {
  const currentTaskValueFromSTate = thunkAPI.getState().task.value;
  await axiosApi.put('task.json', currentTaskValueFromSTate);
});

export const TaskAppSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<string>) => {
      if (state.taskValue.length > 0) {
        state.taskValue += `, ${action.payload}`;
      } else {
        state.taskValue = action.payload;
      }
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTask.pending,(state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(fetchTask.fulfilled,(state, action) => {
      state.isLoading = false;
      state.taskValue = action.payload;
    })
      .addCase(fetchTask.rejected,(state) => {
      state.isLoading = false;
      state.error = false;
    })
      .addCase(changeTaskValue.pending,(state) => {
      state.isLoading = true;
      state.error = false;
    })
      .addCase(changeTaskValue.fulfilled,(state, action) => {
        state.isLoading = false;
        state.taskValue = action.payload;
      })
      .addCase(changeTaskValue.rejected,(state) => {
        state.isLoading = false;
        state.error = false;
      });

  }
});

export const taskReducer = TaskAppSlice.reducer;

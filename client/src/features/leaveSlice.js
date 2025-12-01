import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api';

const initialState = {
  myRequests: [],
  balance: { sickLeave: 0, casualLeave: 0, vacationLeave: 0 },
  employeeDashboard: null,
  managerDashboard: null,
  manager: {
    pending: [],
    all: [],
  },
  status: 'idle',
  error: null,
  message: null,
};

export const fetchMyData = createAsyncThunk('leaves/fetchMyData', async (_, thunkAPI) => {
  try {
    const [requestsRes, balanceRes] = await Promise.all([
      api.get('/leaves/my-requests'),
      api.get('/leaves/balance'),
    ]);
    return { requests: requestsRes.data, balance: balanceRes.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to fetch leave data');
  }
});

export const applyForLeave = createAsyncThunk('leaves/apply', async (payload, thunkAPI) => {
  try {
    const { data } = await api.post('/leaves', payload);
    thunkAPI.dispatch(fetchMyData());
    thunkAPI.dispatch(fetchEmployeeDashboard());
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to submit leave');
  }
});

export const cancelLeave = createAsyncThunk('leaves/cancel', async (leaveId, thunkAPI) => {
  try {
    const { data } = await api.delete(`/leaves/${leaveId}`);
    thunkAPI.dispatch(fetchMyData());
    thunkAPI.dispatch(fetchEmployeeDashboard());
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to cancel leave');
  }
});

export const fetchEmployeeDashboard = createAsyncThunk('leaves/employeeDashboard', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/dashboard/employee');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to load dashboard');
  }
});

export const fetchManagerDashboard = createAsyncThunk('leaves/managerDashboard', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/dashboard/manager');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to load manager dashboard');
  }
});

export const fetchPendingRequests = createAsyncThunk('leaves/pending', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/leaves/pending');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to load pending requests');
  }
});

export const fetchAllRequests = createAsyncThunk('leaves/all', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/leaves/all');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to load requests');
  }
});

export const approveLeaveRequest = createAsyncThunk(
  'leaves/approve',
  async ({ id, managerComment }, thunkAPI) => {
    try {
      const { data } = await api.put(`/leaves/${id}/approve`, { managerComment });
      thunkAPI.dispatch(fetchPendingRequests());
      thunkAPI.dispatch(fetchAllRequests());
      thunkAPI.dispatch(fetchManagerDashboard());
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to approve request');
    }
  }
);

export const rejectLeaveRequest = createAsyncThunk(
  'leaves/reject',
  async ({ id, managerComment }, thunkAPI) => {
    try {
      const { data } = await api.put(`/leaves/${id}/reject`, { managerComment });
      thunkAPI.dispatch(fetchPendingRequests());
      thunkAPI.dispatch(fetchAllRequests());
      thunkAPI.dispatch(fetchManagerDashboard());
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to reject request');
    }
  }
);

const leaveSlice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMyData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.myRequests = action.payload.requests;
        state.balance = action.payload.balance;
        state.error = null;
      })
      .addCase(fetchMyData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(applyForLeave.fulfilled, (state) => {
        state.message = 'Leave request submitted!';
        state.error = null;
      })
      .addCase(applyForLeave.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(cancelLeave.fulfilled, (state, action) => {
        state.message = action.payload?.message || 'Leave cancelled';
        state.error = null;
      })
      .addCase(cancelLeave.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchEmployeeDashboard.fulfilled, (state, action) => {
        state.employeeDashboard = action.payload;
      })
      .addCase(fetchManagerDashboard.fulfilled, (state, action) => {
        state.managerDashboard = action.payload;
      })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.manager.pending = action.payload;
      })
      .addCase(fetchAllRequests.fulfilled, (state, action) => {
        state.manager.all = action.payload;
      });
  },
});

export const { clearMessage } = leaveSlice.actions;

export default leaveSlice.reducer;



import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
  user: null,
  otp: {
    field: '',
    hash: '',
  },
  isLoading: false, // This is the loading state
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
        const {user} = action.payload
        state.user = user;
        // state.isAuth = true;
        if(user === null){
            state.isAuth = false;    
        }else{
            state.isAuth = true;
        }
    },
    setOtp: (state, action) => {
      const { field, hash } = action.payload;
      state.otp.field = field;
      state.otp.hash = hash;
    },
    setLoading: (state, action) => {
        state.isLoading = action.payload;
    },
    setError: (state, action) => {
        state.error = action.payload;
    }
  },
});

// Export actions
export const { setAuth, setOtp, setLoading, setError } = authSlice.actions;


export const setOtpAsync = (data) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setOtp({ field: data.field, hash: data.hash }));
    } catch (error) {
      dispatch(setError('Failed to send OTP')); // Dispatch error if the API request fails
    } finally {
      dispatch(setLoading(false)); // Set loading to false once the request is completed
    }
  };


// Export reducer
export default authSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginState {
  username: string;
  password: string;
}

const initialState: LoginState = {
  username: "",
  password: "",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        username: action.payload,
      };
    },
    setPassword: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        password: action.payload,
      };
    },
  },
});

export const { setUsername, setPassword } = loginSlice.actions;
export default loginSlice.reducer;

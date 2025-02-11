import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { register, login, verifyOtp, userData, isAuth ,logout,verifyEmail,resendOtp,resetPassword} from "../apis/authApi";
import LocalStorage from "../../utils/localStorage.js";
import { message } from "antd";

const initialState = {
  loading: false,
  token: "",
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  userData: false,
  userinfoData: {},
};

const actions = {
  REGISTER: "auth/REGISTER",
  LOGIN: "auth/LOGIN",
  USER_DATA: "auth/USER_DATA",
  IS_AUTH: "auth/IS_AUTH",
  LOGOUT:'auth/LOGOUT',
  VERIFY_OTP:'auth/VERIFY_OTP',
  VERIFY_EMAIL:'auth/VERIFY_EMAIL',
  RESEND_OTP:'auth/RESEND_OTP',
  RESET_PASSWORD:'auth/RESET_PASSWORD',
};

export const authRegister = createAsyncThunk(
  actions.REGISTER,
  async (payload) => {
    const response = await register(payload);
    if (response?.token) {
      const { token } = response;
      let newUser = {
        token,
      };

      LocalStorage.setItem("user", JSON.stringify(newUser));
      console.log("userauth: ", newUser);
    } else {
      localStorage.clear();
    }
    return response;
  }
);

export const authLogin = createAsyncThunk(actions.LOGIN, async (payload) => {
  const response = await login(payload);
  console.log("responseLogin: ", response);
  if (response?.token) {
    const { token } = response;
    let newUser = {
      token,
    };

    LocalStorage.setItem("user", JSON.stringify(newUser));
    console.log("userauth: ", newUser);
  } else {
    localStorage.clear();
  }
  return response;
});

export const getUserData = createAsyncThunk(
  actions.USER_DATA,
  async (payload) => {
    const response = await userData(payload);
        return response;
  }
);

export const userAuth = createAsyncThunk(
    actions.IS_AUTH,
    async (payload) => {
      const response = await isAuth(payload);
          return response;
    }
  );

  export const authLogout = createAsyncThunk(
    actions.LOGOUT,
    async (payload) => {
      const response = await logout(payload);
          return response;
    }
  );

  export const sendVerifyOtp = createAsyncThunk(
    actions.VERIFY_OTP,
    async (payload) => {
      const response = await verifyOtp(payload);
          return response;
    }
  );

  export const emailVerification = createAsyncThunk(
    actions.VERIFY_EMAIL,
    async (payload) => {
      const response = await verifyEmail(payload);
          return response;
    }
  );

  export const authResendOtp = createAsyncThunk(
    actions.RESEND_OTP,
    async (payload) => {
      const response = await resendOtp(payload);
          return response;
    }
  );


  export const authResetPassword = createAsyncThunk(
    actions.RESET_PASSWORD,
    async (payload) => {
      const response = await resetPassword(payload);
          return response;
    }
  );





export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authRegister.pending, (state) => {
        state.loading = true;
      })
      .addCase(authRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn=true
        localStorage.setItem("isLoggedIn", JSON.stringify(true)); 
      })
      .addCase(authRegister.rejected, (state, action) => {
        const { message: msg } = action.error;
        state.loading = false;
        message.error(msg);
      });

    builder
      .addCase(authLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(authLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        localStorage.setItem("isLoggedIn", JSON.stringify(true)); 
        console.log("Redux state updated: isLoggedIn = ", state.isLoggedIn);
      })
      
      .addCase(authLogin.rejected, (state, action) => {
        const { message: msg } = action.error;
        state.loading = false;
        message.error(msg);
      });

    builder
      .addCase(getUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userinfoData = action.payload.userData;
      })
      .addCase(getUserData.rejected, (state, action) => {
        const { message: msg } = action.error;
        state.loading = false;
         message.error(msg);
      });

      builder
      .addCase(userAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(userAuth.fulfilled, (state, action) => {
        state.loading = false;
        
      })
      .addCase(userAuth.rejected, (state, action) => {
        const { message: msg } = action.error;
        state.loading = false;
         message.error(msg);
      });

      builder
      .addCase(authLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(authLogout.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn=false
        localStorage.removeItem("isLoggedIn");
        
      })
      .addCase(authLogout.rejected, (state, action) => {
        const { message: msg } = action.error;
        state.loading = false;
         message.error(msg);
      });

      builder
      .addCase(sendVerifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendVerifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        
      })
      .addCase(sendVerifyOtp.rejected, (state, action) => {
        const { message: msg } = action.error;
        state.loading = false;
         message.error(msg);
      });

      builder
      .addCase(emailVerification.pending, (state) => {
        state.loading = true;
      })
      .addCase(emailVerification.fulfilled, (state, action) => {
        state.loading = false;
        
      })
      .addCase(emailVerification.rejected, (state, action) => {
        const { message: msg } = action.error;
        state.loading = false;
         message.error(msg);
      });

      builder
      .addCase(authResendOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(authResendOtp.fulfilled, (state, action) => {
        state.loading = false;
        
      })
      .addCase(authResendOtp.rejected, (state, action) => {
        const { message: msg } = action.error;
        state.loading = false;
         message.error(msg);
      });

      builder
      .addCase(authResetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(authResetPassword.fulfilled, (state, action) => {
        state.loading = false;
        
      })
      .addCase(authResetPassword.rejected, (state, action) => {
        const { message: msg } = action.error;
        state.loading = false;
         message.error(msg);
      });
  },
});

export const { setIsLoggedIn, setUserData } = authSlice.actions;
export default authSlice.reducer;

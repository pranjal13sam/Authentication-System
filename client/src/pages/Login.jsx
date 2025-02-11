import React from "react";
import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Col, Form, Row, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  authLogin,
  setIsLoggedIn,
  setUserData,
  authRegister,
} from "../redux/slices/authSlice.js";
import LocalStorage from "../utils/localStorage.js";

import { useDispatch, useSelector } from "react-redux";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userData = useSelector((state) => state.auth.userData);
  const { loginData, loading } = useSelector((state) => state.auth);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const payload =
        state === "Sign Up" ? { name, email, password } : { email, password };

      const response =
        state === "Sign Up"
          ? await dispatch(authRegister(payload)).unwrap()
          : await dispatch(authLogin(payload)).unwrap();

      if (state === "Sign Up") {
        if (response.success) {
          //dispatch(setIsLoggedIn(true));
          navigate("/");
          message.success("Welcome to Authentication System!");
        } else {
          message.error(response?.message);
        }
      } else {
        if (response.success) {
          //dispatch(setIsLoggedIn(true));
          navigate("/");
          message.success("Welcome back developer!");
        } else {
          message.error(response?.message);
        }
      }
    } catch (error) {
      message.error(error.message || "Something went wrong!");
    }
  };
  
  useEffect(() => {
    const storedIsLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
    if (storedIsLoggedIn) {
      dispatch(setIsLoggedIn(storedIsLoggedIn)); // Restore state from localStorage
    }
  }, []);
 


  return (
    <div className="flex items-center justify-center min-h-screen  px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img 
        onClick={() => navigate("/")}
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        alt=""
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account"}
        </p>
        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon}></img>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                className="bg-transparent outline-none"
                placeholder="Full name"
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon}></img>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="bg-transparent outline-none"
              placeholder="Email ID"
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon}></img>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="bg-transparent outline-none"
              placeholder="Password"
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="text-indigo-500 mb-4 cursor-pointer"
          >
            Forgot password?
          </p>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?{"  "}
            <span
              onClick={() => setState("Login")}
              className="underline text-blue-400 cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account?{"  "}
            <span
              onClick={() => setState("Sign Up")}
              className="underline text-blue-400 cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;

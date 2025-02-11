import React, { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  authResendOtp,
  authResetPassword,
  getUserData,
} from "../redux/slices/authSlice";
import { message } from "antd";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const inputRefs = useRef([]);
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1)
      inputRefs.current[index + 1].focus();
  };

  //function if any deletion done in the input field then the focus will be automatically there
  const handleInputDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  //paste functionality of otp paste (we can copy paste the otp directly to the input field)
  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const sendOtp = (e) => {
    e.preventDefault();
    const payload = { email: email };
    try {
      dispatch(authResendOtp(payload)).then((response) => {
        console.log("response: ", response);
        if (response.payload.success) {
          setIsEmailSent(true);
          message.success(response.payload.message);
        } else {
          message.error(response.payload.message || "An Error Occured!");
        }
      });
    } catch (error) {
      console.log(error);
      message.error("An error Occured!");
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpString = inputRefs.current.map((e) => e.value).join("");
    setOtp(otpString);
    setIsOtpSubmitted(true);
  };

  const newResetPassword = (e) => {
    e.preventDefault();
    const payload = { email: email, otp: otp, newPassword: newPassword };
    try {
      dispatch(authResetPassword(payload)).then((response) => {
        console.log("response: ", response);
        if (response.payload.success) {
          message.success(response.payload.message);
          navigate("/login");
        } else {
          message.error(response.payload.message || "An Error Occured!");
        }
      });
    } catch (error) {
      console.log(error);
      message.error("An error Occured!");
    }
  };

  return (
    <div className="flex  items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        alt=""
      />

      {!isEmailSent && (
        <form
          onSubmit={sendOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          action=""
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email address
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img className="w-3 h-3" src={assets.mail_icon}></img>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="text-white bg-transparent outline-none"
              placeholder="Email ID"
              type="email"
              required
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}

      {/* Form for entering otp: */}
      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          action=""
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digit code sent to you email Id
          </p>
          <div className="flex justify-between mb-8" onPaste={handleOtpPaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength={1}
                  key={index}
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleInputDown(e, index)}
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md "
                />
              ))}
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
            Submit
          </button>
        </form>
      )}

      {/* Enter new password form */}

      {isEmailSent && isOtpSubmitted && (
        <form
          onSubmit={newResetPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          action=""
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the new password below
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img className="w-3 h-3" src={assets.lock_icon}></img>
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              className="text-white bg-transparent outline-none"
              placeholder="New Password"
              type="password"
              required
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;

import React, { useRef, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { emailVerification, getUserData } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const EmailVerify = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  console.log("Logged in:", isLoggedIn);

  const { userinfoData } = useSelector((state) => state.auth);

  //function to move the cursor automatically if the value(number-otp) is entered in one box
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
  console.log("verification check: ", userinfoData);
  
  useEffect(()=>{
    dispatch(getUserData());
  },[])

  useEffect(()=>{
    console.log('isLoggedin verify page: ',isLoggedIn)
  },[isLoggedIn])



  useEffect(() => {
    if (isLoggedIn && userinfoData && userinfoData.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedIn, userinfoData]);
  const verifyEmail = (e) => {
    const otpString = inputRefs.current.map((e) => e.value).join("");

    const payload = { otp: otpString };
    try {
      e.preventDefault();
      dispatch(emailVerification(payload)).then((response) => {
        console.log("response: ", response);
        if (response.payload.success) {
          message.success(response.payload.message);
          dispatch(getUserData());
          navigate("/");
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
      <form
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        action=""
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
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
        <button
          onClick={verifyEmail}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;

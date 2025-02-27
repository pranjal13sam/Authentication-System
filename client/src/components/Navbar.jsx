import React, { useEffect } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import {
  getUserData,
  userAuth,
  setIsLoggedIn,
  authLogout,
  sendVerifyOtp,
} from "../redux/slices/authSlice.js";
import { message } from "antd";
import { useSelector, useDispatch } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userinfoData } = useSelector((state) => state.auth);
  const { isLoggedIn } = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await dispatch(userAuth()).unwrap();

        if (response.success) {
          dispatch(getUserData());
          //dispatch(setIsLoggedIn(true));
        }
      } catch (error) {
        console.error(response.message);
      }
    };

    if (!isLoggedIn) {
      checkAuth();
    }
  }, [dispatch, isLoggedIn]);

  const handleLogout = () => {
    try {
      dispatch(authLogout()).then((response) => {
        if (authLogout.fulfilled.match(response)) {
          message.success("Logged out successfully!");
          //dispatch(setIsLoggedIn(false));
          navigate("/login");
        } else {
          message.error(response.payload || "Logout failed!");
        }
      });
    } catch (error) {
      console.error("Logout Error:", error);
      message.error("An error occurred during logout.");
    }
  };

  const sendOtp = () => {
    try {
      dispatch(sendVerifyOtp()).then((response) => {
        console.log('response: ',response)
        if (response.payload.success) {
          message.success(response.payload.message);
          navigate("/verify-email");
        } else {
          message.error(response.payload.message);
        }
      });
    } catch (error) {
      console.log(error);
      message.error("An error Occured!");
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} className="w-28 sm:w-32"></img>

      {userinfoData && userinfoData.name ? (
        <div className="flex w-8 h-8 justify-center items-center rounded-full bg-black text-white relative group">
          {userinfoData.name[0]}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userinfoData?.isAccountVerified && (
                <li onClick={sendOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                  Verify Email
                </li>
              )}
              <li
                onClick={handleLogout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon}></img>
        </button>
      )}
    </div>
  );
};

export default Navbar;

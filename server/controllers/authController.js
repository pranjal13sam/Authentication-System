import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTemplates.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "Missing Details!",
    });
  }

  //if all three data is present:
  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    //decrypting the password as we will not store the same password what user has given to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    //creating user now for the database:
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    //lets see how token works:
    //this id is basically whenever anyuser is created in the database then the id is automatically created by mongodb
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true, //prevents js from reading the cookie
      secure: process.env.NODE_ENV === "production", //If the website is HTTPS (secure), the cookie is sent securely.
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //Prevents cross-site attacks.
      maxAge: 1 * 24 * 60 * 60 * 1000, //The cookie expires in 1 day. converting 1 day in miliseconds
    });

    //sending welcome email:
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome To The Project Created By Pranjal",
      text: `Welcome to the project.Your account has been created with email id: ${email}`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  //validation of email and password:
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required to login",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "No user found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    //generate token:

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, token });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//logout controller:

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, message: "logged out successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//send verification otp to the user's email:
export const sendVerifyOtp = async (req, res) => {
  try {
    //here have you thought how userId we will get because user will only enter otp then from where do we get the userId so we will get the userId from the token for that we will use the middleware
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already Verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; //expiry date is 1 day

    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      //text:`Your OTP is ${otp}. Verify your account using this OTP`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Verification OTP Sent on Email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  //here have you thought how userId we will get because user will only enter otp then from where do we get the userId so we will get the userId from the token for that we will use the middleware
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    res.json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    user.isAccountVerified = true;

    //reset the verification otp and verification otp expireAt:
    user.verifyOtp = "";
    user.verifyOtpExpireAt = "";

    await user.save();
    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//check if user is authenticated:
//here we are just adding trycatch and not anylogic because before the controller a middleware will run and check
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//send password reset otp:
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; //expiry time is 15 minutes

    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      //text:`Your OTP for resetting your password is  ${otp}. Use this OTP to proceed with resetting your password.`
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//verification and resetting the password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    res.json({
      success: false,
      message: "Email, OTP, new password are required!",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.json({ success: false, message: "User not found!" });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      res.json({ success: false, message: "Invalid OTP!" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      res.json({ success: false, message: "OTP Expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Password has been reset Successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

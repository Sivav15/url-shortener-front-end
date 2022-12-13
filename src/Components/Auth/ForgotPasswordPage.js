import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { env } from "../../config";
import load from "../../asset/loading4.svg";

function ForgotPasswordPage() {
  const params = useParams();
  let [loading, setloading] = useState(false);
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: "",
      conformPassword: "",
    },
    validate: (values) => {
      const errors = {};
      if (values.password.length === 0) {
        errors.password = "Enter your passowrd";
      } else if (values.password.search(/[a-z]/i) < 0) {
        errors.password = "Your password must contain at least one letter";
      } else if (values.password.search(/[0-9]/) < 0) {
        errors.password = "Your password must contain at least one digit";
      } else if (values.password.length < 8) {
        errors.password = "Your password must be at least 8 characters";
      }
      if (values.conformPassword !== values.password) {
        errors.conformPassword = "Conform password does not match";
      } else if (values.conformPassword.length === 0) {
        errors.conformPassword = "Enter your conform password";
      }
      return errors;
    },

    onSubmit: async (values) => {
      try {
        delete values.conformPassword;
        values.id = params.id;
        values.token = params.token;
        setloading(true);
        let user = await axios.post(
          `${env.api}/password-reset-page`,
          values
        );

        if (user.data.statusCode === 200) {
          setloading(false);
            navigate("/");
        }else{
          setloading(false);
          toast.warn(user.data.message);
        }
       
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <div class="login-wrapper">
      <form
        class="form"
        onSubmit={(values) => {
          formik.handleSubmit(values);
        }}
      >
        <img src="img/avatar.png" alt="" />
        <h2>Password Reset Form</h2>
        <div class="input-group">
          <input
            type="password"
            id="password"
            required
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="password"
          />
          <label for="password">Password</label>
        </div>
        {formik.touched.password && formik.errors.password ? (
          <div className="error"> {formik.errors.password}</div>
        ) : null}

        <div class="input-group">
          <input
            type="conformPassword"
            id="conformPassword"
            required
            value={formik.values.conformPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="conformPassword"
          />
          <label for="password">Conform Password</label>
        </div>
        {formik.touched.conformPassword && formik.errors.conformPassword ? (
          <div className="error"> {formik.errors.conformPassword}</div>
        ) : null}
        <button type="submit" className="submit-btn" disabled={!formik.isValid}>
          {loading ? (
            <img src={load} alt="load" className="spinner" />
          ) : (
            " Change Password "
          )}
        </button>
        <div className="mt-3 log">
          <span onClick={() => navigate("/")}>Back to login</span>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
}

export default ForgotPasswordPage;

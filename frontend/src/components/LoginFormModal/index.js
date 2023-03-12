import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { Redirect } from "react-router-dom";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [typingUserName, setTypingUserName] = useState(false);
  const [typingPassword, setTypingPassword] = useState(false);
  const { closeModal } = useModal();
  const sessionUser = useSelector((state) => state.session.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const errors = {};
        const data = await res.json();

        errors.message = data.message;

        if (data && data.message) setErrors(errors);
      });
  };

  const logInDemo = (e) => {
    setErrors({});
    return dispatch(
      sessionActions.login({ credential: "demo@user.io", password: "password" })
    )
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  useEffect(() => {
    const errors = {};

    if (credential.length < 4) {
      errors.loginDisable = true;
    }

    if (typingUserName && credential.length < 4) {
      errors.credential = "Username must be four characters or more";
    }

    if (typingPassword && password.length < 6) {
      errors.password = "Password must be six characters or more";
    }

    setErrors(errors);
  }, [credential, password]);

  if (sessionUser) return <Redirect to={"/"} />;

  return (
    <div className="login-container">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} id="login-form">
        {errors.message && <div>{errors.message}</div>}
        {errors.credential && <div>{errors.credential}</div>}
        {errors.password && <div>{errors.password}</div>}

        <input
          id="credential"
          type="text"
          value={credential}
          onChange={(e) => {
            setCredential(e.target.value);
            setTypingUserName(true);
          }}
          required
          className="form-input"
          placeholder="username or email"
        />

        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setTypingPassword(true);
          }}
          required
          className="form-input"
          placeholder="password"
        />

        <button
          type="submit"
          id="login-button"
          disabled={Object.values(errors).length}
        >
          Log In
        </button>
      </form>
      <button id="demo-login" onClick={(e) => logInDemo(e)}>
        Demo User Login
      </button>
    </div>
  );
}

export default LoginFormModal;

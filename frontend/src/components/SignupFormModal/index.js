import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors([
      "Confirm Password field must be the same as the Password field",
    ]);
  };

  return (
    <div id="signup-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} id="signup-form">
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          placeholder="First Name"
          className="signup-input"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          placeholder="Last Name"
          className="signup-input"
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          className="signup-input"
        />

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Username"
          className="signup-input"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="signup-input"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Confirm Password"
          className="signup-input"
        />
        <button id="signup-button" type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;

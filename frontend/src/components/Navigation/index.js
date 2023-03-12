import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="navbar-container">
      <div>Logo</div>
      <div className="navbar-right">
        {sessionUser && Object.values(sessionUser).length && (
          <Link id="manage-spots" to={"/spot-form/new"}>
            Create a New Spot
          </Link>
        )}
        {isLoaded && <ProfileButton user={sessionUser} />}
      </div>
    </div>
  );
}

export default Navigation;

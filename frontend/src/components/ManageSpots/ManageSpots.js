import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllSpots, getAllSpotsForCurrentUser } from "../../store/spots";

import { Link, Redirect, useHistory } from "react-router-dom";
import "./ManageSpots.css";

export default function AllSpots() {
  const spots = useSelector((state) => state.spots.allSpots);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(getAllSpotsForCurrentUser());
  }, [dispatch]);

  if (!Object.values(spots).length) return null;

  return (
    <div>
      <h1>Manage Your Spots</h1>
      <Link to={"/spot-form/new"}>Create a New Spot</Link>

      <div className="spots-container">
        {Object.values(spots).map((spot) => (
          <div className="spot-container">
            <Link to={`/spots/${spot.id}`} key={spot.id}>
              <div className="spots-card">
                <img
                  src="https://images.unsplash.com/photo-1506126279646-a697353d3166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="test"
                />
                <div className="spots-card-info">
                  <p>
                    {spot.city},{spot.state}
                  </p>
                  <p>{spot.avgRating}</p>
                </div>
                <p>${spot.price} night</p>
              </div>
            </Link>
            <button
              className="spot-buttons"
              onClick={(e) => {
                console.log("clicked!!!");
                history.push(`/spot-form/update/${spot.id}`);
              }}
            >
              Update
            </button>
            <button className="spot-buttons">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

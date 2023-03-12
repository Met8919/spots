import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllSpots } from "../../store/spots";
import "./AllSpots.css";
import { Link } from "react-router-dom";

export default function AllSpots() {
  const spots = useSelector((state) => state.spots.allSpots);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(dispatch(getAllSpots()));
  }, [dispatch]);

  if (!Object.values(spots).length) return null;

  return (
    <div className="spots-container">
      {Object.values(spots).map((spot) => (
        <Link
          to={`/spots/${spot.id}`}
          key={spot.id}
          className="spots-card"
          title={spot.name}
        >
          <img
            src="https://images.unsplash.com/photo-1506126279646-a697353d3166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            alt="test"
          />
          <div className="spot-card-info">
            <div>
              <div>
                {spot.city},{spot.state}
              </div>
              <div>${spot.price} night</div>
            </div>

            <div>{spot.avgRating}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

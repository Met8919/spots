import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { getSpot } from "../../store/spots";

import { Redirect, useHistory, useParams } from "react-router-dom";

import "./Spot.css";
import { clearSpotReviews, getSpotReviews } from "../../store/review";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import ReviewModal from "../ReviewModal";
import Review from "./Reviews";

export default function Spot() {
  const spot = useSelector((state) => state.spots.singleSpot);
  const spotReviews = useSelector((state) => state.reviews.spotReviews);
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session);

  useEffect(() => {
    dispatch(getSpot(spotId));
    dispatch(getSpotReviews(spotId));

    return () => dispatch(clearSpotReviews());
  }, [dispatch, spotId]);

  if (!Object.values(spot).length) return null;

  let hasNotPostedReview = true;
  if (Object.values(spotReviews)[0]) {
    // console.log("!!!!!!!!!");
    // console.log(Object.values(spotReviews)[3].User.id)
    // console.log(sessionUser.user.id)
    hasNotPostedReview = !Object.values(spotReviews).some(
      (review) => review.User.id === sessionUser.user.id
    );

    // console.log(!Object.values(spotReviews).some(review => review.User.id === sessionUser.user.id))
  }

  return (
    <div className="main-container">
      <h1>{spot.name}</h1>
      <h4>
        {spot.city}, {spot.country}
      </h4>

      <div className="image-container">
        <img
          className="main-image"
          alt="test"
          src="https://images.unsplash.com/photo-1506126279646-a697353d3166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        />

        <div className="side-image-container">
          <img
            className="side-image"
            alt="test"
            src="https://images.unsplash.com/photo-1506126279646-a697353d3166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
          />
          <img
            className="side-image"
            alt="test"
            src="https://images.unsplash.com/photo-1506126279646-a697353d3166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
          />
          <img
            className="side-image"
            alt="test"
            src="https://images.unsplash.com/photo-1506126279646-a697353d3166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
          />
          <img
            className="side-image"
            alt="test"
            src="https://images.unsplash.com/photo-1506126279646-a697353d3166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
          />
        </div>
      </div>

      <div className="spot-details-container">
        <div>
          <h1>
            Hosted by {spot.owner.firstName} {spot.owner.lastName}
          </h1>
          <p>{spot.description}</p>
        </div>
        <div className="reserve-container">
          <div className="reserve-details-container">
            <p>{spot.price} night</p>
            <div className="reserve-details-container">
              <p>{spot.avgStarRating}</p>
              <p>{spot.numReviews}</p>
            </div>
          </div>
          <button>Reserve</button>
        </div>
      </div>

      <div className="spot-review-container">
        <h2>{/* {spot.avgStarRating} {spot.numReviews} */}</h2>
        {sessionUser.user.id !== spot.ownerId && hasNotPostedReview && (
          <OpenModalMenuItem
            itemText="Review"
            modalComponent={<ReviewModal spotId={spotId} />}
          />
        )}
        {Object.values(spotReviews).length &&
          Object.values(spotReviews)
            .sort((a, b) => (a.milliseconds > b.milliseconds ? 1 : -1))
            .map((review) => (
              <Review review={review} sessionUser={sessionUser} />
            ))}
      </div>
    </div>
  );
}

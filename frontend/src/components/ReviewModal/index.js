import { useState } from "react";
import { useParams } from "react-router-dom";
import { createSpotReview } from "../../store/review";
import { useDispatch } from "react-redux";

export default function ReviewModal({ spotId }) {
  const [review, setReview] = useState("");
  const [stars, setStars] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    

    dispatch(createSpotReview({ spotId, review: { review, stars } }));
  };

  return (
    <div className="review-container">
      <h1>How was your stay?</h1>

      <form onSubmit={(e) => handleSubmit(e)}>
        <textarea value={review} onChange={(e) => setReview(e.target.value)} />

        <label>
          Stars
          <select value={stars} onChange={(e) => setStars(e.target.value)}>
            <option>1</option>
            <option>2</option>
          </select>
        </label>

        <button type="submit">Submit your Review</button>
      </form>
    </div>
  );
}

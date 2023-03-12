import { csrfFetch } from "./csrf";

const LOAD_SPOT_REVIEWS = "/review/setSpotReviews";

const ADD_SPOT_REVIEW = "/review/AddSpotReview";

const CLEAR_SPOT_REVIEWS = '/review/ClearSpotReviews'





const setSpotReviews = (spotReviews) => {
  return {
    type: LOAD_SPOT_REVIEWS,
    spotReviews,
  };
};

const addSpotReview = (newReview) => {
  return {
    type: ADD_SPOT_REVIEW,
    newReview,
  };
};

export const clearSpotReviews = () => {
  return ({
    type: CLEAR_SPOT_REVIEWS
  })
}

export const createSpotReview = (reviewData) => async (dispatch) => {
  const { spotId, review } = reviewData;

  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "Application/json" },
    body: JSON.stringify(review),
  });

  if (res.ok) {
    const newReview = await res.json();


    dispatch(getSpotReviews(spotId))
    return newReview
  }


  console.log('not ok');
};

export const getSpotReviews = (spotId) => async (dispatch) => {

  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const spotReviews = await res.json();
    dispatch(setSpotReviews(spotReviews));
  }

  return res;
};

const initialState = { spotReviews: {} };

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOT_REVIEWS: {
      const newState = { ...state, spotReviews: {} };

      const months = [
        "January",
        "Febuary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      action.spotReviews.Reviews.forEach((review) => {
        // format of first element in array:   yyyy-mm-dd
        const date = review.createdAt.split(" ")[0].split("-");
        const milliseconds = Math.floor(Date.parse(date) / 1000)
        const day = date[2]
        const month = months[date[1] - 1];
        const year = date[0];
        review.createdAt = { year, month, day , milliseconds};
        newState.spotReviews[review.id] = review;
      });

      return newState;
    }
    case ADD_SPOT_REVIEW: {
      const newState = {...state, spotReviews: {...state.spotReviews}}

      newState.spotReviews[action.newReview.id] = action.newReview
      return newState

    }
    case CLEAR_SPOT_REVIEWS: {
      return { spotReviews: {} }
    }

    default:
      return state;
  }
};

export default reviewsReducer;

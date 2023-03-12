import { csrfFetch } from "./csrf";


// actions

const SET_ALL_SPOTS = "/spots/setAllSpots";
const SET_SPOT = "/spot/setSpot";






// Action creators


const addSpot = (spot) => {
  return {
    type: spot,
  };
};

const setAllSpots = (spots) => {
  return {
    type: SET_ALL_SPOTS,
    spots,
  };
};

const setSpot = (spot) => {
  return {
    type: SET_SPOT,
    spot,
  };
};



// Thunk

export const updateSpot = (spotData) => async (dispatch) => {

  console.log(spotData.spotId)

  const res = await csrfFetch(`/api/spots/${spotData.spotId}`,{
    method: 'PUT',
    headers: {"Content-Type": "Application/json"},
    body: JSON.stringify(spotData)

  })

  if (res.ok) {
    const updatedSpot = res.json()
    console.log(updateSpot, 'pppppppppppppppppppppppppppppppppppppppppppp')
    dispatch(setSpot(updateSpot))
    return updateSpot
  }





}



export const createSpot = (spot) => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });

  if (res.ok) {
    const newSpot = await res.json();
    dispatch(addSpot(newSpot));


    return newSpot


  }

  return res;
};



export const getAllSpotsForCurrentUser = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current");

  if (res.ok) {
    const spots = await res.json();
    console.log(spots, '----------------')
    dispatch(setAllSpots(spots));

  }

  return res;
};




export const getAllSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");

  if (res.ok) {
    const spots = await res.json();
    dispatch(setAllSpots(spots));

  }

  return res;
};


export const getSpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const spot = await res.json();

    dispatch(setSpot(spot));
  }

  return res;
};

const initialState = { allSpots: {}, singleSpot: {} };

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_SPOTS: {
      const newState = { ...state, allSpots: {} };
      // const newState = JSON.parse(JSON.stringify(state));

      action.spots.Spots.forEach((spot) => {
        newState.allSpots[spot.id] = spot;
      });

      return newState;
    }
    case SET_SPOT:
      const newState = { ...state };
      newState.singleSpot = action.spot;
      return newState;

    default:
      return state;
  }
};

export default spotsReducer;

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/AllSpots/AllSpots";
import SpotDetails from "./components/SpotDetails/SpotDetails";
import SpotForm from "./components/SpotForm";
import ReviewModal from "./components/ReviewModal";
import ManageSpots from "./components/ManageSpots/ManageSpots";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <AllSpots />
          </Route>
          <Route path={"/spots/:spotId"}>
            <SpotDetails />
          </Route>
          <Route exact path={"/spot-form/update/:spotId"}>
            <SpotForm />
          </Route>
          <Route path={"/spot-form/:formType"}>
            <SpotForm />
          </Route>
          <Route path={"/manage-spots"}>
            <ManageSpots />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;

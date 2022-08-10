import React from "react";
import { Switch, Route } from "react-router-dom";
// auth
import SignIn from "../views/dashboard/auth/sign-in/sign-in";

const SimpleRouter = () => {
  return (
    <>
      <Switch>
        {/* auth */}
        <Route exact path="/auth/sign-in" component={SignIn} />
      </Switch>
    </>
  );
};

export default SimpleRouter;

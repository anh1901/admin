import React from "react";
//router
import { Switch, Route } from "react-router";
//layoutpages
import Default from "../layouts/dashboard/default";
import Simple from "../layouts/dashboard/simple";

const IndexRouters = () => {
  return (
    <>
      <Switch>
        {/*  */}
        <Route exact path="/" component={Default}></Route>
        <Route path="/admin" component={Default}></Route>
        <Route path="/auth" component={Simple}></Route>
        <Route path="/errors" component={Simple}></Route>
      </Switch>
    </>
  );
};

export default IndexRouters;

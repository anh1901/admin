import React, { useEffect } from "react";
import Index from "../views/dashboard/index";
import { Switch, Route } from "react-router-dom";

//TransitionGroup
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Users from "../views/users";
import Reports from "../views/reports";
import Tasks from "../views/tasks";
import Posts from "../views/posts/Posts";
import Boards from "../views/boards";
import Employees from "../views/employees";
import SubCategories from "../views/categories/sub-category";
import RootCategories from "../views/categories/root-category";
import MyPost from "../views/posts/MyPost";
import CreatePost from "../views/posts/CreatePost";
import CreateReport from "../views/create-report";
import ManagerTasks from "../views/manager-tasks";

const DefaultRouter = () => {
  const user_info = JSON.parse(localStorage.getItem("user_info"));
  useEffect(() => {
    if (
      user_info === null ||
      (user_info !== null && user_info.role.roleId === 1)
    ) {
      window.location.href = "/auth/sign-in";
    }
  });
  return (
    <TransitionGroup>
      <CSSTransition classNames="fadein" timeout={300}>
        <Switch>
          <Route path="/admin" exact component={Index} />
          <Route path="/admin/dashboard" exact component={Index} />
          {/* Admin */}
          <Route path="/admin/users" exact component={Users} />
          {/* staff */}
          <Route path="/admin/create-report" exact component={CreateReport} />
          <Route path="/admin/reports" exact component={Reports} />
          {/*Editor */}
          <Route path="/admin/my-tasks" exact component={Tasks} />
          <Route path="/admin/create-post" exact component={CreatePost} />
          <Route path="/admin/my-posts" exact component={MyPost} />
          {/* Editor manager */}
          <Route path="/admin/category/sub" exact component={SubCategories} />
          <Route path="/admin/category/root" exact component={RootCategories} />
          <Route path="/admin/employees" exact component={Employees} />
          <Route path="/admin/task-boards" exact component={Boards} />
          <Route path="/admin/tasks" exact component={ManagerTasks} />
          <Route path="/admin/posts" exact component={Posts} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default DefaultRouter;

import React from "react";
import { NavLink } from "react-router-dom";

const MenuWithSubMunes = route => {
  return (
    <li>
      <NavLink
        to={route.path}
        exact={route.exact}
        activeStyle={{ color: "red" }}
      >
        {route.label}
      </NavLink>
    </li>
  );
};

export default MenuWithSubMunes;

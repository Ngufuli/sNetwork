import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "proptypes";

const PrivateRoute = () => {
  return <div></div>;
};

export connect(mapStateToProps)(PrivateRoute)

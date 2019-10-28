import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import { getProfiles } from "../../actions/profileActions";

class Profiles extends Component {
  render() {
    return <div></div>;
  }
}

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  null,
  { getProfiles }
)(Profiles);

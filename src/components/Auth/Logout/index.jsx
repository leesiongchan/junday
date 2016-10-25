import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';

class Logout extends Component {
  static propTypes = {
    authStore: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.authStore.signOut();

    browserHistory.replace('/');
  }

  render() {
    return <div />;
  }
}

export default Logout;

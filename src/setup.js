
import React, { Component } from 'react';

import { Provider } from 'react-redux';

import StackNavigation from './Router/Stack/StackNavigation';
import configureStore from './Redux/configureStore';

class Root extends Component {

  constructor(props) {
    super(props);
    this.state = {
      store: configureStore(),
    };
  }

  render() {
    const { store } = this.state;

    return (

        <Provider store={store}>

          <StackNavigation />

        </Provider>

    );
  }
}
export default Root;


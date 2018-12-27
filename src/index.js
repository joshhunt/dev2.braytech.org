import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

class AppEntry extends React.Component {
  constructor(props) {
    super();
    this.state = {
      updateAvailable: false
    };
  }

  config = {
    onUpdate: (registration) => {
      this.setState({
        updateAvailable: true
      })
    },
    onSuccess: (registration) => {
      
    }
  }

  componentDidMount() {
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: http://bit.ly/CRA-PWA
    serviceWorker.register(this.config);
  }

  render() {
    return <App updateAvailable={this.state.updateAvailable} />
  }
}

ReactDOM.render(<AppEntry />, document.getElementById('root'));



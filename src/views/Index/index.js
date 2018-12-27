import React from 'react';
import ReactMarkdown from 'react-markdown';
import Moment from 'react-moment';
import ObservedImage from '../../components/ObservedImage';
import captainsLog from '../../data/captainsLog'

import './styles.css';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.setPageDefault('light');
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.props.setPageDefault(false);
  }

  render() {
    return (
      <div className='view' id='index'>
        <ObservedImage className='image bg' src='/static/images/blur_wall.jpg' />
        <div className='logo-feature'>
          <div className='device'>
            <span className='destiny-clovis_bray_device' />
          </div>
          Braytech
        </div>
        <div className='changelog'>
          {captainsLog.map(entry => {
            return (
              <div key={entry.version} className='entry'>
                <div className='header'>
                  <div className='version'>{entry.version}</div>
                  <Moment fromNow>{entry.date}</Moment>
                </div>
                <ReactMarkdown className='content' source={entry.content} />
              </div>
            );
          }).reverse()}
        </div>
      </div>
    );
  }
}

export default Index;

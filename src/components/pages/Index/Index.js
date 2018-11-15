import React, { Component } from 'react';
import cx from 'classnames';
import ReactMarkdown from 'react-markdown';
import Moment from 'react-moment';
import ObservedImage from '../../ObservedImage';

import './Index.css';

class Index extends Component {
  constructor() {
    super();
    this.state = {
      blogs: false
    };
  }

  componentDidMount() {
    fetch(`https://tc01.upliftnaturereserve.com/api/collections/get/bt_blog?token=account-4a9e85d78c6ba5e49fffcd3fa55578`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        let blogs = data.entries;
        this.setState({
          blogs
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    if (!this.state.blogs) {
      return (
        <div className="view" id="index">
          <div className="blogs">
            <h4>Loading updates</h4>
          </div>
        </div>
      );
    } else {
      return (
        <div className="view" id="index">
          <div className="blogs">
            <h4>Updates</h4>
            <div className="entries">
              {this.state.blogs.map(entry => {
                return (
                  <div key={entry._id} className="entry">
                    <div className="title">{entry.title}</div>
                    <Moment fromNow>{entry._created * 1000}</Moment>
                    <ReactMarkdown className="content" source={entry.content} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Index;

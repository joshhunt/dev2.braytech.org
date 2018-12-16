import React from 'react';

import './styles.css';

class Pride extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.setPageDefault('light');
  }

  componentWillUnmount() {
    this.props.setPageDefault(false);
  }

  render() {
    

    return (
      <div className='view' id='pride'>
        <div className='message'>
          <div className='name'>Pride</div>
          <div className='description'>
            <p>I've never been big on the whole gay pride thing. I think it's a projection of my own fear and other issues that I need to work out with myself. That said, as I am a gay man who plays video games online, most often with heterosexual men, I feel it's important to share a few points with those who may listen.</p>
            <p>I'm the kind of guy who remains silent and will mirror the behaviours of others online in order to avoid conflict. You know, bro talk. But when you use words like <em>faggot</em> or call something <em>gay</em>, you cultivate a hostile envionment for your quiet peers, and not just the gay ones.</p>
            <p>I play games online, like Destiny, with a clan because it's fun to play together. I shouldn't need to remind my online friends that I'm gay and that you're hurting my feelings when you use derogatory terms.</p>
            <p>It's all good fun to make penetrative jokes, assuming everyone involved is on board with it, but for fuck's sake, be a good fucking human. It's 2018.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Pride;

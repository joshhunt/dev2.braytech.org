import React from 'react';

const errorHandler = props => {
  let error;

  let kind = props;
  let bungie = parseInt(kind) > 1 ? kind : false;

  switch (kind) {
    case 'privacy':
      error = (
        <>
          <div className='sub-header'>
            <div>Profile privacy</div>
          </div>
          <p>Your profile data may be set to private on Bungie.net.</p>
          <p>
            You can check here <a href='https://www.bungie.net/en/Profile/Settings?category=Privacy' target='_blank' rel='noopener noreferrer'>https://www.bungie.net&hellip;</a> Look for <em>Show my Progression (what I've completed in Destiny, and my current status)</em>.
          </p>
          <p>If I'm mistaken, I apologise. This error is generated when character progression data is unavailable, and this is the most likely cause.</p>
        </>
      );
      break;

    default:
      error = (
        <>
          <div className='sub-header'>
            <div>Don't touch my stuff</div>
          </div>
          <p>There was an unspecified error. It's pretty rude to break someone else's stuff like this...</p>
        </>
      );
  }

  if (bungie) {
    error = (
      <>
        <div className='sub-header'>
          <div>Bungie error</div>
        </div>
        <p>It's likely that the game is undergoing backend maintenance. Check back soon.</p>
      </>
    );
  }

  return <div className='error'>{error}</div>;
};

export default errorHandler;

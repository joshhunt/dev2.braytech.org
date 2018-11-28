import React from 'react';

const ErrorHandler = props => {
  let error;

  let kind = props.kind;
  let bungie = parseInt(kind) > 1 ? kind : false;

  switch (kind) {
    case 'privacy':
      error = (
        <>
          <h4>Profile privacy</h4>
          <p>Your profile data may be set to private on Bungie.net.</p>
          <p>
            You can check here{' '}
            <a href='https://www.bungie.net/en/Profile/Settings?category=Privacy' target='_blank' rel='noopener noreferrer'>
              https://www.bungie.net/en/Profile/Settings?category=Privacy
            </a>
            . Look for <em>Show my Progression (what I've completed in Destiny, and my current status)</em>.
          </p>
          <p>If I'm mistaken, I apologise. This error is generated when character progression data is unavailable, and this is the most likely cause.</p>
        </>
      );
      break;

    default:
      error = (
        <>
          <h4>Don't touch my stuff</h4>
          <p>There was an unspecified error. It's pretty rude to break someone else's stuff like this...</p>
        </>
      );
  }

  if (bungie) {
    error = (
      <>
        <h4>Bungie error</h4>
        <p>It's likely that the game is undergoing backend maintenance. Check back soon.</p>
      </>
    );
  }

  return (
    <div className='view' id='error'>
      <div className='icon'>!</div>
      <div className='text'>{error}</div>
    </div>
  );
};

export default ErrorHandler;

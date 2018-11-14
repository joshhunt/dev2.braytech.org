import React from 'react';

const ErrorHandler = (props) => {

  let error;

  switch (props.kind) {
    case "privacy":
      error = <>
        <h4>Profile privacy</h4>
        <p>Your profile data may be set to private on Bungie.net.</p>
        <p>You can check here <a href="https://www.bungie.net/en/Profile/Settings?category=Privacy" target="_blank" rel="noopener noreferrer">https://www.bungie.net/en/Profile/Settings?category=Privacy</a>. Look for <em>Show my Progression (what I've completed in Destiny, and my current status)</em>.</p>
        <p>If I'm mistaken, I apologise. This error is generated when character progression data is unavailable, and this is the most likely cause.</p>
      </>;

      break;
    default:
      error = <>
        <h4>Don't touch my stuff</h4>
        <p>There was an unspecified error. It's pretty rude to break someone else's stuff like this...</p>
      </>;

  }

  return (
    <div className="view" id="error">
      <div className="icon">!</div>
      <div class="text">
        {error}
      </div>      
    </div>
  )
}

export default ErrorHandler;
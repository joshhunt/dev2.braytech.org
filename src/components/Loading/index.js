import React from 'react';
import { withNamespaces } from 'react-i18next';
import packageJSON from '../../../package.json';

const LOADING_STATE = {
  error: 'Error',
  version: 'Checking data',
  fetching: 'Downloading manifest data',
  almost: 'So close',
  fetchingProfile: 'Fetching profile',
  else: 'Preparing'
};

function Loading({ t, state }) {
  const message = LOADING_STATE[state] || LOADING_STATE.else;

  return (
    <div className='view' id='loading'>
      <div className='logo-feature'>
        <div className='device'>
          <span className='destiny-clovis_bray_device' />
        </div>
      </div>
      <h4>Braytech {packageJSON.version}</h4>
      <div className='download'>{t(message)}</div>
    </div>
  );
}

export default withNamespaces()(Loading);

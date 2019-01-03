import React from 'react';
import { withNamespaces } from 'react-i18next';

import { ProfileNavLink } from '../../components/ProfileLink';

function ClanNav({ t, showStatChildren }) {
  return (
    <ul className='list'>
      <li className='linked'>
        <ProfileNavLink to='/clan' exact>
          {t('About')}
        </ProfileNavLink>
      </li>
      <li className='linked'>
        <ProfileNavLink to='/clan/roster'>{t('Roster')}</ProfileNavLink>
      </li>
      <li className='linked'>
        <ProfileNavLink to='/clan/stats'>{t('Stats')}</ProfileNavLink>
      </li>

      {showStatChildren && (
        <>
          <li className='linked child'>
            <ProfileNavLink to='/clan/stats' exact>
              Vanguard
            </ProfileNavLink>
          </li>
          <li className='linked child'>
            <ProfileNavLink to='/clan/stats/crucible'>Crucible</ProfileNavLink>
          </li>
          <li className='linked child'>
            <ProfileNavLink to='/clan/stats/gambit'>Gambit</ProfileNavLink>
          </li>
        </>
      )}
    </ul>
  );
}

export default withNamespaces()(ClanNav);

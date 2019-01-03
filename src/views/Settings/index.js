import React from 'react';
import { withNamespaces } from 'react-i18next';

import ProgressCheckbox from '../../components/ProgressCheckbox';
import { getLanguageInfo } from '../../utils/languageInfo';

import './styles.css';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    let initLanguage = this.props.i18n.getCurrentLanguage();
    this.state = {
      language: {
        current: initLanguage,
        selected: initLanguage
      },
      collectibles: {}
    };
  }

  selectLanguage(lang) {
    this.setState({
      selected: lang
    });
  }

  saveAndRestart() {
    const { i18n } = this.props;
    i18n.setCurrentLanguage(this.state.language.selected);
    setTimeout(() => {
      window.location.reload();
    }, 50);
  }

  componentDidMount() {
    this.props.setPageDefault('light');
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.props.setPageDefault(false);
  }

  render() {
    const { t, availableLanguages } = this.props;

    let languageButtons = availableLanguages.map(code => {
      let langInfo = getLanguageInfo(code);
      return (
        <li
          key={code}
          onClick={() => {
            this.selectLanguage(code);
          }}
        >
          <ProgressCheckbox checked={this.state.language.selected === code} text={langInfo.name || langInfo.code} />
        </li>
      );
    });

    // 0 show everything
    // 1 hide in triumphs
    // 2 hide in checklists

    let collectiblesButtons = (
      <>
        <li key='0' onClick={() => {}}>
          <ProgressCheckbox checked={true} text='Show everything' />
        </li>
        <li key='1' onClick={() => {}}>
          <ProgressCheckbox checked={false} text='Hide completed triumphs' />
        </li>
        <li key='2' onClick={() => {}}>
          <ProgressCheckbox checked={false} text='Hide discovered checklist items' />
        </li>
      </>
    );

    return (
      <div className='view' id='settings'>
        <div className='module language'>
          <div className='sub-header sub'>
            <div>{t('Language')}</div>
          </div>
          <ul className='list settings'>{languageButtons}</ul>
          {this.state.language.current !== this.state.language.selected ? (
            <ul className='list'>
              <li
                className='linked'
                onClick={() => {
                  this.saveAndRestart();
                }}
              >
                <div className='name'>{t('Save and restart')}</div>
              </li>
            </ul>
          ) : null}
        </div>
        <div className='module collectibles'>
          <div className='sub-header sub'>
            <div>{t('Collectibles')}</div>
          </div>
          <ul className='list settings'>{collectiblesButtons}</ul>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(Settings);

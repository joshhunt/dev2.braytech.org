import React from 'react';
import './styles.css';
import { withNamespaces } from 'react-i18next';
import { getLanguageInfo } from '../../utils/languageInfo';
import cx from 'classnames';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    const { i18n } = this.props;
    let initLanguage = i18n.getCurrentLanguage()
    this.state = {
      current: initLanguage,
      selected: initLanguage
    };
  }

  selectLanguage(lang) {
    this.setState({
      selected: lang
    });
  }

  saveAndRestart() {
    const { i18n } = this.props;
    i18n.setCurrentLanguage(this.state.selected);
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
          className={cx('linked', this.state.selected === code ? 'selected' : '')}
        >
          <div className='name'>{langInfo.name || langInfo.code}</div>
        </li>
      );
    });

    let applyButtons =
      this.state.current !== this.state.selected ? (
        <div className='buttons'>
          <div
            className='button'
            onClick={() => {
              this.saveAndRestart();
            }}
          >
            {t('Save and Restart')}
          </div>
        </div>
      ) : null;

    return (
      <div className='view' id='settings'>
        <div className={cx('module', 'language')}>
          <div className='sub-header'>
            <div>{t('Language')}</div>
          </div>
          <ul className='list'>{languageButtons}</ul>
          {applyButtons}
        </div>
      </div>
    );
  }
}

export default withNamespaces()(Settings);

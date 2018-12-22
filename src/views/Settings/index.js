import React from 'react';
import './styles.css';
import { withNamespaces } from 'react-i18next';
import { getLanguageInfo } from '../../utils/languageInfo';
import ObservedImage from '../../components/ObservedImage';
import cx from 'classnames';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    const {i18n} = this.props;
    this.state = {};
    this.state.selected = this.state.current = i18n.getCurrentLanguage();
  }

  selectLanguage(lang){
    this.state.selected = lang;
    this.setState(this.state);
  }

  saveAndRestart(){
    const {i18n} = this.props;
    i18n.setCurrentLanguage(this.state.selected);
    setTimeout(()=>{
      window.location.reload();
    },50);
  }

  render() {
    const {t, availableLanguages} = this.props;
    let languageButtons = availableLanguages.map((code)=>{
      let langInfo = getLanguageInfo(code);
      return <div key={code} 
      onClick={()=>{this.selectLanguage(code)}}
      className={cx('node', this.state.selected == code ? 'selected' : '')}>
        <div className='images'>
          <ObservedImage className={cx('image', 'icon')} src={`${langInfo.icon}`} />
        </div>
        {langInfo.name || langInfo.code}
      </div>
    });
    let applyButtons = this.state.current != this.state.selected ?
      <div className="buttons">
        <div className="button"
        onClick={()=>{this.saveAndRestart()}}>
          {t('Save and Restart')}
        </div>
      </div>:
      null;
    return (
      <div className='view' id='settings'>
        <div className={cx('module', 'languages')}>
          <div className='sub-header'>
            <div>{t('Select Language')}</div>
          </div>
            <ul className='content'>
              {languageButtons}
            </ul>
            {applyButtons}
        </div>
      </div>
    );
  }
}

export default withNamespaces()(Settings);

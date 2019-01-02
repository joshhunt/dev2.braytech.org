import React from 'react';
import cx from 'classnames';

import './styles.css';

class ProgressCheckbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let classNames = this.props.classNames;
    let completed = this.props.completed || this.props.checked;
    let text = this.props.text;


    return (
      <div className={cx('check-box', classNames, { completed: completed })}>
        <div className={cx('check', { ed: completed })} />
        <div className='text'>
          {text}
        </div>
      </div>
    );
  }
}

export default ProgressCheckbox;

import React from 'react';
import { Link } from 'react-router-dom'
import Globals from '../../Globals';
import cx from 'classnames';
import ObservedImage from '../../ObservedImage';

import './Index.css';

const Index = () => {
  return (
    <div className="view" id="index">
      <ObservedImage className={cx(
            "image",
            "bg"
          )}
        src="/static/images/braytech.jpg" />
    </div>
  )
}

export default Index;
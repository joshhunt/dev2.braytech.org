import React from 'react';
import cx from 'classnames'

import regionChests from './regionChests'
import lostSectors from './lostSectors'
import adventures from './adventures'
import sleeperNodes from './sleeperNodes'
import './Checklists.css'

class Checklists extends React.Component {
  constructor(props) {
    super(props);

  }
  
  /*
    checklists  
      region chests
      lost sectors
      adventures
      sleeper nodes
      ghost scans
      latent memories
      caydes journals
  */
  
  render() {

    return (
      <div className="checklists">
        {regionChests(this.props)}
        {lostSectors(this.props)}
        {adventures(this.props)}
        {sleeperNodes(this.props)}
      </div>
    )
  }
}

export default Checklists;
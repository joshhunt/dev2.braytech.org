import React from 'react';
import cx from 'classnames'

import regionChests from './Checklists/regionChests'
import lostSectors from './Checklists/lostSectors'
import adventures from './Checklists/adventures'
import sleeperNodes from './Checklists/sleeperNodes'
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
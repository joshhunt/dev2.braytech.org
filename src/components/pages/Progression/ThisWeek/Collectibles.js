import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../../ObservedImage';

import { enumerateCollectibleState } from '../../../destinyEnums';

class Collectibles extends React.Component {
  render() {
    let manifest = this.props.manifest;

    let characterCollectibles = this.props.state.response.profile.characterCollectibles.data;
    let profileCollectibles = this.props.state.response.profile.profileCollectibles.data.collectibles;
    let characterId = this.props.route.match.params.characterId;

    let collectiblesRequested = this.props.hashes;

    let collectibles = [];
    collectiblesRequested.forEach(hash => {
      let collectibleDefinition = manifest.DestinyCollectibleDefinition[hash];

      let link = false;

      // selfLink

      try {
        let reverse1;
        let reverse2;
        let reverse3;

        manifest.DestinyCollectibleDefinition[hash].presentationInfo.parentPresentationNodeHashes.forEach(element => {
          let skip = false;
          manifest.DestinyPresentationNodeDefinition[498211331].children.presentationNodes.forEach(parentsChild => {
            if (manifest.DestinyPresentationNodeDefinition[parentsChild.presentationNodeHash].children.presentationNodes.filter(el => el.presentationNodeHash === element).length > 0) {
              skip = true;
              return; // if hash is a child of badges, skip it
            }
          });

          if (reverse1 || skip) {
            return;
          }
          reverse1 = manifest.DestinyPresentationNodeDefinition[element];
        });

        let iteratees = reverse1.presentationInfo ? reverse1.presentationInfo.parentPresentationNodeHashes : reverse1.parentNodeHashes;
        iteratees.forEach(element => {
          if (reverse2) {
            return;
          }
          reverse2 = manifest.DestinyPresentationNodeDefinition[element];
        });

        if (reverse2 && reverse2.parentNodeHashes) {
          reverse3 = manifest.DestinyPresentationNodeDefinition[reverse2.parentNodeHashes[0]];
        }

        link = `/progression/${this.props.route.match.params.membershipType}/${this.props.route.match.params.membershipId}/${this.props.route.match.params.characterId}/collections/${reverse3.hash}/${reverse2.hash}/${reverse1.hash}/${hash}`;
      } catch (e) {
        console.log(e);
      }

      //

      let state;
      if (profileCollectibles[hash]) {
        state = profileCollectibles[hash] ? profileCollectibles[hash].state : 0;
      } else if (characterCollectibles[characterId].collectibles[hash]) {
        state = characterCollectibles[characterId].collectibles[hash] ? characterCollectibles[characterId].collectibles[hash].state : 0;
      } else {
        state = 0;
      }

      if (enumerateCollectibleState(state).invisible) {
        return;
      }

      collectibles.push(
        <li
          key={collectibleDefinition.hash}
          className={cx('tooltip', {
            completed: !enumerateCollectibleState(state).notAcquired
          })}
          data-itemhash={collectibleDefinition.itemHash}
        >
          <div className="icon">
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${collectibleDefinition.displayProperties.icon}`} />
          </div>
          <div className="text">
            <div className="name">{collectibleDefinition.displayProperties.name}</div>
          </div>
          {link && this.props.selfLink ? <Link to={link} /> : null}
        </li>
      );
    });

    return collectibles;
  }
}

export default Collectibles;

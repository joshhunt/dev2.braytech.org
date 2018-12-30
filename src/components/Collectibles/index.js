import React from 'react';
import cx from 'classnames';

import ObservedImage from '../ObservedImage';
import { ProfileLink } from '../ProfileLink';

import { enumerateCollectibleState } from '../../utils/destinyEnums';

import './styles.css';

class Collectibles extends React.Component {
  constructor(props) {
    super(props);

    this.scrollToRecordRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.quaternaryHash && this.scrollToRecordRef.current !== null) {
      window.scrollTo({
        top: this.scrollToRecordRef.current.offsetTop + this.scrollToRecordRef.current.offsetHeight / 2 - window.innerHeight / 2
      });
    }
  }

  render() {
    const manifest = this.props.manifest;
    const characterId = this.props.characterId;

    const characterCollectibles = this.props.response.profile.characterCollectibles.data;
    const profileCollectibles = this.props.response.profile.profileCollectibles.data;

    const highlight = this.props.highlight;

    let collectibles = [];

    if (this.props.node) {
      let tertiaryDefinition = manifest.DestinyPresentationNodeDefinition[this.props.node];

      if (tertiaryDefinition.children.presentationNodes.length > 0) {
        tertiaryDefinition.children.presentationNodes.forEach(node => {
          let nodeDefinition = manifest.DestinyPresentationNodeDefinition[node.presentationNodeHash];

          let row = [];
          let rowState = [];

          nodeDefinition.children.collectibles.forEach(child => {
            let collectibleDefinition = manifest.DestinyCollectibleDefinition[child.collectibleHash];

            let state = 0;
            let scope = profileCollectibles.collectibles[child.collectibleHash] ? profileCollectibles.collectibles[child.collectibleHash] : characterCollectibles[characterId].collectibles[child.collectibleHash];
            if (scope) {
              state = scope.state;
            }

            rowState.push(state);

            row.push(
              <li
                key={collectibleDefinition.hash}
                className={cx('item', 'tooltip', {
                  completed: !enumerateCollectibleState(state).notAcquired && !enumerateCollectibleState(state).invisible
                })}
                data-itemhash={collectibleDefinition.itemHash}
              >
                <div className='icon'>
                  <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${collectibleDefinition.displayProperties.icon}`} />
                </div>
              </li>
            );
          });

          collectibles.push(
            <li
              key={nodeDefinition.hash}
              className={cx('is-set', {
                completed: rowState.filter(collectible => !enumerateCollectibleState(collectible).notAcquired).length === rowState.length
              })}
            >
              <div className='set'>
                <ul className='list'>{row}</ul>
              </div>
              <div className='text'>
                <div className='name'>{nodeDefinition.displayProperties.name}</div>
              </div>
            </li>
          );
        });
      } else {
        tertiaryDefinition.children.collectibles.forEach(child => {
          let collectibleDefinition = manifest.DestinyCollectibleDefinition[child.collectibleHash];

          let state = 0;
          let scope = profileCollectibles.collectibles[child.collectibleHash] ? profileCollectibles.collectibles[child.collectibleHash] : characterCollectibles[characterId].collectibles[child.collectibleHash];
          if (scope) {
            state = scope.state;
          }

          if (enumerateCollectibleState(state).invisible) {
            return;
          }
          // eslint-disable-next-line eqeqeq
          let ref = highlight == collectibleDefinition.hash ? this.scrollToRecordRef : null;

          if (collectibleDefinition.redacted) {
            collectibles.push(
              <li
                key={collectibleDefinition.hash}
                ref={ref}
                className={cx('redacted', 'tooltip', {
                  // eslint-disable-next-line eqeqeq
                  highlight: highlight && highlight == collectibleDefinition.hash
                })}
                data-itemhash='343'
              >
                <div className='icon'>
                  <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${manifest.settings.destiny2CoreSettings.undiscoveredCollectibleImage}`} />
                </div>
                <div className='text'>
                  <div className='name'>Classified</div>
                </div>
              </li>
            );
          } else {
            collectibles.push(
              <li
                key={collectibleDefinition.hash}
                ref={ref}
                className={cx('tooltip', {
                  completed: !enumerateCollectibleState(state).notAcquired,
                  // eslint-disable-next-line eqeqeq
                  highlight: highlight && highlight == collectibleDefinition.hash
                })}
                data-itemhash={collectibleDefinition.itemHash}
              >
                <div className='icon'>
                  <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${collectibleDefinition.displayProperties.icon}`} />
                </div>
                <div className='text'>
                  <div className='name'>{collectibleDefinition.displayProperties.name}</div>
                </div>
              </li>
            );
          }
        });
      }
    } else {
      let collectiblesRequested = this.props.hashes;

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

          link = `/collections/${reverse3.hash}/${reverse2.hash}/${reverse1.hash}/${hash}`;
        } catch (e) {
          console.log(e);
        }

        //
        let state = 0;
        let scope = profileCollectibles.collectibles[hash] ? profileCollectibles.collectibles[hash] : characterCollectibles[characterId].collectibles[hash];
        if (scope) {
          state = scope.state;
        }

        if (enumerateCollectibleState(state).invisible) {
          return;
        }

        collectibles.push(
          <li
            key={collectibleDefinition.hash}
            className={cx('tooltip', {
              linked: link && this.props.selfLink,
              completed: !enumerateCollectibleState(state).notAcquired
            })}
            data-itemhash={collectibleDefinition.itemHash}
          >
            <div className='icon'>
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${collectibleDefinition.displayProperties.icon}`} />
            </div>
            <div className='text'>
              <div className='name'>{collectibleDefinition.displayProperties.name}</div>
            </div>
            {link && this.props.selfLink ? <ProfileLink to={link} /> : null}
          </li>
        );
      });
    }

    return collectibles;
  }
}

export default Collectibles;

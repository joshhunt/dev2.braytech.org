import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import ObservedImage from '../../../ObservedImage';

import './LoreBook.css';

class LoreBook extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const manifest = this.props.manifest;

    const bookCovers = {
      1975975321: '037E-0000131E.png',
      396866327: '01A3-0000132F.png',
      1420597821: '037E-00001308.png',
      648415847: '037E-00001311.png',
      335014236: '037E-00001BE0.png',
      3472295814: '0560-000000D4.png',
      1582800871: '01A3-00001330.png',
      2541573665: '01A3-00001336.png',
      3305936921: '037E-0000130D.png',
      3062577328: '01A3-000012F4.png',
      2026987060: '037E-00001328.png',
      2325462143: '037E-00001323.png'
    };

    let loreBook, loreRecord, profile;

    if (this.props.match.params.tertiary) {
      loreBook = manifest.DestinyPresentationNodeDefinition[this.props.match.params.tertiary];
      loreRecord = manifest.DestinyRecordDefinition[this.props.match.params.recordHash];
      profile = this.props.response.profile;

      console.log(loreBook, loreRecord);

      console.log(this);

      let pages = [];
      loreBook.children.records.forEach(child => {
        let record = manifest.DestinyRecordDefinition[child.recordHash];

        if (!record.loreHash) {
          return;
        }

        let isActive = (match, location) => {
          if (this.props.match.params.secondary === undefined && loreBook.children.records.indexOf(child) === 0) {
            return true;
          } else if (match) {
            return true;
          } else {
            return false;
          }
        };

        let breakApart = this.props.location.pathname.split('read');

        pages.push(
          <li key={record.hash} className='linked'>
            <NavLink isActive={isActive} to={`${breakApart[0]}read/${record.hash}`}>
              {record.displayProperties.name}
            </NavLink>
          </li>
        );
      });

      if (loreRecord) {
        let lore = manifest.DestinyLoreDefinition[loreRecord.loreHash];

        return (
          <div className='presentation-node' id='lore-book'>
            <div className='wrapper page'>
              <div className='top'>
                <div className='properties'>
                  <div className='sub-title'>{loreBook.displayProperties.name}</div>
                  <div className='name'>{lore.displayProperties.name}</div>
                </div>
              </div>
              <div>
                <div className='cover'>
                  <ObservedImage className='image' src={`/static/images/extracts/books/${bookCovers[loreBook.hash]}`} />
                </div>
                <div className='contents-link'>
                  <ul className='list secondary'>
                    <li className='linked'>
                      <Link to={`${this.props.location.pathname.split('read')[0]}read`}>Contents</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <ReactMarkdown className='text' source={lore.displayProperties.description} />
            </div>
          </div>
        );
      } else {
        return (
          <div className='presentation-node' id='lore-book'>
            <div className='wrapper pages'>
              <div className='top'>
                <div className='properties'>
                  <div className='sub-title'>{pages.length} pages</div>
                  <div className='name'>{loreBook.displayProperties.name}</div>
                </div>
              </div>
              <div className='cover'>
                <ObservedImage className='image' src={`/static/images/extracts/books/${bookCovers[loreBook.hash]}`} />
              </div>
              <div className='pages-list'>
                <ul className='list secondary'>{pages}</ul>
              </div>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div className='view' id='lore-book'>
          <></>
        </div>
      );
    }
  }
}

export default LoreBook;

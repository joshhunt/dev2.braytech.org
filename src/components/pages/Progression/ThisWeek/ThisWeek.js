import React from 'react';

import './ThisWeek.css';
import Records from './Records';
import Collectibles from './Collectibles';
import '../RecordItems.css';
import '../CollectionItems.css';

class ThisWeek extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
    }

    

  }
  
  render() {

    const cycleInfo = {
      epoch: {
        // start of cycle in UTC
        ascendant: new Date('September 4 2018 17:00 UTC').getTime(),
        curse: new Date('September 11 2018 17:00 UTC').getTime(),
        ep: new Date('May 8 2018 17:00 UTC').getTime()
      },
      cycle: {
        // how many week cycle
        ascendant: 6,
        curse: 3,
        ep: 5
      },
      elapsed: {}, // elapsed time since cycle started
      week: {} // current week in cycle
    };

    const time = new Date().getTime();
    const msPerWk = 604800000;

    for (var cycle in cycleInfo.cycle) {
      cycleInfo.elapsed[cycle] = time - cycleInfo.epoch[cycle];
      cycleInfo.week[cycle] =
        Math.floor((cycleInfo.elapsed[cycle] / msPerWk) % cycleInfo.cycle[cycle]) + 1;
    }

    const consolidatedInfo = {
      curse: {
        1: {
          intensity: "Pestersome",
          triumphs: [
            // DestinyRecordDefinition.Hashes
            2144075646, // The Scorn Champion (Heroic Blind Well)
            3675740696, // Hidden Riches (Ascendant Chests)
            2769541312, // Broken Courier (Weekly Mission)
            1768837759 // Bridge Troll (Hidden Boss in Weekly Mission)
          ],
          items: [], // DestinyItemDefinition.Hashes
          collectibles: [] // DestinyCollectableDefinition.Hashes
        },
        2: {
          intensity: "Obstructive",
          triumphs: [
            2144075647, // The Hive Champion (Heroic Blind Well)
            3675740699, // Bolder Fortunes (Ascendant Chests)
            2419556790, // The Oracle Engine (Weekly Mission)
            2968758821, // Aggro No (Hidden Boss in Weekly Mission)
            202137963 // Twinsies (Kill ogres in Weekly Mission within 5 secs of each other)
          ],
          items: [],
          collectibles: []
        },
        3: {
          intensity: "Deadly",
          triumphs: [
            2144075645, // The Taken Champion (Heroic Blind Well)
            3675740698, // War Chests (Ascendant Chests)
            749838902, // Into the Unknown (Visit Mara)
            1842255613, // Fideicide II (Bones in Mara's Throne World)
            2314271318, // Never Again (Complete Shattered Throne)
            1290451257, // Seriously, Never Again (Complete Shattered Throne, Solo, 0 deaths)
            3309476373, // A Thorny Predicament (1 Phase Vorgeth in the Shattered Throne)
            851701008, // Solo-nely (Complete Shattered Throne, Solo)
            1621950319, // Come at Me (Complete Shattered Throne, wearing full set of unpurified Reverie Dawn)
            2029263931, // Curse This (Complete Shattered Throne, 0 deaths)
            3024450468, // Katabasis (Eggs in Shattered Throne)
            1842255612, // Fideicide I (Bones in Shattered Throne)
            1859033175, // Cosmogyre II (Bones in Shattered Throne)
            1859033168, // Archiloquy (Bones in Shattered Throne)
            1859033171, // Brephos I (Bones in Shattered Throne)
            2358176597, // Dark Monastery (Weekly Mission)
            1842255615, // Ecstasiate III (Bones in Weekly Mission)
            1236992882 // Odynom-Nom-Nom (Hidden Boss in Weekly Mission)
          ],
          items: [],
          collectibles: []
        }
      },
      ascendant: {
        1: {
          challenge: "Ouroborea",
          region: "Aphelion's Rest",
          triumphs: [
            3024450470, // Nigh II (Eggs)
            1842255608, // Imponent I (Bones)
            2856474352 // Eating Your Own Tail (Time Trial)
          ],
          items: [],
          collectibles: []
        },
        2: {
          challenge: "Forfeit Shrine",
          region: "Gardens of Esila",
          triumphs: [
            2974117611, // Imponent II (Eggs)
            1842255611, // Heresiology (Bones)
            3422458392 // Never Forfeit (Time Trial)
          ],
          items: [],
          collectibles: []
        },
        3: {
          challenge: "Shattered Ruins",
          region: "Spine of Keres",
          triumphs: [
            3024450469, // Imponent V (Eggs)
            1859033176, // Ecstasiate I (Bones)
            2858561750 // Shatter That Record (Time Trial)
          ],
          items: [],
          collectibles: []
        },
        4: {
          challenge: "Keep of Honed Edges",
          region: "Harbinger's Seclude",
          triumphs: [
            2974117605, // Imponent IV (Eggs)
            1842255614, // Ecstasiate II (Bones)
            3578247132 // Honed for Speed (Time Trial)
          ],
          items: [],
          collectibles: []
        },
        5: {
          challenge: "Agonarch Abyss",
          region: "Bay of Drowned Wishes",
          triumphs: [
            3024450465, // Palingenesis I (Eggs)
            1859033177, // Cosmogyre IV (Bones)
            990661957 // Argonach Agony (Time Trial)
          ],
          items: [],
          collectibles: []
        },
        6: {
          challenge: "Cimmerian Garrison",
          region: "Chamber of Starlight",
          triumphs: [
            3024450471, // Nigh I (Eggs)
            1859033173, // Brephos III (Bones)
            147323772 // Run the Gauntlet (Time Trial)
          ],
          items: [],
          collectibles: []
        }
      },
      ep: {
        1: {
          boss: "Nur Abath, Crest of Xol",
          items: [
            // https://github.com/Bungie-net/api/issues/732
            1887808042, // IKELOS_SG
            3243866699 // Worldline Ideasthesia: Torsion
          ],
          collectibles: [
            1041306082 // IKELOS_SG
          ]
        },
        2: {
          boss: "Kathok, Roar of Xol",
          triumphs: [],
          items: [
            1723472487, // IKELOS_SMG
            3243866698 // Worldline Ideasthesia: Anarkhiia
          ],
          collectibles: [
            2998976141 // IKELOS_SMG
          ]
        },
        3: {
          boss: "Damkath, The Mask",
          triumphs: [],
          items: [
            // https://youtu.be/lrPf16ZHevU?t=104
            847450546, // IKELOS_SR
            3243866697 //Worldline Ideasthesia: Cavalry
          ],
          collectibles: [
            1203091693 // IKELOS_SR
          ]
        },
        4: {
          boss: "Naksud, the Famine",
          triumphs: [],
          items: [
            1887808042, // IKELOS_SG
            1723472487, // IKELOS_SMG
            847450546, // IKELOS_SR
            3243866696 //  Worldline Ideasthesia: Faktura
          ],
          collectibles: [
            1041306082, // IKELOS_SG
            2998976141, // IKELOS_SMG
            1203091693 // IKELOS_SR
          ]
        },
        5: {
          boss: "Bok Litur, Hunger of Xol",
          triumphs: [],
          items: [
            1887808042, // IKELOS_SG
            1723472487, // IKELOS_SMG
            847450546, // IKELOS_SR
            3243866703 // Worldline Ideasthesia: Black Square
          ],
          collectibles: [
            1041306082, // IKELOS_SG
            2998976141, // IKELOS_SMG
            1203091693 // IKELOS_SR
          ]
        }
      }
    };

    console.log(cycleInfo.week);

    console.log(
      consolidatedInfo.curse[cycleInfo.week.curse],
      consolidatedInfo.ascendant[cycleInfo.week.ascendant],
      consolidatedInfo.ep[cycleInfo.week.ep]
    );

    return (
      <div className="this-week">
        <div className="module curse">
          <div className="sub-header">
            <div>The Curse</div>
          </div>
          <div className="content">
            <div className="sub-title">The Dreaming City</div>
            <h3>Cycle week {cycleInfo.week.curse}</h3>
            <ul className="list record-items">
              <Records selfLink {...this.props} hashes={consolidatedInfo.curse[cycleInfo.week.curse].triumphs} />
            </ul>
          </div>
        </div>
        <div className="module">
          <div className="sub-header">
            <div>Ascendant challenge</div>
          </div>
          <div className="content">
            <div className="sub-title">{consolidatedInfo.ascendant[cycleInfo.week.ascendant].region}</div>
            <h3>{consolidatedInfo.ascendant[cycleInfo.week.ascendant].challenge}</h3>
            <ul className="list record-items">
              <Records selfLink {...this.props} hashes={consolidatedInfo.ascendant[cycleInfo.week.ascendant].triumphs} />
            </ul>
          </div>
        </div>
        <div className="module">
          <div className="sub-header">
            <div>Escalation Protocol</div>
          </div>
          <div className="content">
            <div className="sub-title">Mars</div>
            <h3>{consolidatedInfo.ep[cycleInfo.week.ep].boss}</h3>
            <ul className="list collection-items">
              <Collectibles selfLink {...this.props} hashes={consolidatedInfo.ep[cycleInfo.week.ep].collectibles} />
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default ThisWeek;

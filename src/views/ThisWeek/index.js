import React from 'react';

import Records from '../../components/Records';
import Collectibles from '../../components/Collectibles';
import './styles.css';
import { withNamespaces } from 'react-i18next';

class ThisWeek extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {t} = this.props;
    const manifest = this.props.manifest;
    const milestones = this.props.response.milestones;

    const resetTime = '17:00 UTC';

    const cycleInfo = {
      epoch: {
        // start of cycle in UTC
        ascendant: new Date(`September 4 2018 ${resetTime}`).getTime(),
        curse: new Date(`September 11 2018 ${resetTime}`).getTime(),
        ep: new Date(`May 8 2018 ${resetTime}`).getTime()
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
      cycleInfo.week[cycle] = Math.floor((cycleInfo.elapsed[cycle] / msPerWk) % cycleInfo.cycle[cycle]) + 1;
    }

    const consolidatedInfo = {
      curse: {
        1: {
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
          challenge: t('Ouroborea'),
          region: t("Aphelion's Rest"),
          triumphs: [
            3024450470, // Nigh II (Eggs)
            1842255608, // Imponent I (Bones)
            2856474352 // Eating Your Own Tail (Time Trial)
          ],
          items: [],
          collectibles: []
        },
        2: {
          challenge: t('Forfeit Shrine'),
          region: t('Gardens of Esila'),
          triumphs: [
            2974117611, // Imponent II (Eggs)
            1842255611, // Heresiology (Bones)
            3422458392 // Never Forfeit (Time Trial)
          ],
          items: [],
          collectibles: []
        },
        3: {
          challenge: t('Shattered Ruins'),
          region: t('Spine of Keres'),
          triumphs: [
            3024450469, // Imponent V (Eggs)
            1859033176, // Ecstasiate I (Bones)
            2858561750 // Shatter That Record (Time Trial)
          ],
          items: [],
          collectibles: []
        },
        4: {
          challenge: t('Keep of Honed Edges'),
          region: t("Harbinger's Seclude"),
          triumphs: [
            2974117605, // Imponent IV (Eggs)
            1842255614, // Ecstasiate II (Bones)
            3578247132 // Honed for Speed (Time Trial)
          ],
          items: [],
          collectibles: []
        },
        5: {
          challenge: t('Agonarch Abyss'),
          region: t('Bay of Drowned Wishes'),
          triumphs: [
            3024450465, // Palingenesis I (Eggs)
            1859033177, // Cosmogyre IV (Bones)
            990661957 // Argonach Agony (Time Trial)
          ],
          items: [],
          collectibles: []
        },
        6: {
          challenge: t('Cimmerian Garrison'),
          region: t('Chamber of Starlight'),
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
          boss: 'Nur Abath, Crest of Xol',
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
          boss: 'Kathok, Roar of Xol',
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
          boss: 'Damkath, The Mask',
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
          boss: 'Naksud, the Famine',
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
          boss: 'Bok Litur, Hunger of Xol',
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
      },
      nightfall: {
        3145298904: {
          // The Arms Dealer
          triumphs: [
            3340846443, // The Arms Dealer
            4267516859 // Trash the Thresher
          ],
          items: [],
          collectibles: [
            3036030066, // Tilt Fuse
            3490589921 // The Arms Dealer (Emblem)
          ]
        },
        3108813009: {
          // Warden of Nothing
          triumphs: [
            2836924866, // Warden of Nothing
            1469598452 // Solar Dance
          ],
          items: [],
          collectibles: [
            1279318101, // Warden's Law
            2263264048 // Warden of Nothing (Emblem)
          ]
        },
        3034843176: {
          // The Corrupted
          triumphs: [
            3951275509, // The Corrupted
            3641166665 // Relic Rumble
          ],
          items: [],
          collectibles: [
            1099984904, // Horror's Least
            1410290331 // The Corrupted (Emblem)
          ]
        },
        3280234344: {
          // Savathûn's Song
          triumphs: [
            2099501667, // Savathûn's Song
            1442950315 // The Best Defense
          ],
          items: [],
          collectibles: [
            1333654061, // Duty Bounds
            3490589926 // Savathûn's Song (Emblem)
          ]
        },
        3289589202: {
          // The Pyramidion
          triumphs: [
            1060780635, // The Pyramidion
            1142177491 // Siege Engine
          ],
          items: [],
          collectibles: [
            1152758802, // Silicon Neuroma
            3490589930 // The Pyramidion (Emblem)
          ]
        },
        3718330161: {
          // Tree of Probabilities
          triumphs: [
            2282894388, // Tree of Probabilities
            3636866482 // Laser Dodger
          ],
          items: [],
          collectibles: [
            1279318110, // D.F.A.
            3490589924 // Tree of Probabilities (Emblem)
          ]
        },
        3372160277: {
          // Lake of Shadows
          triumphs: [
            1329556468, // Lake of Shadows
            413743786 // Tether Time
          ],
          items: [],
          collectibles: [
            1602518767, // The Militia's Birthright
            3896331530 // Lake of Shadows (Emblem)
          ]
        },
        //1391780798: { // Broodhold - PS$ exclusive
        //  triumphs: [],
        //  items: [],
        //  collectibles: []
        //},
        3701132453: {
          // The Hollowed Lair
          triumphs: [
            3450793480, // The Hollowed Lair
            3847579126 // Arc Avoidance
          ],
          items: [],
          collectibles: [
            1074861258, // Mindbender's Ambition
            3314387486 // The Hollowed Lair (Emblem)
          ]
        },
        272852450: {
          // Will of the Thousands
          triumphs: [
            1039797865, // Will of the Thousands
            3013611925 // Three and Out
          ],
          items: [],
          collectibles: [
            2466440635, // Worm God Incarnation
            1766893928 // Will of the Thousands (Emblem)
          ]
        },
        4259769141: {
          // The Inverted Spire
          triumphs: [
            3973165904, // The Inverted Spire
            1498229894 //The Floor Is Lava
          ],
          items: [],
          collectibles: [
            1718922261, // Trichromatica
            3490589925 //The Inverted SPire (Emblem)
          ]
        },
        522318687: {
          // Strange Terrain
          triumphs: [
            165166474, // Strange Terrain
            1871570556 // Don't Take Five
          ],
          items: [],
          collectibles: [
            1534387877, // BrayTech Osprey
            1766893929 // Strange Terrain (Emblem)
          ]
        },
        1282886582: {
          // Exodus Crash
          triumphs: [
            1526865549, // Exodus Crash
            2140068897 // Faster than Lightning
          ],
          items: [],
          collectibles: [
            3036030067, // Impact Velocity
            3490589927 // Exodus Crash (Emblem)
          ]
        },
        936308438: {
          // A Garden World
          triumphs: [
            2692332187, // A Garden World
            1398454187 // The Quickening
          ],
          items: [],
          collectibles: [
            2448009818, //Universal Wavefunction
            3490589931 // A Garden World (Emblem)
          ]
        },
        1034003646: {
          // The Insight Terminus
          triumphs: [
            3399168111, // The Insight Terminus
            599303591 // Capture Completionist
          ],
          items: [],
          collectibles: [
            1186314105, // The Long Goodbye
            465974149 // Insight Terminus (Emblem)
          ]
        }
      },
      flashpoint: {
        538154339: {// FLASHPOINT: TITAN
          triumphs: [
            2542531058, // Flashpoint
            1632551190 // Heroically Adventurous
          ]
        },
        794779273: { //FLASHPOINT: IO
          triumphs: [
            2163667980, // Flashpoint
            3686586344 // Heroically Adventurous
          ]
        },
        905940422: { //FLASHPOINT: MERCURY
          triumphs: [
            2548580601, // Flashpoint
            3632308741 // Heroically Adventurous
          ]
        },
        2332272114: { //FLASHPOINT: EDZ
          triumphs: [
            855929237, // Flashpoint
            1683000545 // Heroically Adventurous
          ]
        },
        3232202236: { //FLASHPOINT: TANGLED SHORE
          triumphs: [
            2070013491 // Flashpoint
            // Has no 'Heroically Adventurous'

          ]
        },
        3588655854: { //FLASHPOINT: NESSUS
          triumphs: [
            1652021369, // Flashpoint
            633055621 // Heroically Adventurous
          ]
        },
        3929972810: { //FLASHPOINT: MARS
          triumphs: [
            1414820429, // Flashpoint
            1417930213 // Heroically Adventurous
          ]
        }

      }
    };

    // console.log(cycleInfo.week);
    // console.log(consolidatedInfo.curse[cycleInfo.week.curse], consolidatedInfo.ascendant[cycleInfo.week.ascendant], consolidatedInfo.ep[cycleInfo.week.ep]);

    // flashpoint    
    const flashpoint = manifest.DestinyMilestoneDefinition[463010297].quests[milestones[463010297].availableQuests[0].questItemHash];
    let nightfalls = [];
    // scored nightfall strikes
    milestones[2171429505].activities.filter(activity => activity.modifierHashes).forEach(activity => {
      let nightfall = manifest.DestinyActivityDefinition[activity.activityHash];

      nightfalls.push(
        <div key={nightfall.hash} className='content'>
          <div className='sub-title'>{manifest.DestinyDestinationDefinition[nightfall.destinationHash].displayProperties.name}</div>
          <h3>{nightfall.selectionScreenDisplayProperties.name}</h3>
          <ul className='list collection-items'>
            <Collectibles selfLink {...this.props} hashes={consolidatedInfo.nightfall[nightfall.hash].collectibles} />
          </ul>
          <ul className='list record-items'>
            <Records selfLink {...this.props} hashes={consolidatedInfo.nightfall[nightfall.hash].triumphs} ordered />
          </ul>
        </div>
      );
    });

    return (
      <div className='view' id='this-week'>
        <div className='module'>
          <div className='sub-header'>
            <div>{t('Flashpoint')}</div>
          </div>
          <div className='content'>
            <div
              className='sub-title'>{manifest.DestinyDestinationDefinition[flashpoint.destinationHash].displayProperties.name}</div>
            <h3>{flashpoint.displayProperties.name}</h3>
            <ul className='list record-items'>
              <Records selfLink {...this.props} hashes={consolidatedInfo.flashpoint[flashpoint.questItemHash].triumphs} ordered/>
            </ul>
          </div>
          <div className='sub-header'>
            <div>{t('Escalation Protocol')}</div>
          </div>
          <div className='content'>
            <div className='sub-title'>{t('Mars')}</div>
            <h3>{consolidatedInfo.ep[cycleInfo.week.ep].boss}</h3>
            <ul className='list collection-items'>
              <Collectibles selfLink {...this.props} hashes={consolidatedInfo.ep[cycleInfo.week.ep].collectibles} />
            </ul>
          </div>
        </div>
        <div className='module'>
          <div className='sub-header'>
            <div>{t('Nightfalls')}</div>
          </div>
          {nightfalls}
        </div>
        <div className='module curse'>
          <div className='sub-header'>
            <div>{t('The Curse')}</div>
          </div>
          <div className='content'>
            <div className='sub-title'>{t('The Dreaming City')}</div>
            <h3>{t('Cycle week')} {cycleInfo.week.curse}</h3>
            <ul className='list record-items'>
              <Records selfLink {...this.props} hashes={consolidatedInfo.curse[cycleInfo.week.curse].triumphs} ordered />
            </ul>
          </div>
        </div>
        <div className='module'>
          <div className='sub-header'>
            <div>{t('Ascendant challenge')}</div>
          </div>
          <div className='content'>
            <div className='sub-title'>{consolidatedInfo.ascendant[cycleInfo.week.ascendant].region}</div>
            <h3>{consolidatedInfo.ascendant[cycleInfo.week.ascendant].challenge}</h3>
            <ul className='list record-items'>
              <Records selfLink {...this.props} hashes={consolidatedInfo.ascendant[cycleInfo.week.ascendant].triumphs} ordered />
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(ThisWeek);

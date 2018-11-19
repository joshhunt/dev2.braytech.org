import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { enumerateRecordState } from '../../../destinyEnums';

import './Summaries.css';
import './Almost.css';

export const Almost = (props) => {

  let characterProgressions = props.state.ProfileResponse.characterProgressions.data;
  let profileProgressions = props.state.ProfileResponse.profileProgression.data;
  let profileRecords = props.state.ProfileResponse.profileRecords.data.records;
  let characterId = props.route.match.params.characterId;

  let manifest = props.manifest;

  let almost = [];

  let ignores = [];
  
  // ignore collections badges
  manifest.DestinyPresentationNodeDefinition[498211331].children.presentationNodes.forEach(child => {
    ignores.push(manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash].completionRecordHash);
    manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash].children.presentationNodes.forEach(subchild => {
      ignores.push(manifest.DestinyPresentationNodeDefinition[subchild.presentationNodeHash].completionRecordHash);
    });
  });
  
  // ignore triumph seals
  manifest.DestinyPresentationNodeDefinition[1652422747].children.presentationNodes.forEach(child => {
    ignores.push(manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash].completionRecordHash);
  });

  Object.entries(profileRecords).forEach(([key, record]) => {

    // ignore collections badges etc
    if (ignores.includes(parseInt(key, 10))) {
      return;
    }

    if (enumerateRecordState(record.state).invisible) {
      return;
    }

    let completionValueTotal = 0;
    let progressValueTotal = 0;

    record.objectives.forEach(obj => {

      let v = parseInt(obj.completionValue, 10);
      let p = parseInt(obj.progress, 10);

      completionValueTotal = completionValueTotal + v;
      progressValueTotal = progressValueTotal + (p > v ? v : p); // prevents progress values that are greater than the completion value from affecting the average

    });

    var mark = false;

    let distance = progressValueTotal / completionValueTotal;
    if (distance > 0.81 && distance < 1.00) {
      mark = true;
    }


    let objectives = [];

    if (mark) {

      // console.log(key, record, manifest.DestinyRecordDefinition[key]);

      record.objectives.forEach(obj => {

        let objDef = manifest.DestinyObjectiveDefinition[obj.objectiveHash];

        objectives.push(
          <li key={objDef.hash}>
            <div className={cx(
                "progress",
                {
                  "complete": obj.progress >= obj.completionValue ? true : false
                }
              )}>
              <div className="title">{objDef.progressDescription}</div>
              <div className="fraction">{obj.progress}/{obj.completionValue}</div>
              <div className="bar" style={{
                width: `${ obj.progress / obj.completionValue * 100 }%`
              }}></div>
            </div>
          </li>
        )
  
      });


      let crumbs = [];

      try {

        let reverse1;
        let reverse2;
        let reverse3;

        manifest.DestinyRecordDefinition[key].presentationInfo.parentPresentationNodeHashes.forEach(element => {
          if (manifest.DestinyPresentationNodeDefinition[1652422747].children.presentationNodes.filter(el => el.presentationNodeHash === element).length > 0) {
            return; // if hash is a child of seals, skip it
          }
          if (reverse1) {
            return;
          }
          reverse1 = manifest.DestinyPresentationNodeDefinition[element]
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

        // console.log(manifest.DestinyRecordDefinition[key], reverse1, reverse2, reverse3);

        crumbs.push(
          <React.Fragment key={reverse3.hash}>{reverse3.displayProperties.name} > </React.Fragment>
        )
      
        let skipsies = [3319885427]; // Destinations > ---Destiny 2 Locations ---

        if (!skipsies.includes(reverse2.hash)) {
          crumbs.push(
            <React.Fragment key={reverse2.hash}>{reverse2.displayProperties.name} > </React.Fragment>
          )
        }

        crumbs.push(
          <React.Fragment key={reverse1.hash}>
            <Link to={ `/progression/${props.route.match.params.membershipType}/${props.route.match.params.membershipId}/${props.route.match.params.characterId}/triumphs/${reverse3.hash}/${reverse2.hash}/${reverse1.hash}` }>{reverse1.displayProperties.name}</Link>
          </React.Fragment>
        )

      }

      catch (e) {
        console.log(e)
        crumbs.push(
          <>There was an error... Be a lamb and report the error, quoting {key}.</>
        )
      }

      let bread = <div className="crumbs">{crumbs}</div>

      almost.push(
        {
          distance: distance,
          item: <li key={key}>
            <p>{manifest.DestinyRecordDefinition[key].displayProperties.name}</p>
            {bread}
            <p>{manifest.DestinyRecordDefinition[key].displayProperties.description}</p>
            <ul className="list no-interaction">
              {objectives}
            </ul>
          </li>
        }
      )

    }

  });

  almost.sort(function(b, a) {
    let distanceA = a.distance;
    let distanceB = b.distance;
    return (distanceA < distanceB) ? -1 : (distanceA > distanceB) ? 1 : 0;
  });

  return (
    <div className="module" key="almost">
      <h4>Almost complete triumphs</h4>
      <ul className={cx(
          "almost"
        )}>
        { almost.map((value, index) => {
            return value.item
          }) }
      </ul>
    </div>
  )

}

export const Checklists = (props) => {

  let characterProgressions = props.state.ProfileResponse.characterProgressions.data;
  let profileProgressions = props.state.ProfileResponse.profileProgression.data;
  let profileRecords = props.state.ProfileResponse.profileRecords.data.records;
  let characterId = props.route.match.params.characterId;

  let manifest = props.manifest;

  let progression = {
    checklists: {
      text: "Checklists",
      noInteraction: true,
      values: {
        regionChests: {
          text: "Region chests opened",
          total: Object.keys(characterProgressions[characterId].checklists[1697465175]).length,
          completed: Object.values(characterProgressions[characterId].checklists[1697465175]).filter(value => value === true).length
        },
        lostSectors: {
          text: "Lost sectors discovered",
          total: Object.keys(characterProgressions[characterId].checklists[3142056444]).length,
          completed: Object.values(characterProgressions[characterId].checklists[3142056444]).filter(value => value === true).length
        },
        adventures: {
          text: "Adventures undertaken",
          total: Object.keys(characterProgressions[characterId].checklists[4178338182]).length,
          completed: Object.values(characterProgressions[characterId].checklists[4178338182]).filter(value => value === true).length
        },
        sleeperNodes: {
          text: "Sleeper nodes hacked",
          total: Object.keys(profileProgressions.checklists[365218222]).length,
          completed: Object.values(profileProgressions.checklists[365218222]).filter(value => value === true).length
        },
        ghostScans: {
          text: "Ghost scans performed",
          total: Object.keys(profileProgressions.checklists[2360931290]).length,
          completed: Object.values(profileProgressions.checklists[2360931290]).filter(value => value === true).length
        },
        latentMemories: {
          text: "Latent memories shot",
          total: Object.keys(profileProgressions.checklists[2955980198]).length,
          completed: Object.values(profileProgressions.checklists[2955980198]).filter(value => value === true).length
        },
        caydesJorunals: {
          text: "Cayde's journals recovered",
          total: 4,
          completed: Object.values(profileProgressions.checklists[2448912219]).filter(value => value === true).length
        }
      }
    },
    seals: {
      text: "Triumph Seals",
      noInteraction: false,
      values: {
        destinations: {
          text: "Wayfarer",
          nodeHash: 2588182977,
          recordHash: 2757681677,
          total: profileRecords[2757681677].objectives[0].completionValue,
          completed: profileRecords[2757681677].objectives[0].progress
        },
        gambit: {
          text: "Dredgen",
          nodeHash: 3481101973,
          recordHash: 3798931976,
          total: profileRecords[3798931976].objectives[0].completionValue,
          completed: profileRecords[3798931976].objectives[0].progress
        },
        crucible: {
          text: "Unbroken",
          nodeHash: 147928983,
          recordHash: 3369119720,
          total: profileRecords[3369119720].objectives[0].completionValue,
          completed: profileRecords[3369119720].objectives[0].progress
        },
        lore: {
          text: "Chronicler",
          nodeHash: 2693736750,
          recordHash: 1754983323,
          total: profileRecords[1754983323].objectives[0].completionValue,
          completed: profileRecords[1754983323].objectives[0].progress
        },
        dreamingCity: {
          text: "Cursebreaker",
          nodeHash: 2516503814,
          recordHash: 1693645129,
          total: profileRecords[1693645129].objectives[0].completionValue,
          completed: profileRecords[1693645129].objectives[0].progress
        },
        raids: {
          text: "Rivensbane",
          nodeHash: 1162218545,
          recordHash: 2182090828,
          total: profileRecords[2182090828].objectives[0].completionValue,
          completed: profileRecords[2182090828].objectives[0].progress
        }
      }
    }
  }

  let list = [];

  for (const [key, value] of Object.entries(progression.checklists.values)) {
      
    list.push(
      <li key={key}>
        <div className="progress">
          <div className="title">{value.text}</div>
          <div className="fraction">{value.completed}/{value.total}</div>
          <div className="bar" style={{
            width: `${ value.completed / value.total * 100 }%`,
            backgroundColor: value.color ? value.color : ``
          }}></div>
        </div>
      </li>
    )
  }

  return (
    <div className="module" key="checklists">
      <h4>{progression.checklists.text}</h4>
      <ul className={cx(
          "list",
          {
            "no-interaction": progression.checklists.noInteraction
          },
          "checklists"
        )}>
        {list}
      </ul>
    </div>
  )
}

export const Seals = (props) => {

  let characterProgressions = props.state.ProfileResponse.characterProgressions.data;
  let profileProgressions = props.state.ProfileResponse.profileProgression.data;
  let profileRecords = props.state.ProfileResponse.profileRecords.data.records;
  let characterId = props.route.match.params.characterId;

  let manifest = props.manifest;
  
  let progression = {
    checklists: {
      text: "Checklists",
      noInteraction: true,
      values: {
        regionChests: {
          text: "Region chests opened",
          total: Object.keys(characterProgressions[characterId].checklists[1697465175]).length,
          completed: Object.values(characterProgressions[characterId].checklists[1697465175]).filter(value => value === true).length
        },
        lostSectors: {
          text: "Lost Sectors discovered",
          total: Object.keys(characterProgressions[characterId].checklists[3142056444]).length,
          completed: Object.values(characterProgressions[characterId].checklists[3142056444]).filter(value => value === true).length
        },
        adventures: {
          text: "Adventures undertaken",
          total: Object.keys(characterProgressions[characterId].checklists[4178338182]).length,
          completed: Object.values(characterProgressions[characterId].checklists[4178338182]).filter(value => value === true).length
        },
        sleeperNodes: {
          text: "Sleeper nodes hacked",
          total: Object.keys(profileProgressions.checklists[365218222]).length,
          completed: Object.values(profileProgressions.checklists[365218222]).filter(value => value === true).length
        },
        ghostScans: {
          text: "Ghost scans performed",
          total: Object.keys(profileProgressions.checklists[2360931290]).length,
          completed: Object.values(profileProgressions.checklists[2360931290]).filter(value => value === true).length
        },
        caydesJorunals: {
          text: "Cayde's journals recovered",
          total: 4,
          completed: Object.values(profileProgressions.checklists[2448912219]).filter(value => value === true).length
        }
      }
    },
    seals: {
      text: "Triumph Seals",
      noInteraction: false,
      values: {
        destinations: {
          text: "Wayfarer",
          nodeHash: 2588182977,
          recordHash: 2757681677,
          total: profileRecords[2757681677].objectives[0].completionValue,
          completed: profileRecords[2757681677].objectives[0].progress
        },
        gambit: {
          text: "Dredgen",
          nodeHash: 3481101973,
          recordHash: 3798931976,
          total: profileRecords[3798931976].objectives[0].completionValue,
          completed: profileRecords[3798931976].objectives[0].progress
        },
        crucible: {
          text: "Unbroken",
          nodeHash: 147928983,
          recordHash: 3369119720,
          total: profileRecords[3369119720].objectives[0].completionValue,
          completed: profileRecords[3369119720].objectives[0].progress
        },
        lore: {
          text: "Chronicler",
          nodeHash: 2693736750,
          recordHash: 1754983323,
          total: profileRecords[1754983323].objectives[0].completionValue,
          completed: profileRecords[1754983323].objectives[0].progress
        },
        dreamingCity: {
          text: "Cursebreaker",
          nodeHash: 2516503814,
          recordHash: 1693645129,
          total: profileRecords[1693645129].objectives[0].completionValue,
          completed: profileRecords[1693645129].objectives[0].progress
        },
        raids: {
          text: "Rivensbane",
          nodeHash: 1162218545,
          recordHash: 2182090828,
          total: profileRecords[2182090828].objectives[0].completionValue,
          completed: profileRecords[2182090828].objectives[0].progress
        }
      }
    }
  }
   
  let list = [];

  for (const [key, value] of Object.entries(progression.seals.values)) {
    
    list.push(
      <li key={key}>
        <div className="progress">
          <div className="title">{value.text}</div>
          <div className="fraction">{value.completed}/{value.total}</div>
          <div className="bar" style={{
            width: `${ value.completed / value.total * 100 }%`,
            backgroundColor: value.color ? value.color : ``
          }}></div>
        </div>
        <Link to={`/progression/${props.route.match.params.membershipType}/${props.route.match.params.membershipId}/${props.route.match.params.characterId}/triumphs/seal/${value.nodeHash}`}></Link>
      </li>
    )

  }

  return (
    <div className="module" key="seals">
      <h4>{progression.seals.text}</h4>
      <ul className={cx(
          "list",
          {
            "no-interaction": progression.seals.noInteraction
          },
          "seals"
        )}>
        {list}
      </ul>
    </div>
  )

}

export const Ranks = (props) => {

  let characterProgressions = props.state.ProfileResponse.characterProgressions.data;
  let profileProgressions = props.state.ProfileResponse.profileProgression.data;
  let profileRecords = props.state.ProfileResponse.profileRecords.data.records;
  let characterId = props.route.match.params.characterId;

  let manifest = props.manifest;

  let progression = {
    checklists: {
      text: "Checklists",
      noInteraction: true,
      values: {
        regionChests: {
          text: "Region chests opened",
          total: Object.keys(characterProgressions[characterId].checklists[1697465175]).length,
          completed: Object.values(characterProgressions[characterId].checklists[1697465175]).filter(value => value === true).length
        },
        lostSectors: {
          text: "Lost Sectors discovered",
          total: Object.keys(characterProgressions[characterId].checklists[3142056444]).length,
          completed: Object.values(characterProgressions[characterId].checklists[3142056444]).filter(value => value === true).length
        },
        adventures: {
          text: "Adventures undertaken",
          total: Object.keys(characterProgressions[characterId].checklists[4178338182]).length,
          completed: Object.values(characterProgressions[characterId].checklists[4178338182]).filter(value => value === true).length
        },
        sleeperNodes: {
          text: "Sleeper nodes hacked",
          total: Object.keys(profileProgressions.checklists[365218222]).length,
          completed: Object.values(profileProgressions.checklists[365218222]).filter(value => value === true).length
        },
        ghostScans: {
          text: "Ghost scans performed",
          total: Object.keys(profileProgressions.checklists[2360931290]).length,
          completed: Object.values(profileProgressions.checklists[2360931290]).filter(value => value === true).length
        },
        caydesJorunals: {
          text: "Cayde's journals recovered",
          total: 4,
          completed: Object.values(profileProgressions.checklists[2448912219]).filter(value => value === true).length
        }
      }
    },
    seals: {
      text: "Triumph Seals",
      noInteraction: false,
      values: {
        destinations: {
          text: "Wayfarer",
          nodeHash: 2588182977,
          recordHash: 2757681677,
          total: profileRecords[2757681677].objectives[0].completionValue,
          completed: profileRecords[2757681677].objectives[0].progress
        },
        gambit: {
          text: "Dredgen",
          nodeHash: 3481101973,
          recordHash: 3798931976,
          total: profileRecords[3798931976].objectives[0].completionValue,
          completed: profileRecords[3798931976].objectives[0].progress
        },
        crucible: {
          text: "Unbroken",
          nodeHash: 147928983,
          recordHash: 3369119720,
          total: profileRecords[3369119720].objectives[0].completionValue,
          completed: profileRecords[3369119720].objectives[0].progress
        },
        lore: {
          text: "Chronicler",
          nodeHash: 2693736750,
          recordHash: 1754983323,
          total: profileRecords[1754983323].objectives[0].completionValue,
          completed: profileRecords[1754983323].objectives[0].progress
        },
        dreamingCity: {
          text: "Cursebreaker",
          nodeHash: 2516503814,
          recordHash: 1693645129,
          total: profileRecords[1693645129].objectives[0].completionValue,
          completed: profileRecords[1693645129].objectives[0].progress
        },
        raids: {
          text: "Rivensbane",
          nodeHash: 1162218545,
          recordHash: 2182090828,
          total: profileRecords[2182090828].objectives[0].completionValue,
          completed: profileRecords[2182090828].objectives[0].progress
        }
      }
    }
  }

  let infamyDefinition = manifest.DestinyProgressionDefinition[2772425241];
  let infamyProgression = characterProgressions[characterId].progressions[2772425241];
  let infamyProgressTotal = Object.keys(infamyDefinition.steps).reduce((sum, key) => { return sum +  infamyDefinition.steps[key].progressTotal }, 0 );

  let valorDefinition = manifest.DestinyProgressionDefinition[3882308435];
  let valorProgression = characterProgressions[characterId].progressions[3882308435];
  let valorProgressTotal = Object.keys(valorDefinition.steps).reduce((sum, key) => { return sum +  valorDefinition.steps[key].progressTotal }, 0 );

  let gloryDefinition = manifest.DestinyProgressionDefinition[2679551909];
  let gloryProgression = characterProgressions[characterId].progressions[2679551909];
  let gloryProgressTotal = Object.keys(gloryDefinition.steps).reduce((sum, key) => { return sum +  gloryDefinition.steps[key].progressTotal }, 0 );

  progression.ranks = {
    text: "Ranks",
    noInteraction: true,
    values: {
      infamy: {
        definition: infamyDefinition,
        mode: "Gambit",
        text: "Infamy",
        color: "#25986e",
        total: infamyProgressTotal,
        step: infamyProgression
      },
      valor: {
        definition: valorDefinition,
        mode: "Crucible Quickplay",
        text: "Valor",
        color: "#ed792c",
        total: valorProgressTotal,
        step: valorProgression
      },
      glory: {
        definition: gloryDefinition,
        mode: "Crucible Competitive",
        text: "Glory",
        color: "#b52422",
        total: gloryProgressTotal,
        step: gloryProgression
      }
    }
  }
    
  let ranks = [];

  for (const [key, value] of Object.entries(progression.ranks.values)) {

    ranks.push(
      <div className="c3 rank" key={key}>
        <div className="module">
          <h4>{value.mode}</h4>
          <div className="text">
            <p>Progress to next rank:</p>
          </div>
          <div className="progress">
            <div className="title">{value.definition.steps[value.step.stepIndex % (value.definition.steps.length - 1)].stepName}</div>
            <div className="fraction">{value.step.progressToNextLevel}/{value.step.nextLevelAt}</div>
            <div className="bar" style={{
              width: `${ value.step.progressToNextLevel / value.step.nextLevelAt * 100 }%`
            }}></div>
          </div>
          <div className="text">
            <p>Progress to reset:</p>
          </div>
          <div className="progress">
            <div className="title">{value.text}</div>
            <div className="fraction">{value.step.currentProgress}/{value.total}</div>
            <div className="bar" style={{
              width: `${ value.step.currentProgress / value.total * 100 }%`
            }}></div>
          </div>
        </div>
      </div>
    )

  }

  return ranks
}
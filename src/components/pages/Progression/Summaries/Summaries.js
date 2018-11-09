import React from 'react';
import cx from 'classnames';

import './Summaries.css';
import Almost from './Almost';

const Summaries = (props) => {

  let characterProgressions = props.state.ProfileResponse.characterProgressions.data;
  let profileProgressions = props.state.ProfileResponse.profileProgression.data;
  let profileRecords = props.state.ProfileResponse.profileRecords.data.records;
  let characterId = props.route.match.params.characterId;

  let manifest = props.manifest.response.data
  
  /*
    checklists  
      region chests
      lost sectors
      adventures
      sleeper nodes
      ghost scans
      latent memories
      caydes journals
    seals
      destinations
      lore
      crucible
      gambit
      dreaming city
      last wish
    ranks
      infamy
      valor
      glory
    exotics
      kinetic
      energy
      power
      titan
      hunter
      warlock
  */

  let progression = {
    checklists: {
      text: "Checklists",
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
    values: {
      infamy: {
        text: "Infamy",
        color: "#25986e",
        total: infamyProgressTotal,
        completed: infamyProgression.currentProgress
      },
      valor: {
        text: "Valor",
        color: "#ed792c",
        total: valorProgressTotal,
        completed: valorProgression.currentProgress
      },
      glory: {
        text: "Glory",
        color: "#b52422",
        total: gloryProgressTotal,
        completed: gloryProgression.currentProgress
      }
    }
  }
  

  let modules = [];  

  modules.push(
    <div className="module" key="almost">
      <h4>Almost complete</h4>
      <ul className={cx(
          "almost"
        )}>
        <Almost records={profileRecords} manifest={manifest} />
      </ul>
    </div>
  )

  for (const [key, module] of Object.entries(progression)) {
    
    let list = [];

    for (const [key, value] of Object.entries(module.values)) {
      
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

    modules.push(
      <div className="module" key={key}>
        <h4>{module.text}</h4>
        <ul className={cx(
            "list",
            "no-interaction",
            key
          )}>
          {list}
        </ul>
      </div>
    )

  }

  return modules
}

export default Summaries;
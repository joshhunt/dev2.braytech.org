import React from 'react';
import cx from 'classnames';

import './Ranks.css';

const Ranks = (props) => {

  let characterProgressions = props.state.ProfileResponse.characterProgressions.data;
  let profileProgressions = props.state.ProfileResponse.profileProgression.data;
  let profileRecords = props.state.ProfileResponse.profileRecords.data.records;
  let characterId = props.route.match.params.characterId;

  let manifest = props.manifest
  
  

  let infamyDefinition = manifest.DestinyProgressionDefinition[2772425241];
  let infamyProgression = characterProgressions[characterId].progressions[2772425241];
  let infamyProgressTotal = Object.keys(infamyDefinition.steps).reduce((sum, key) => { return sum +  infamyDefinition.steps[key].progressTotal }, 0 );

  let valorDefinition = manifest.DestinyProgressionDefinition[3882308435];
  let valorProgression = characterProgressions[characterId].progressions[3882308435];
  let valorProgressTotal = Object.keys(valorDefinition.steps).reduce((sum, key) => { return sum +  valorDefinition.steps[key].progressTotal }, 0 );

  let gloryDefinition = manifest.DestinyProgressionDefinition[2679551909];
  let gloryProgression = characterProgressions[characterId].progressions[2679551909];
  let gloryProgressTotal = Object.keys(gloryDefinition.steps).reduce((sum, key) => { return sum +  gloryDefinition.steps[key].progressTotal }, 0 );

  let ranks = {
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

  let infamySteps = [];
  let accumulator = 0;
  let subtractor = infamyProgression.currentProgress;
  Object.keys(infamyDefinition.steps).forEach(key => {
    let step = infamyDefinition.steps[key];
    
    console.log(step);

    accumulator = accumulator + step.progressTotal;
    subtractor = subtractor - step.progressTotal;

    infamySteps.push(
      <div key={ step.stepName } className="rank">
        <div className="step">
          <div className="progress" style={{width: `${step.progressTotal / infamyProgressTotal * 100 * 5}%`}}>
            <div className="title">{ step.stepName }</div>
            <div className="fraction">{ (subtractor / step.progressTotal * 100) < 100 && (subtractor / step.progressTotal) >= 0 ? `${subtractor / step.progressTotal * 100}%` : null }</div>
            <div className="bar" style={{width: `${subtractor / step.progressTotal * 100}%`}}></div>
          </div>
        </div>
      </div>
    );
  });
  

  console.log(ranks)

  return (
    <div className="ranks">
      <div className="infamy">
        {infamySteps}
      </div>
    </div>
  )
}

export default Ranks;
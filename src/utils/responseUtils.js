export const profileScrubber = response => {

  // convert character response to an array
  response.profile.Response.characters.data = Object.values(response.profile.Response.characters.data).sort(function(a, b) {
    return parseInt(b.minutesPlayedTotal) - parseInt(a.minutesPlayedTotal);
  });

  // remove dud ghost scans
  delete response.profile.Response.profileProgression.data.checklists[2360931290][1116662180];
  delete response.profile.Response.profileProgression.data.checklists[2360931290][3856710545];
  delete response.profile.Response.profileProgression.data.checklists[2360931290][508025838];

  // adjust adventures checklist state https://github.com/Bungie-net/api/issues/786
  let completed = false;
  // Signal Light
  Object.values(response.profile.Response.characterProgressions.data).forEach(character => {
    if (character.checklists[4178338182][844419501]) {
      completed = true;
    }
  });
  Object.values(response.profile.Response.characterProgressions.data).forEach(character => {
    if (completed) {
      character.checklists[4178338182][844419501] = true;
    }
  });
  completed = false;
  //Not Even the Darkness
  Object.values(response.profile.Response.characterProgressions.data).forEach(character => {
    if (character.checklists[4178338182][1942564430]) {
      completed = true;
    }
  });
  Object.values(response.profile.Response.characterProgressions.data).forEach(character => {
    if (completed) {
      character.checklists[4178338182][1942564430] = true;
    }
  });
  completed = false;

  let scrubbed = {};
  Object.keys(response).forEach(key => {
    scrubbed[key] = response[key].Response;
  })

  return scrubbed;

}
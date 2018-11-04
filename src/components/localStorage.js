
var localStorage = window.localStorage;

export function set(key, value) { 

  value = JSON.stringify(value);

  try {
    localStorage.setItem(key, value);
  } catch(e) {
    console.log(e);
  }
  
}

export function get(key) {
  
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch(e) {
    console.log(e);
  }
  
}

function objectsAreSame(x, y) {
  var objectsAreSame = true;
  for (var propertyName in x) {
     if(x[propertyName] !== y[propertyName]) {
        objectsAreSame = false;
        break;
     }
  }
  return objectsAreSame;
}

export function update(key, value, unique, limit) {
  
  var json = null;

  try {
    json = localStorage.getItem(key)
  } catch(e) {
    console.log(e);
  }

  if (!json) {
    //console.log([value], value, "setting new");
    set(key, [value]);
  }
  else {
    let parsed = JSON.parse(json);
    if (unique) {
      var passed = true;
      for (let index = 0; index < parsed.length; index++) {
        let obj = parsed[index];
        if (objectsAreSame(obj, value)) {
          passed = false;
        }
      }
      if (passed) {
        parsed.push(value);
      }
    }
    else {
      parsed.push(value);
    }
    //console.log(json, parsed, "updating");
    set(key, parsed);
  }
  
}
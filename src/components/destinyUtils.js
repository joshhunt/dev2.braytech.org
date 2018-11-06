import { EMBLEM, HUNTER, TITAN, WARLOCK, NO_CLASS } from './destinyEnums';

// TODO: we can just use itemCategoryHashes for this now?
export const isOrnament = item =>
  item.inventory &&
  item.inventory.stackUniqueLabel &&
  item.plug &&
  item.plug.plugCategoryIdentifier &&
  item.plug.plugCategoryIdentifier.includes('skins');

export const flagEnum = (state, value) => !!(state & value);

function classFromString(str) {
  const results = str.match(/hunter|titan|warlock/);
  if (!results) {
    return NO_CLASS;
  }

  switch (results[0]) {
    case 'hunter':
      return HUNTER;
    case 'warlock':
      return WARLOCK;
    case 'titan':
      return TITAN;
    default:
      return NO_CLASS;
  }
}

export function hasCategoryHash(item, categoryHash) {
  return (
    item.itemCategoryHashes && item.itemCategoryHashes.includes(categoryHash)
  );
}

export function classTypeToString(str) {
  
  let string;

  switch (str) {
    case 0: string = "Titan"; break;
    case 1: string = "Hunter"; break;
    case 2: string = "Warlock"; break;
    default: string = "uh oh"
  }

  return string;
  
}

export function membershipTypeToString(str) {
  
  let string;

  switch (str) {
    case 1: string = "Xbox"; break;
    case 2: string = "PlayStation"; break;
    case 4: string = "PC"; break;
    default: string = "uh oh"
  }

  return string;
  
}



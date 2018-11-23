// import { HUNTER, TITAN, WARLOCK, NO_CLASS } from './destinyEnums';

// TODO: we can just use itemCategoryHashes for this now?
export const isOrnament = item =>
  item.inventory &&
  item.inventory.stackUniqueLabel &&
  item.plug &&
  item.plug.plugCategoryIdentifier &&
  item.plug.plugCategoryIdentifier.includes('skins');

export const flagEnum = (state, value) => !!(state & value);

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

export function damageTypeToString(type) {
  
  let string;

  switch (type) {
    case 3373582085: string = "Kinetic"; break;
    case 1847026933: string = "Solar"; break;
    case 2303181850: string = "Arc"; break;
    case 3454344768: string = "Void"; break;
    default: string = "idk";
  }

  return string;
  
}

export function ammoTypeToString(type) {
  
  let string;

  switch (type) {
    case 1: string = "Primary"; break;
    case 2: string = "Special"; break;
    case 3: string = "Heavy"; break;
    default: string = "idk";
  }

  return string;
  
}



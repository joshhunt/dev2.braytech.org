import Dexie from 'dexie';

const db = new Dexie('braytech');
db.version(1).stores({
  manifest: 'version,value'
});

export default db;

// db.table('manifest')
// .toArray()
// .then((manifest) => {
//   console.log(manifest)
// });

// db.table('manifest').add({
//   modified: response.data.response.modified,
//   value: response.data.response.data
// });
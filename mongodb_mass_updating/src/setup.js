const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const colors = require('colors')

const dbUrl = 'mongodb://localhost:27017';
const testCollections = ['test1', 'test2', 'test3']
const testDb = 'mongodb_mass_doc_updater'

const testDocsWithNewlines = require('./test_docs/docs').with

async function setupDB() {
  const client = await connectToDB(dbUrl)
  return new Promise((resolve, reject) => {
    const db = client.db(testDb);
    populateDB(db, testCollections)
      .then(() => {
        client.close()
        resolve()
      }).catch(err => {
        console.log(err);
        process.exit(1)
      })
  })
}

function connectToDB(dbUrl) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbUrl, function(err, client) {
      console.log('Connecting to test MongoDB database'.yellow);
      if (!err) {
        console.log("\tConnected successfully to server".green);
        resolve(client)
      } else {
        if (err.name = 'MongoNetworkError') {
          console.log('Error: looks like your MongoDB server might not be running, or is running on the wrong port'.red);
          console.log('Make sure you have MongoDB running on port 27017'.red);
          reject(err)
          process.exit(1)
        } else {
          console.log(err)
          reject(err)
          process.exit(1)
        }
      }
    });
  })
}

function populateDB(db, testCollections) {
  return new Promise((resolve, reject) => {
    console.log('Adding test docs to test MongoDB database'.yellow);
    Promise.all(testCollections.map(testCol => {
        return insertCollectionAndPopulate(db, testCol)
      }))
      .then(() => {
        console.log('\tTest docs successully added'.green);
        resolve()
      }).catch((err) => {
        console.log('\tError adding test docs to DB:'.red);
        console.log(err)
        reject(err)
      })
  })
}

function insertCollectionAndPopulate(db, collectionName) {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).remove({})
    testDocsWithNewlines.forEach(doc => db.collection(collectionName).insert(doc))
    console.log(`\t${collectionName} collection inserted`.green);
    resolve()
  })
}

module.exports.setupDB = setupDB



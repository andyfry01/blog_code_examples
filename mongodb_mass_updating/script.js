const setupDB = require('./src/setup.js').setupDB
const MongoUpdater = require('./src/updater.js')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const util = require('util')
const colors = require('colors')

console.log('Beginning MongoDB mass updater script'.cyan)

setupDB()
  .then(() => {
    console.log('DB setup complete, starting example'.cyan)
    runExample()
  })


const testCollections = ['test1', 'test2', 'test3']
let dbUrl = 'mongodb://localhost:27017'
let dbName = 'mongodb_mass_doc_updater'
let regex = /\r\n/

function runExample() {
  console.log('Connecting to DB'.yellow)
  MongoUpdater.getConnection(dbUrl, dbName)
    .then(db => {
      console.log('\tConnected to DB'.green)
      console.log('Getting documents from test collections'.yellow)
      testCollections.forEach(collectionName => {
        let collection = MongoUpdater.getCollection(collectionName, db)
        console.log(`\tGetting documents from ${collectionName} collection`.green)
        collection.find().toArray((err, docs) => {
          console.log(`Processing documents from ${collectionName}`.yellow)
          docs.forEach(doc => {
            let processedDoc = MongoUpdater.processDocFields(doc, regex)
            console.log(`\t${doc._id} updated, saving doc in ${collectionName} collection`.green)
            MongoUpdater.save(processedDoc, collection)
          })
        })
      })
    })
}
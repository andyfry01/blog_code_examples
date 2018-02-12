const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

module.exports = {
  getConnection: function(url, dbName) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, connection) => {
        if (err) {
          reject(err);
        }
        resolve(connection.db(dbName))
      })
    })
  },
  getCollection: function(collectionName, db) {
    return db.collection(collectionName)
  },
  processDocFields: function(doc, regex) {
    let docKeys = Object.keys(doc)
    let processedDocument = docKeys.reduce((current, next) => {
      if (typeof doc[next] != 'string' || next === '_id') {
        current[next] = doc[next]
        return current
      }
      current[next] = doc[next].replace(regex, '')
      return current
    }, {})
    return processedDocument
  },
  save: function(doc, collection) {
    collection.update({
        _id: doc._id
      },
      doc,
      (err, status) => {
        console.log('doc updated!');
        console.log(status.result);
      })
  }
}
const chai = require('chai')
const fs = require('fs')

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const _ = require('lodash')

const expect = chai.expect
const assert = chai.assert

const MongoUpdater = require('../src/updater.js')

const dbUrl = 'mongodb://localhost:27017'
const testDB = 'mongodb_mass_doc_updater'
const testCollections = ['test1', 'test2', 'test3']

const regex = {
  newLineChar: /(\r\n|\r|\n)/gm
}

let testDocsWithNewLineChars = [
  { 
    "first_name" : "test",
    "middle_initial" : "",
    "last_name" : "tester\r\n",
    "address1" : "",
    "address2" : "",
    "city" : "Winston-Salem",
    "state" : "NC",
    "zip" : "\r\n",
    "phone" : "336-923-4262",
    "fax" : ""
  }, { 
    "first_name" : "test_2",
    "middle_initial" : "",
    "last_name" : "tester_2",
    "address1" : "\r\n",
    "address2" : "",
    "city" : "Winston-Salem",
    "state" : "NC",
    "zip" : "\r\n",
    "phone" : "336-923-4262\r\n",
    "fax" : ""
  }
]

let testDocsWithoutNewLineChars = [
  { 
    "first_name" : "test",
    "middle_initial" : "",
    "last_name" : "tester",
    "address1" : "",
    "address2" : "",
    "city" : "Winston-Salem",
    "state" : "NC",
    "zip" : "",
    "phone" : "336-923-4262",
    "fax" : ""
  }, { 
    "first_name" : "test_2",
    "middle_initial" : "",
    "last_name" : "tester_2",
    "address1" : "",
    "address2" : "",
    "city" : "Winston-Salem",
    "state" : "NC",
    "zip" : "",
    "phone" : "336-923-4262",
    "fax" : ""
  }
]

let dbConnections = [];

function connectToDB(done){
  MongoClient.connect(`${dbUrl}`, (err, connection) => {
    if (err) {
      console.log(err);
    }
    dbConnections.push(connection)
    const db = connection.db(testDB)
    testCollections.forEach(testCollections => {
      if (!db.collection(testCollections).find({})) {
        db.createCollection(testCollections)
        testDocsWithNewLineChars.forEach(testDoc => {
          db.collection(testCollections).insert(testDoc)
        })
        done()
      }
    })
    done()
  })
}

function dropDBAndCloseConnection(done){
  dbConnections.forEach(connection => {
    connection.db(testDB).dropDatabase(() => {
      connection.close()
    })
  })
  done()
}

describe('newLineChar remover', function() {

  before(connectToDB)
  after(dropDBAndCloseConnection);

  it('exists', () => {
    let expected = 'object'
    let actual = typeof MongoUpdater
    assert.equal(actual, expected)
  })

  describe('#getConnection', () => {
    it('exists', () => {
      let expected = 'function'
      let actual = typeof MongoUpdater.getConnection
      assert.equal(actual, expected)
    })
    it('should return a mongodb database connection', async () => {
      let connection = await MongoUpdater.getConnection('mongodb://localhost:27017', testDB)
      let actual = connection.constructor.name
      let expected = 'Db'
      assert.equal(actual, expected)
    })
  })

  describe('#getCollection', () => {
    it('exists', () => {
      let expected = 'function'
      let actual = typeof MongoUpdater.getCollection
      assert.equal(actual, expected)
    })
    it('gets a collection from a DB connection', async () => {
      let connection = await MongoUpdater.getConnection('mongodb://localhost:27017', testDB)
      let collection = MongoUpdater.getCollection(testCollections[0], connection)
      let actual = 'test1';
      let expected = testCollections[0]
      assert.equal(actual, expected)
    })
  })

  describe('#processDocFields', () => {
    it('exists', () => {
      let expected = 'function'
      let actual = typeof MongoUpdater.processDocFields
      assert.equal(actual, expected)
    })
    it('should remove newline chars from document fields', async () => {
      const result = await MongoUpdater.processDocFields(testDocsWithNewLineChars[0], regex.newLineChar)
      let expected = true
      let actual = _.isEqual(result, testDocsWithoutNewLineChars[0])
      assert.equal(actual, expected)
    })
  })


})

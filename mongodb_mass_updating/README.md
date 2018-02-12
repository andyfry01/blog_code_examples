# MongoDB Mass Document Updater

This is a repo that accompanies [this blog post](insert link!). You can download this repo to run the code from the post and experiment with it/adapt it for your own purposes.

## Prerequisites

1) MongoDB > v3.x.x
2) Node > v7.x.x

## To download: 

Navigate to wherever you'd like to download the project files, and then: 
`git clone URL OF GIT REPO`


## Installation

From the root of the project folder: 

`npm install`

## To run 

1) Get MongoDB running. From the command line: 

`mongod` or `sudo mongod`

2) Run the updater.js script and watch the magic happen!

`npm run start`

The first thing the script is going to do is populate your local MongoDB with the test database. Make sure you don't have a database named 'mongodb_mass_doc_updater' or else it will get overwritten! But really... chances are you're good. Also, your MongoDB should be running on the default port: localhost:27017

## Problems? 

`npm run test` or `npm run test:watch` to run the unit test suite. 


## Contributing

If you have anything you'd like to add (unit tests, examples, code improvements, etc.) just open up an issue and we can figure out a pull request!
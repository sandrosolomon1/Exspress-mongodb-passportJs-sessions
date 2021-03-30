const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose')
const router = require('./routes/router')
const passport = require('./passport')

const url = 'mongodb://localhost:27017';
const dbName = 'test';

const conn = mongoose.connect(url,{
    useUnifiedTopology: true,
    useNewUrlParser: true
},(err) => {
    if(err) console.log(err)
    else console.log('Database Connected betch')
})

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(session({
  secret: 'foo',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
      mongoUrl: 'mongodb://localhost:27017',
      collectionName: 'sessions',
      dbName
    }),
  cookie: {
      max : 1000
  }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(router)

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
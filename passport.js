const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User')

const customfields = {
    usernameField: 'uname',
    passwordField: 'pw'
}

passport.use(new LocalStrategy(
    customfields,
    function(username, password, done) {

      User.findOne({ username }).then((user) => {
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          if (!user.validPassword(password)) {
            console.log('fuck');  
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
      }).catch(err => {
        if (err) { return done(err); }
      })
      
    }
  ));

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

module.exports = passport
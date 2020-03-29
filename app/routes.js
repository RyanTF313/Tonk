module.exports = function(app, passport, db) {
  var ObjectID = require('mongodb').ObjectID

// normal routes ===============================================================

    // GET SECTION =========================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
      res.render('index.ejs');
  });

  // Goto Profile Page
  app.get('/profile', isLoggedIn, function(req, res) {
    // console.log({_id: ObjectID(req.user._id)}, {id: req.user._id.toString()})
      db.collection('tables').find({id: req.user._id.toString()} ).toArray((err, result) => {
        if (err) return console.log(err)
        res.render('profile.ejs', {
          user : req.user,
          tables: result

        })
      })
  });

  // Go to a specific table
  app.get('/profile/:table', isLoggedIn, function(req, res) {
    //grabbing the table name passed in the url - NEED TO ALTER THIS LATER
    let table = req.url.replace('/profile/','')
      db.collection('tables').find({'tableName': table}).toArray((err, result) => {          
        if (err) return console.log(err)
        res.render('table.ejs', {
          user : req.user,
          tableInfo: result

        })
      })
  });

  // Start a table
  app.get('/start', function(req, res) {      
    db.collection('tables').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('startTable.ejs', {
        user : req.user
      })
    })
  });
 
    // Join a table
    app.get('/join', isLoggedIn, function(req, res) {
        db.collection('tables').find().toArray((err, result) => {          
          if (err) return console.log(err)
          res.render('join.ejs', {
            user : req.user,
            tables: result

          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// POST SECTION =============================================

    app.post('/createTable', (req, res) => {      
      db.collection('tables').save({avalPlayers: req.body.num, tableName: req.body.name, id: req.body.tableId, players: []}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

// PUT SECTION =============================================

    app.put('/profile/tables', (req, res) => {      
      db.collection('tables')
      .findOneAndUpdate({_id: ObjectID(req.body._id)}, {
        $set: {
          players:req.body.players
        }
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

// DELETE SECTION =============================================

    app.delete('/game', (req, res) => {
      db.collection('tables').findOneAndDelete({_id: req.body._id}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

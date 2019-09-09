var express = require('express');
var router = express.Router();

const db = require('../db');
const bcrypt = require('bcrypt');


const expressSession = require('express-session');

const sessionOptions = {
  secret: "i3rlejofdiaug;lsad", //unlike me, DONT share this with the world
  resave: false,
  saveUninitialized: false
 }

 router.use(expressSession(sessionOptions));



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//the users is already at /users/
router.post('/registerProcess', (req, res, next) =>{
  // res.json(req.body);
  // const {username, email, password, password2} = req.body

  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password;

  const checkUserExistsQuery = `
    SELECT * FROM users WHERE username = $1 or email = $2
  `
  db.any(checkUserExistsQuery, [username, email]).then((results) => {
    if(results.length > 0){
      //this user already exists
      res.redirect('/login?msg=userexists')

    } else{
      //new user. insert
      insertUser()
    }

  })

  const insertUserQuery = ` INSERT INTO users (username, email, password )
    VALUES
    ($1, $2, $3)
    returning id`
    const hash = bcrypt.hashSync(password,10);
    db.one(insertUserQuery,[username, email, hash]).then((resp) => {
      res.json({
        msg: "useradded"
      })
    })
    next();
});

router.post('/loginProcess',(req,res) =>{
  // res.json(req.body);
  const checkUserExistsQuery = `
    SELECT * FROM users WHERE username=$1`;
  const checkUser = db.one(checkUserExistsQuery, [req.body.username]);
  
  checkUser.then((results) =>{
    // res.json(results)
    const correctPass = bcrypt.compareSync(req.body.password, results.password);
    if(correctPass){
      // this is a valid user/pass
      req.session.username = results.username;
      req.session.loggedin = true;
      req.session.email = results.email;
      res.redirect('/');

    } else{
      //these aren't the droids were looking for
      res.redirect('/login?msg=badPass');
    }
    console.log(results)
    res.json(results);
  })


  checkUser.catch((error) =>{
    res.json({
      msg: "userDoesNotExist"
    })
  })
})

module.exports = router;


const CONFIG = require('./config.js')
const cookieSession = require('cookie-session')

const express = require('express')
const app = express()

const bodyParser = require('body-parser')

const passport = require('passport')
const CustomStrategy = require('passport-custom').Strategy
const { authenticate } = require('ldap-authentication')

const cookieParser = require('cookie-parser')


// Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '1091153796944-2hbv7fifcbuvhdlo85i038f41s05vgr8.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

/**
 * Create the passport custom stragegy and name it `ldap`
 * 
 * Only this part is where we use ldap-authentication to do
 * the authentication.
 * 
 * Everything else in this example is standard passport staff.
 *
 */ 
passport.use('ldap', new CustomStrategy(
  async function (req, done) {
    try {
      if (!req.body.username || !req.body.password) {
        throw new Error('username and password are not provided')
      }
      // construct the parameter to pass in authenticate() function
      let ldapBaseDn = CONFIG.ldap.dn
      let options = {
        ldapOpts: {
          url: CONFIG.ldap.url
        },
        // note in this example it only use the user to directly
        // bind to the LDAP server. You can also use an admin
        // here. See the document of ldap-authentication.
        userDn: `cn=${req.body.username},${ldapBaseDn}`,
        userPassword: req.body.password,
        userSearchBase: ldapBaseDn,
        usernameAttribute: 'uid',
        username: req.body.username
      }
      // ldap authenticate the user
      let user = await authenticate(options)
      // success
      done(null, user)
    } catch (error) {
      // authentication failure
      done(error, null)
    }
  }
))

// passport requires this
passport.serializeUser(function (user, done) {
  done(null, user);
})
// passport requires this
passport.deserializeUser(function (user, done) {
  done(null, user);
})
// passport requires a session
var sessionMiddleWare = cookieSession({
  name: 'session',
  keys: ['keep the secret only to yourself'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
})

// The order of the following middleware is very important for passport!!
app.use(bodyParser.urlencoded({ extended: true }))
app.use(sessionMiddleWare)
// passport requires these two
app.use(passport.initialize())
app.use(passport.session())



/// 2f auth
app.use(cookieParser());

app.use(express.json());


////


// web page template
app.set('view engine', 'pug')

// user post username and password
app.post('/login',
  passport.authenticate('ldap', { failureRedirect: '/login' }),
  function (req, res) {
    res.render('start');
  }
)


app.get('/login1', (req,res)=>{
    res.render('login1');
})

app.post('/login1', (req,res)=>{
    let token = req.body.token;

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
      }
      verify()
      .then(()=>{
          res.cookie('session-token', token);
          res.send('success')
      })
      .catch(console.error);

})






// success page
app.get('/success', (req, res) => {
  let user = req.user
  if (!user) {
    res.redirect('/')
    return
  }
  res.render('success',
    {
      userDisplayName: user.cn,
      userObject: JSON.stringify(user, null, 2)
      
    })
})

// passport standard logout call.
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

// the login page
app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.get('/profile', checkAuthenticated, (req, res)=>{
    let user = req.user;
    res.render('profile', {user});
})

app.get('/protectedRoute', checkAuthenticated, (req,res)=>{
    res.send('This route is protected')
})

app.get('/logout', (req, res)=>{
    res.clearCookie('session-token');
    res.redirect('/login')

})


function checkAuthenticated(req, res, next){

    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
      }
      verify()
      .then(()=>{
          req.user = user;
          next();
      })
      .catch(err=>{
          res.redirect('/login1')
      })

}




// Start server
let port = 3000
console.log(`app is listening on port ${port}`)
app.listen(port, 'localhost')
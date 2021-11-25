

// This application uses express as its web server
// for more info, see: http://expressjs.com


const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const ldap = require('ldapjs')
const { authenticate } = require('ldap-authentication')
 var client = ldap.createClient({
    url: 'ldap://localhost:389'
});
var session = require('express-session');

// middleware
app.use(express.urlencoded({ extended: false }))
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'secret'
}));

// Session-persisted message middleware

app.use(function(req, res, next){
  var flag =req.session.flag;
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  delete req.session.flag;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});



function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.sendFile(path.join(intialPath, "login.html"));
    res.redirect('/login');
  }
}

app.get('/restricted', restrict, function(req, res){
  res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});


/*use this to create connection*/
function authenticateDN(username, password,req,res) {

    /*bind use for authentication*/
    client.bind(username, password, function (err) {
        if (err) {
            console.log("Error in new connetion " + err)
        } else {
            /*if connection is success then go for any operation*/
            console.log("Success");
           //  req.session.user = true;
          // $("#p1").text("Login = true");
          let c = document.querySelector('#p1');
          c.innerHTML='<h1>login = true </h1>';
        req.session.success = 'Authenticated as ' + user
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
          req.session.flag=true;
        res.redirect('back');
           // storage.success = true;
          //document.getElementById("p1").innerHTML = "Login = true!";
           

        }
    });
}






async function auth() {
  // auth with admin
  let options = {
    ldapOpts: {
      url: 'ldap://localhost:389',
      // tlsOptions: { rejectUnauthorized: false }
    },
    adminDn: 'cn=admin,dc=openstack,dc=org',
    adminPassword: 'password',
    userPassword: 'password',
    userSearchBase: 'dc=openstack,dc=org',
    usernameAttribute: 'uid',
    username: 'admin',
    // starttls: false
  }

  let admin = await authenticate(options)
  console.log(admin)

  // auth with regular user
  options = {
    ldapOpts: {
      url: 'ldap://localhost:389/',
      // tlsOptions: { rejectUnauthorized: false }
    },
    userDn: 'cn=johny,ou=Users,dc=openstack,dc=org',
    userPassword: 'password',
    userSearchBase: 'ou=Users,dc=openstack,dc=org',
    usernameAttribute: 'uid',
    username: 'johny',
    // starttls: false
  }

  user = await authenticate(options)
  console.log(user)
 
  
}


let intialPath = path.join(__dirname, "public");
app.use(express.static(intialPath));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


app.post('/login-user', (req, res) => {
    const { userName, password } = req.body;
var user = req.body.userName;
var pass= req.body.password;
console.log(user + pass);
let authenticated =  authenticate({
  ldapOpts: { url: 'ldap://localhost:389/' },
  adminDn: 'cn=admin,dc=openstack,dc=org',
    adminPassword: 'password',
  userDn: 'cn=johny,ou=Users,dc=openstack,dc=org',
  verifyUserExists : true,
  userSearchBase: 'dc=openstack,dc=org',
  usernameAttribute: 'uid',
  username: user,
})

  authenticateDN("cn=johny,ou=Users,dc=openstack,dc=org",pass,req,res);
 // auth with regular user
  options = {
    ldapOpts: {
      url: 'ldap://localhost:389/',
      // tlsOptions: { rejectUnauthorized: false }
    },
    userDn: 'cn=johny,ou=Users,dc=openstack,dc=org',
    userPassword: pass,
    userSearchBase: 'ou=Users,dc=openstack,dc=org',
    usernameAttribute: 'uid',
    username: user,
  }

  
})

auth()


app.listen(3000,function()
{
    console.log("server started...")
})


app.get('/', (req, res) => {
      res.location('/index.html');
    //res.sendFile(path.join(intialPath, "index.html"));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(intialPath, "login.html"));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(intialPath, "register.html"));
})

app.post('/register-user', (req, res) => {

    const { name, email, password } = req.body;

    if(!name.length || !email.length || !password.length){
        res.json('fill all the fields');
    } else{
      /*  db("users").insert({
            name: name,
            email: email,
            password: password
        })
        .returning(["name", "email"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            if(err.detail.includes('already exists')){
                res.json('email already exists');
            }
        })*/
    }
})


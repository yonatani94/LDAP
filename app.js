

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
const storage = require('express-session')


/*use this to create connection*/
function authenticateDN(username, password) {

    /*bind use for authentication*/
    client.bind(username, password, function (err) {
        if (err) {
            console.log("Error in new connetion " + err)
        } else {
            /*if connection is success then go for any operation*/
            console.log("Success");
            storage.success = true;
          //document.getElementById("p1").innerHTML = "Login = true!";
           

        }
    });
}

async function auth() {
  // auth with admin
  let options = {
    ldapOpts: {
      url: 'ldap://localhost:389',
    },
    adminDn: 'cn=admin,dc=openstack,dc=org',
    adminPassword: 'password',
    userPassword: 'password',
    userSearchBase: 'dc=openstack,dc=org',
    usernameAttribute: 'uid',
    username: 'admin',
  }

  let admin = await authenticate(options)
  console.log(admin)

  // auth with regular user
  options = {
    ldapOpts: {
      url: 'ldap://localhost:389/',
    },
    userDn: 'cn=johny,ou=Users,dc=openstack,dc=org',
    userPassword: 'password',
    userSearchBase: 'ou=Users,dc=openstack,dc=org',
    usernameAttribute: 'uid',
    username: 'johny',
  }

  user = await authenticate(options)
  console.log(user)
 
  
}

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

  authenticateDN("cn=johny,ou=Users,dc=openstack,dc=org",pass);
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
        db("users").insert({
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
        })
    }
})




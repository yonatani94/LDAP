# Passport-LDAP 
<img src="https://res.cloudinary.com/practicaldev/image/fetch/s--et-wc0UN--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/75lpp6kgf3j2usul4t71.png"/>

## Goal

Passport strategy for authenticating against an OpenLDAP server.

## Description

This library use `ldapjs` as the underneath library. It has two modes of authentications:

1. **Admin authenticate mode**. If an admin user is provided, the library will login (ldap bind) with the admin user,
   then search for the user to be authenticated, get its DN (distinguish name), then use
   the user DN and password to login again. If every thing is ok, the user details will
   be returned.

2. **Self authenticate mode**. If the admin user is not provided, then the `userDn` and `userPassword` must be provided.
   If any of `userSearchBase` or `usernameAttribute` is missing, then the lib simply does a login with
   the `userDn` and `userPassword` (ldap bind), and returns true if succeeds.

   Otherwise, the lib does a login with the `userDn` and `userPassword` (ldap bind),
   then does a search on the user and return the user's details.

3. **Verify user exists**. If an `verifyUserExists : true` is provided, the library will login (ldap bind) with the admin user,
      then search for the user to be verified. If the user exists, user details will be returned (without verifying the user's password).

## Features

- Can use an admin to search and authenticate a user
- Can also use a regular user and authenticate the user itself
- Supports ldap, ldaps, and STARTTLS
- Async/Await Promise

## Usage

### Installation

Start With
```sh
npm init
```

```sh
npm install ldap-authentication --save
```

pull openLDAP image with docker

```sh
docker pull larrycai/openldap
```

Run OpenLDAP docker image:

```sh
docker run -d -p 389:389 --name ldap -t larrycai/openldap
```
-d - run the container in detached mode (in the background).

-p 389:389 - map port 389 of the host to port 389 in the container.

-larrycai/openldap -> the image to use


Either command starts a new container with OpenLDAP running inside.
```sh
docker exec -it ldap bash
```
now you can see the list of users in the OpenLDAP with the command:

```sh
ldapsearch -H ldap://localhost -LL -b ou=Users,dc=openstack,dc=org -x
```

Run The Application with commant node (Node JS required)
```sh
node index.js
```

go to 
```sh
localhost:3000/
```
Then try login with userName  & Password From The List ldapsearch.


Now You transfer to Google Authentication Page:

1.  Click sign in

2.  Insert your UserName & Password From Your Google Account.

3.  Login Successfuly - Now You Are Login After  2-Factor-Authentication







const greeting = document.querySelector('.greeting');
const storage = require('express-session')

window.onload = () => {

    if(!storage.success){
        location.href = '/login';
   } else{
        greeting.innerHTML = `hello johny`;
    }
}

const logOut = document.querySelector('.logout');

logOut.onclick = () => {
    sessionStorage.clear();
    location.reload();
}
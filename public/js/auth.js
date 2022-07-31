const miFormulario = document.querySelector('form');

const url = window.location.hostname.includes('localhost')
? 'http://localhost:8080/api/auth/'
: 'https://restserver-cascaron.herokuapp.com/api/auth/'


miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();    // Evita el refresh del navegador

    const formData = {};
    for(let el of miFormulario.elements) {  // lectura de los elementos del formulario
        if(el.name.length > 0) {
            formData[el.name] = el.value
        }
    }
    // console.log(formData);
    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(({msg, token}) => {
        if(msg) {
            return console.log(msg);
        }
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(err => {
        console.log(err)
    })

});


function onSignIn(googleUser) {

    var id_token = googleUser.getAuthResponse().id_token;
    const data = {id_token};
    
    fetch(url, + 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    .then( ({token}) => {
        localStorage.setItem('token', token);
        window.location = 'chat.html'
    })
    .catch(console.warn)
}





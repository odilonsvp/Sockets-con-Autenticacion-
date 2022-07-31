const url = window.location.hostname.includes('localhost')
? 'http://localhost:8080/api/auth/'
: 'https://restserver-cascaron.herokuapp.com/api/auth/'


// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');


let usuario = null;
let socket = null;


// Validar el Token del LocalStorage
const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if(token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, {
        headers: {'x-token': token}
    })
    
    const {usuario: userDB, token: tokenDB} = await resp.json();
    // console.log(userDB, tokenDB);
    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocket();
}


const conectarSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    })

    socket.on('connect', () => {
        console.log('socket onLine')
    })

    socket.on('disconnect', () => {
        console.log('socket offLine')
    })


    socket.on('recibir-mensajes', (payload) => {
        console.log(payload)
    })

    socket.on('recibir-mensajes', dibujarMensajes);
    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', (payload) => {
        console.log('Privado :', payload);
    })
    
}


const dibujarUsuarios =(usuarios = []) => {
    let userHTML = '';
    usuarios.forEach(({ nombre, uid}) => {
        userHTML += `
            <li>
                <p>
                    <h5 class="text-success"> ${nombre} </h5>
                    <span class="fs-6 text-muted"> ${uid} </span>
                </p>
            </li>
        `;
    })

    ulUsuarios.innerHTML = userHTML;
}


const dibujarMensajes =(mensajes = []) => {
    let mensajesHTML = '';
    mensajes.forEach(({ nombre, mensaje}) => {
        mensajesHTML += `
            <li>
                <p>
                    <span class="text-primary"> ${nombre} </span>
                    <span> ${mensaje} </span>
                </p>
            </li>
        `;
    })

    ulMensajes.innerHTML = mensajesHTML;
}


txtMensaje.addEventListener('keyup', ({keyCode}) => {
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if(keyCode !== 13) { return; }  // Codigo de la tecla no es un enter
    if(mensaje.length === 0) { return; }    // Mensaje vacio

    socket.emit('enviar-mensaje', {mensaje, uid});
    txtMensaje.value = '';

})


const main = async() => {
    await validarJWT();
}


main();

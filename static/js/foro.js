listarPublicaciones()
function listarPublicaciones() {
    activarSpinner()
    
    fetch('/listarPublicaciones')
    .then(response => response.json())
    .then(data =>{   
        desactivarSpinner()   
        if (data["respuesta"] == "vacio") {
            document.getElementById('publicaciones').innerHTML = "<h2>No hay publicaciones</h2>"
        } else {        
            for (const dato of data["respuesta"]) {        
                publicacion(dato[0], dato[1], dato[2], dato[3], dato[4], dato[5])        
            }
        }  
        
    })    
}

document.getElementById("publicaciones").addEventListener('click', (e)=>{
    console.log(e.target.textContent);
    switch (e.target.textContent) {
        case 'Comentarios':
            mostrarComentarios(e.target.id)
            break;
        case 'Comentar':
            registrarComentario(e.target.id)            
            break;
        case 'Responder':
            mostrarRespuestas(e.target.id)            
            break;
        case 'Enviar':
            registrarRespuesta(e.target.id)
            break;
        case 'Me gusta':
            reaccionar(e.target.id)
        default:
            break;
    }
})
             
function publicacion(idPub, title, contenido, fecha, like, perfil){
    const div = document.getElementById("publicaciones")

    const card = document.createElement("div")    
    card.classList = "card"

    const cardBody = document.createElement("div")
    cardBody.classList = "card-body"

    const titulo = document.createElement("h3")
    titulo.classList = "card-title"
    titulo.innerText = `${title}`

    const nombrePerfil = document.createElement("h6")
    nombrePerfil.classList = "card-subtitle mb-2 text-body-secondary"
    nombrePerfil.innerText = `${perfil}`

    const fechaPublicacion = document.createElement("h6")
    fechaPublicacion.classList = "card-subtitle mb-2 text-body-secondary"
    fechaPublicacion.innerText = `${fecha}`

    const cuerpo = document.createElement("p")
    cuerpo.classList = "card-text mb-2"
    cuerpo.innerText = `${contenido}`

    const numLike = document.createElement("span")
    numLike.classList = "mb-2"
    numLike.id = `numLike${idPub}`
    numLike.textContent = `${like}`

    const iconLike = document.createElement("span")
    iconLike.innerText = '❤ '

    const hr = document.createElement("hr")

    const botones = document.createElement("div")
    botones.classList = "botones-publicacion"

    const btnLike = document.createElement("button")
    btnLike.classList = "btn btn-outline-dark"
    btnLike.id = `${idPub}`
    btnLike.innerText = `Me gusta`            

    const btnComentarios = document.createElement("button")
    btnComentarios.id = `${idPub}`
    btnComentarios.classList = "btn btn-outline-dark"
    btnComentarios.type = "button"
    btnComentarios.setAttribute('data-bs-toggle', 'collapse')
    btnComentarios.setAttribute('data-bs-target', `#divComentarios${idPub}`)
    btnComentarios.setAttribute('aria-controls', `divComentarios${idPub}`)
    btnComentarios.ariaExpanded = "false" 
    btnComentarios.innerText = `Comentarios`

    botones.append(btnLike, btnComentarios)

    // inicio del contenedor para comentar y leer comentarios
    const divComentarios = document.createElement("div")
    divComentarios.classList = "collapse div-comentarios"
    divComentarios.id = `divComentarios${idPub}`    

    // inicio contenedor para comentar
    const divComentar = document.createElement("form")
    divComentar.classList = "div-comentar"

    const textAreaComentar = document.createElement("textarea")
    textAreaComentar.id = `textarea${idPub}`
    textAreaComentar.required = 'true'    
    textAreaComentar.placeholder = "Escribe algo..."

    const btnComentar = document.createElement("button")
    btnComentar.classList = "btn btn-outline-dark"
    btnComentar.id = `${idPub}`
    btnComentar.type = "button"
    btnComentar.innerText = "Comentar"

    divComentar.append(textAreaComentar, btnComentar) 
    
    // inicio del contenedor para leer los comentarios
    const cajaComentarios = document.createElement("div")
    cajaComentarios.id = `cajaComentarios${idPub}`
    
    divComentarios.append(divComentar, cajaComentarios)
    
    cardBody.append(nombrePerfil, fechaPublicacion, titulo, cuerpo, hr, iconLike, numLike, botones, divComentarios)
    card.appendChild(cardBody)        
    div.append(card)
}    

function mostrarComentarios(id) {
    document.getElementById(`cajaComentarios${id}`).innerHTML = ''

    const datos = {idPub: id}
    fetch('/listaComentarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data =>{        

        for (const dato of data["respuesta"]) {            
            comentario(id, dato[0], dato[1], dato[2], dato[3])
        }

    })
}

function comentario(idPub, idComm, cuerpo, fecha, perfil){
    
    const cajaComentarios = document.getElementById(`cajaComentarios${idPub}`)

    // inicio del contenedor para ver el comentario y las respuestas a este
    const comentario = document.createElement("div")
    comentario.classList = 'comentario'

    /* contenedor del cuerpo del comentario */
    const contenidoComentario = document.createElement("div")
    contenidoComentario.classList = "contenido-comentario"
    
    const perfilComentario = document.createElement("span")
    perfilComentario.classList = "h6"
    perfilComentario.innerText = `${perfil} `
    
    const fechaComentario = document.createElement("span")
    fechaComentario.classList = "h6"
    fechaComentario.innerText = ` ${fecha}`
    
    const cuerpoComentario = document.createElement("p")
    cuerpoComentario.innerText = `${cuerpo}`

    contenidoComentario.append(perfilComentario, fechaComentario, cuerpoComentario)
    
    const btnRespuestas = document.createElement("a")
    btnRespuestas.classList = ""
    btnRespuestas.id = `${idComm}`
    btnRespuestas.innerText = "Responder"
    btnRespuestas.type = "button"
    btnRespuestas.setAttribute('data-bs-toggle', 'collapse')
    btnRespuestas.setAttribute('data-bs-target', `#divRespuestas${idComm}`)
    btnRespuestas.setAttribute('aria-controls', `divRespuestas${idComm}`)
    btnRespuestas.ariaExpanded = "false"

    // inicio del contenedor de las respuestas al comentario
    const divRespuestas = document.createElement("div")
    divRespuestas.classList = "collapse div-respuestas"
    divRespuestas.id = `divRespuestas${idComm}`

    // inicio contenedor para responder
    const divResponder = document.createElement("div")
    divResponder.classList = "div-responder"

    const textAreaResponder = document.createElement("textarea")
    textAreaResponder.id = `textareaCom${idComm}`
    textAreaResponder.required = "true"
    textAreaResponder.placeholder = "Escribe algo..."

    const btnResponder = document.createElement("button")
    btnResponder.classList = "btn btn-outline-dark"
    btnResponder.id = `${idComm}`
    btnResponder.innerText = "Enviar"

    divResponder.append(textAreaResponder, btnResponder)

    // inicio del contenedor de la respuesta
    const cajaRespuesta = document.createElement("div")
    cajaRespuesta.classList = 'caja-respuestas'
    cajaRespuesta.id = `cajaRespuesta${idComm}`

    divRespuestas.append(cajaRespuesta, divResponder)

    comentario.append(contenidoComentario, btnRespuestas, divRespuestas)
       
    cajaComentarios.append(comentario)
}

function mostrarRespuestas(id){
    document.getElementById(`cajaRespuesta${id}`).innerHTML = ''

    const datos = {idCom: id}
    fetch('/listarRespuestas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data =>{        

        for (const dato of data["respuesta"]) {            
            respuesta(id, dato[0], dato[1], dato[2])
        }

    })
}

function respuesta(idCom, cuerpo, fecha, perfil){
    const cajaRespuestas = document.getElementById(`cajaRespuesta${idCom}`)

    const respuesta = document.createElement("div")
    respuesta.classList = "respuesta"

    const perfilRespuesta = document.createElement("span")
    perfilRespuesta.classList = "h6"
    perfilRespuesta.innerText = `${perfil} `
    
    const fechaRespuesta = document.createElement("span")
    fechaRespuesta.classList = "h6"
    fechaRespuesta.innerText = `${fecha}`

    const cuerpoRespuesta = document.createElement("p")
    cuerpoRespuesta.innerText = `${cuerpo}`

    respuesta.append(perfilRespuesta, fechaRespuesta, cuerpoRespuesta)
    cajaRespuestas.append(respuesta)
}

function registrarComentario(id) {

    if (document.getElementById(`textarea${id}`).value != "") {        
        const datos = {
            idPub: id,
            cuerpo: document.getElementById(`textarea${id}`).value
        }

        document.getElementById(`textarea${id}`).value = ""
        
        fetch('/registrarComentario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data =>{
            if (data["respuesta"] == true) {            
                mostrarComentarios(id)
            }else{
                console.log("No se registro");
            }
        })
    }
}

function registrarRespuesta(id) {

    if (document.getElementById(`textareaCom${id}`).value != "") {        
        const datos = {
            idCom: id,
            cuerpo: document.getElementById(`textareaCom${id}`).value
        }

        document.getElementById(`textareaCom${id}`).value = ""
        
        fetch('/registrarRespuesta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data =>{
            if (data["respuesta"] == true) {            
                mostrarRespuestas(id)
            }else{
                console.log("No se registro");
            }
        })
    }
}

function reaccionar(id) {
    

    const datos = {
        idPub: id,        
    }

    fetch('/reaccionar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data =>{
        if (data["respuesta"] == true) {   
            let numLike = document.getElementById(`numLike${id}`).textContent
            numLike = parseInt(numLike) + 1
            document.getElementById(`numLike${id}`).textContent = numLike
        }
    })
}

function activarSpinner(){
    document.getElementById("spinner").classList = "spinner-border";    
}

function desactivarSpinner() {
    document.getElementById("spinner").classList = "";    
}
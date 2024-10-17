console.log("CONECTADO!");

fetch('/miPefil')
.then(response => response.json())
.then(data =>{
    document.getElementById('nombrePerfil').innerText = `${data["nombre"]}`
    document.getElementById('descripcionPerfil').innerText = `${data["descripcion"]}`
})


document.getElementById("main").addEventListener('click', (e)=>{    
    e.stopPropagation()
    console.log(e.target.value);
    switch (e.target.value) {
        case 'misPublicaciones':
            misPublicaciones()            
            window.location.href = '#numPublicaciones'
            break;
        case 'eliminarMiPub':
            eliminarMiPublicacion(e.target.id)            
            break;
        default:
            break;
    }
})

function misPublicaciones() {
    activarSpinner()
    
    fetch('/misPublicaciones')
    .then(response => response.json())
    .then(data =>{   
        desactivarSpinner()   
        if (data["respuesta"] == "vacio") {
            document.getElementById('publicaciones').innerHTML = "<h2>No tienes publicaciones</h2>"
        } else {   
            document.getElementById("publicaciones").innerHTML = ''     
            document.getElementById("numPublicaciones").innerText = `${data["respuesta"].length}`            
            for (const dato of data["respuesta"]) {        
                publicacion(dato[0], dato[1], dato[2], dato[3], dato[4])        
            }
        }          
    })    
}

function publicacion(idPub, title, contenido, fecha, like){
    const div = document.getElementById("publicaciones")

    const card = document.createElement("div")    
    card.classList = "card"

    const cardBody = document.createElement("div")
    cardBody.classList = "card-body"

    const eliminarPub = document.createElement('p')
    eliminarPub.classList = 'eliminar-publicacion'
    eliminarPub.id = `${idPub}`
    eliminarPub.innerText = '❌'
    eliminarPub.value = 'eliminarMiPub'

    const titulo = document.createElement("h3")
    titulo.classList = "card-title"
    titulo.innerText = `${title}`

    const fechaPublicacion = document.createElement("h6")
    fechaPublicacion.classList = "card-subtitle mb-2 text-body-secondary"
    fechaPublicacion.innerText = `${fecha}`

    const cuerpo = document.createElement("p")
    cuerpo.classList = "card-text mb-2"
    cuerpo.innerText = `${contenido}`

    const numLike = document.createElement("p")
    numLike.classList = "mb-2"
    numLike.id = `numLike${idPub}`
    numLike.textContent = `❤ ${like}`

    cardBody.append(eliminarPub, fechaPublicacion, titulo, cuerpo, numLike)
    card.appendChild(cardBody)   
    div.append(card)
}    

function eliminarMiPublicacion(id) {
    
    const confirmacion = confirm('Por favor, confirme la eliminacion de esta publicación.')
    if (confirmacion){                
        fetch('/eliminarMiPublicacion',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({idPub:id})
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            if (data === "ok") misPublicaciones()
            else alert('Eror en la base de datos, intentelo mas tarde.')
        })
    }
}

function activarSpinner(){
    document.getElementById("spinner").classList = "spinner-border";    
}

function desactivarSpinner() {
    document.getElementById("spinner").classList = "";    
}
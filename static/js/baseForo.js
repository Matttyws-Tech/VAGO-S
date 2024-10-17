console.log("COnectado baseforo");

document.getElementById("formPublicar").addEventListener("submit", (e)=>{
    e.preventDefault()
    
    datos = {
        titulo: document.getElementById("tituloPublicacion").value,
        contenido: document.getElementById("contenidoPublicacion").value,
    }    
    
    fetch('/registrarPublicacion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data =>{
        console.log(data);
        if (data["estado"] === "ok") {
            window.location.reload()
        }else{
            alert("No se pudo hacer la publicacion")
        }
    })    

})

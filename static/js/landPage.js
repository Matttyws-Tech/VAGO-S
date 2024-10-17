console.log("conectado");

const form = document.getElementById("form")

form.addEventListener('submit', (e)=>{
    e.preventDefault()

    const datos = {
        email: document.getElementById("inputEmail").value,
        usuario: document.getElementById("inputNombre").value,
        clave: document.getElementById("inputClave").value
    }    

    fetch('/registrarCliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {        
        if (data["estado"] == "ok") {
            clienteRegistrado()
        }
        else if(data["estado"] == 'existe'){
            errorRegistro()
        }else{
            alert('Error en la base de datos')
        }        
    })
})


function clienteRegistrado() {
    alert("Felicidades ya eres parte de la comunidad de VAGO'S!")
    document.getElementById("inputEmail").value = ""
    document.getElementById("inputNombre").value = ""
    document.getElementById("inputClave").value = ""
}

function errorRegistro() {
    alert("No se pudo registrar un usuario con esos datos, intentelo nuevamente.")
}
console.log("conect");

document.getElementById("form").addEventListener("submit", (e)=>{
    e.preventDefault()

    const datos = {
        email: document.getElementById("email").value,
        clave: document.getElementById("clave").value
    }

    fetch('/iniciarSesion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {        
        switch (data["estado"]) {
            case "valido":
                window.location.href = "/foro"
                break;
            case false:
                alert("La base de datos no esta funcionando!")
                break;
            case "invalido":
                errorLogin()
                break;
            default:
                break;
        }        
    })
})


function errorLogin() {
    alert("No se pudo iniciar Sesion con los datos ingresados, intente nuevamente.")
}
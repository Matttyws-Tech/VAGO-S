

function editarUsuario() {
    const div = document.getElementById("editarUsuario")
    if (div.className == "cerrado") {
        alert("editarusuario en 0")
        div.className = "abierto"
    }
    else{
        console.log("No esta en cero");
    }
    div.innerHTML = ``
    
}

editarUsuario()


function alertaEliminarUser() {
    alert("Esta seguro de eliminar el usuario")
}

function eliminarUser() {
    alertaEliminarUser()
    alert("usuario eliminado!")
    
}
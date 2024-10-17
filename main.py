from flask import *
from bd import BD

app = Flask(__name__)
app.secret_key = "Nemo140206"

host = 'localhost'
user = 'root'
passwd = ''
port = 3306
db = 'vagos'

bd = BD(host, user, passwd, port, db)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login")
def loginPage():
    if "usuario" in session:
        return redirect(url_for("foroPage"))
    return render_template("login.html")

@app.route("/cerrarSesion")
def cerrarSesion():
    session.pop("usuario", None)
    session.pop("nombre", None)
    return redirect(url_for("loginPage"))

@app.route("/perfil")
def perfilPage():
    if "usuario" in session:            
        return render_template("perfil.html")        
    return redirect(url_for("loginPage"))    

@app.route("/crear")
def crearPublicacion():
    return render_template("index.html")

@app.route('/foro')
def foroPage():
    if "usuario" in session:            
        return render_template("foro.html")
    return redirect(url_for("loginPage"))

@app.route('/registrarCliente', methods=["POST"])
def registrarCliente():
    datos = request.get_json()
    
    estado = bd.rCliente(
        datos["email"],
        datos["clave"],
        datos["usuario"]        
    )
    
    if estado == 'existe': return jsonify({"estado":"existe"})
    elif estado == True: return jsonify({"estado":"ok"})
    else: return jsonify({"estado":"mal"})
    
    
@app.route('/iniciarSesion', methods=["POST"])
def iniciarSesion():
    datos = request.get_json()           
    
    respuesta = bd.validarLogin(
        datos["email"],
        datos["clave"]        
    )
    
    if respuesta == []: return jsonify({"estado": "invalido"})    
    elif respuesta == False: return jsonify({"estado": False})          
    else:
        session["usuario"] = respuesta[0][0]
        session["nombre"] = respuesta[0][2]
        
        return jsonify({"estado": "valido"})        
        
    
@app.route('/registrarPublicacion', methods=["POST"])
def registrarPublicacion():
    if "usuario" in session:
        datos = request.get_json()    
            
        respuesta = bd.registrarPublicacion(datos["titulo"], datos["contenido"], session["usuario"])
        
        if respuesta: return jsonify({"estado": 'ok'})            
        return jsonify({"estado": 'malo'})
    
    return redirect(url_for("loginPage"))
        
        
@app.route("/listarPublicaciones")
def listarPublicaciones():
    respuesta = bd.listarPublicaciones()
    
    if respuesta == []:
        return jsonify({"respuesta":"vacio"})
    else: return jsonify({"respuesta": respuesta})

@app.route('/listaComentarios', methods=["POST"])
def listaComentarios():
    datos = request.get_json() 
    
    respuesta = bd.listarComentarios(datos["idPub"])
    
    if respuesta == False: return jsonify({"respuesta":"error"})
    else: return jsonify({"respuesta":respuesta})
    
    
@app.route('/listarRespuestas', methods=["POST"])
def listarRespuestas():
    datos = request.get_json() 
    
    respuesta = bd.listarRespuestas(datos["idCom"])
    
    if respuesta == False: return jsonify({"respuesta":"error"})
    else: return jsonify({"respuesta":respuesta})
            
            
@app.route('/registrarComentario', methods=["POST"])        
def registrarComentario():
    datos = request.get_json()    
    
    respuesta = bd.registrarComentario(datos["idPub"], datos["cuerpo"], session["usuario"])
    
    return jsonify({"respuesta":respuesta})

@app.route('/registrarRespuesta', methods=["POST"])        
def registrarRespuesta():
    datos = request.get_json()    
    
    respuesta = bd.registrarRespuesta(datos["idCom"], datos["cuerpo"], session["usuario"])
    
    return jsonify({"respuesta":respuesta})

@app.route('/reaccionar', methods=["POST"])        
def reaccionar():
    datos = request.get_json()    
    
    respuesta = bd.reaccionar(datos["idPub"], session["usuario"])
    
    return jsonify({"respuesta":respuesta})  

@app.route("/miPefil")
def miPefil():
    descipcion = bd.miPefil(session["usuario"])
        
    return jsonify({
        "nombre": session["nombre"], 
        "descripcion": descipcion
    })

    
@app.route("/misPublicaciones")
def misPublicaciones():
    respuesta = bd.misPublicaciones(session["usuario"])
    
    if respuesta == []:
        return jsonify({"respuesta":"vacio"})
    else: return jsonify({"respuesta": respuesta})

@app.route('/eliminarMiPublicacion', methods=["POST"])
def eliminarMiPublicacion():
    datos = request.get_json()
    
    respuesta = bd.eliminarMiPublicacion(datos["idPub"])
    
    if respuesta: return 'ok'
    else: return 'malo'

if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000", debug=True)

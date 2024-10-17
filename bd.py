import pymysql

class BD:
    
    def __init__(self, host, user, passwd, port, db) -> None:
        self.host = host
        self.user = user
        self.passwd = passwd
        self.port = port
        self.db= db
        
    def conectar(self):
        con = pymysql.connect(host=self.host, user=self.user, passwd=self.passwd, database=self.db, port=self.port)
        return con
    
    def rCliente(self, email, clave, nombreUser):
       try:
            con = self.conectar()        
            cursor = con.cursor()
            
            cursor.execute(f"SELECT * FROM perfil WHERE emailPerfil = '{email}' OR nombreUsuario = '{nombreUser}';")
            result = cursor.fetchone()
            print(result)
            
            if result:
                print('existe')
                return 'existe'
            else:                
                # Si el email y el nombre de usuario son únicos, proceder con el registro
                cursor.execute(f"INSERT INTO perfil VALUES('{email}', '{nombreUser}', '{clave}', 'Estoy comenzando en VAGOS', 3);")
                
                con.commit()
                con.close
                return True
                                    
            #idPerfil = cursor.lastrowid Para obtener el id de la ultima fila registrada                        
            
       except:
            return False
        
    def validarLogin(self, email, clave):
        try:
            con = self.conectar()
            cursor = con.cursor()
            
            cursor.execute(f"SELECT emailPerfil, clave, nombreUsuario FROM perfil WHERE emailPerfil = '{email}' AND clave = '{clave}';")
            
            datos = []
            for i in cursor:
                datos.append(i)
                
            con.close()
                
            return datos                                    
            
        except:
            return False
        
    def registrarPublicacion(self, titulo, contenido, perfil):
        try:
            con = self.conectar()
            cursor = con.cursor()
            
            cursor.execute(f"INSERT INTO `publicacion` (`idPublicacion`, `titulo`, `contenido`, `fecha`, `reaccion`, `perfil`) VALUES (NULL, '{titulo}', '{contenido}', NOW(), 0, '{perfil}');")
            
            con.commit()
            con.close
            return True                                              
        except:
            return False
    
    def listarPublicaciones(self):
        try:
            datos = []
            con = self.conectar()
            cursor = con.cursor()
            
            cursor.execute("SELECT idPublicacion, titulo, contenido, fecha, reaccion, nombreUsuario FROM publicacion pu INNER JOIN perfil pe ON pu.perfil = pe.emailPerfil ORDER BY `pu`.`fecha` DESC;")     
            
            for dato in cursor:                            
                datos.append(dato)                               
                            
            con.close
            print(datos)
            return datos                                              
        except:
            return False
        
    def listarComentarios(self, idPub):
        try:
            datos = []
            con = self.conectar()
            cursor = con.cursor()
            
            cursor.execute(f"SELECT idComentario, cuerpoComentario, fecha, nombreUsuario FROM comentario c INNER JOIN perfil p ON c.perfil = p.emailPerfil WHERE c.publicacion = {idPub} ORDER BY `c`.`fecha` DESC;")     
            
            for dato in cursor:                            
                datos.append(dato)                               
                            
            con.close
            return datos  
        except:
            return False
    
    def listarRespuestas(self, idCom):
        try:
            datos = []
            con = self.conectar()
            cursor = con.cursor()
            
            cursor.execute(f"SELECT cuerpoRespuesta, fecha, nombreUsuario FROM respuesta r INNER JOIN perfil p ON r.perfil = p.emailPerfil WHERE r.comentario = {idCom};")     
            
            for dato in cursor:                            
                datos.append(dato)                               
                            
            con.close
            return datos  
        except:
            return False

    def registrarComentario(self, idPub, cuerpoCom, perfil):
        try:
            con = self.conectar()
            cursor = con.cursor()
            
            cursor.execute(f"INSERT INTO `comentario` (`idComentario`, `perfil`, `publicacion`, `cuerpoComentario`, `fecha`) VALUES (NULL, '{perfil}', {idPub}, '{cuerpoCom}', Now());")     
            
            con.commit()                                                      
            con.close
            return True  
        except:
            return False        
        
    def registrarRespuesta(self, idCom, cuerpoRes, perfil):
        try:
            con = self.conectar()
            cursor = con.cursor()
            
            cursor.execute(f"INSERT INTO `respuesta` (`cuerpoRespuesta`, `perfil`, `comentario`, `fecha`) VALUES ('{cuerpoRes}', '{perfil}', {idCom}, NOW());")     
            
            con.commit()                                                      
            con.close
            return True  
        except:
            return False   
        
    def reaccionar(self, idPub, perfil):
        try:
            con = self.conectar()
            cursor = con.cursor()
            
            cursor.execute(f"INSERT INTO `reaccion` (`idPerfil`, `idPublicacion`) VALUES ('{perfil}', {idPub});")     
            
            cursor.execute(f"UPDATE `publicacion` SET `reaccion`= reaccion + 1 WHERE idPublicacion = {idPub};")
            
            con.commit()                                                      
            con.close
            return True  
        except:
            return False         
        
    def misPublicaciones(self, perfil):
        try:
            datos = []
            con = self.conectar()
            cursor = con.cursor()
            
            cursor.execute(f"SELECT `idPublicacion`, `titulo`, `contenido`, `fecha`, `reaccion` FROM publicacion WHERE publicacion.perfil = '{perfil}' ORDER BY `publicacion`.`fecha` DESC")     
            
            for dato in cursor:                            
                datos.append(dato)                               
                            
            con.close            
            return datos                                              
        except:
            return False
                        
    def miPefil(self, perfil):
        try:
            descripcion = ""
            con = self.conectar()
            cursor = con.cursor()
            
            cursor.execute(f"SELECT `descripcion` FROM `perfil` WHERE emailPerfil = '{perfil}';")     
            
            for dato in cursor:                            
                descripcion += dato[0]                          
                            
            con.close            
            return descripcion                                              
        except:
            return False        
        
    def eliminarMiPublicacion(self, idPub):
        try:            
            con = self.conectar()
            cursor = con.cursor()
            
            cursor.execute(f"DELETE FROM publicacion WHERE `publicacion`.`idPublicacion` = {idPub};")    
             
            con.commit()     
            con.close            
            return True                                              
        except:
            return False         
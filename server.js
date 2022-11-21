const express = require("express");
const path = require("path");



const app = express();
let funcionJs = require("./public/principal-cuadros.js");
let battles = require("./public/battlesData.json");
const { type } = require("os");
app.use(express.static('public'));
app.use(express.static('public/imagenes'));


//Recibimos los modulos del otro js

//------------------------------ GETTERS --------------------------------
app.get("/api", (req, res) => {
    app.statusCode = 202;
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

//Tipo de get con ruta especifica-SOLO MUESTRA EL JSON 
//Para ejemplo mira esta ruta http://localhost:3000/api/battle/Vegetta
                            //O otro ejemplo http://localhost:3000/api/battle/Goku?ordenar=CapiTuloFin
app.get("/api/battle/:id", (req, res) => {
    //Obtenemos la URL original
    let url = req.params.id;
    
    let resultado = battles.filter(personaje=>personaje.name == url);
    if(resultado.length === 0){
            return res.status(404).send(`No se encontro el personaje ${url} mencionado`);
    }
    
    
    if(req.query.ordenar !=undefined){
        resultado = ordenamiento(resultado,req.query.ordenar);
        
    }
        res.send(resultado);
    
 });

 app.get("/api/battle",(req,res)=>{
    let urlName = req.query.name;
    let resultado = battles.filter(personaje=>personaje.name == urlName);
    

    if(resultado.length===0){
        return res.status(404).send(`No se encontro el personaje ${url} mencionado`);
    }
    
    res.send(resultado);
 });



 // ----------------------------------------- GETS CSS Y JS ---------------------------------------------

 app.get('/api/estilos_cuadro.css',(req,res)=>{
    res.sendFile(__dirname+'/public/estilos_cuadro.css');
})

app.get('/principal-cuadros.js',(req,res)=>{
    res.sendFile(__dirname+'/public/principal-cuadros.js');
})
app.get('/api/index.js',(req,res)=>{
    res.sendFile(__dirname+'/public/index.js');
})
app.get('/api/imagenes/home-logo.png',(req,res)=>{
    res.sendFile(__dirname+'/public/imagenes/home-logo.png');
})

app.get('/api/imagenes/cuadro-fondo.webp',(req,res)=>{
    res.sendFile(__dirname+'/public/imagenes/cuadro-fondo.webp');
})



 function ordenamiento(r,tipo){
    switch(tipo.toLowerCase()){
        case "capituloinicio":
            return r.sort((a,b)=> a.infoDeFila.inicio - b.infoDeFila.inicio);break;
        case "capitulofin":
            return r.sort((a,b)=> a.infoDeFila.fin - b.infoDeFila.fin);break;
        case "ganador":
            return r.sort((a,b)=> a.infoDeFila.ganador - b.infoDeFila.ganador);break;
        case "descripcion":
            return r.sort((a,b)=> a.infoDeFila.descripcion - b.infoDeFila.descripcion);break;
        default:
            return r; break;
        }
        
 }



 //------------------------------------- SERVIDOR -------------------------------------------
const PUERTO = 3000;
var server = app.listen(PUERTO, () => {
    var port = server.address().port;
    console.log(`server running on port ${PUERTO}`);
})
const express = require("express");
const path = require("path");
const app = express();
let battles = require("./public/battlesData.json");
app.use(express.static('public'));
app.use(express.static('public/imagenes'));

//Recibimos los modulos del otro js

//------------------------------ GETTERS --------------------------------
app.get("/api", (req, res) => {
    app.statusCode = 202;
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

/*Tipo de get con ruta especifica-SOLO MUESTRA EL JSON.
Para ejemplo mira esta ruta http://localhost:3000/api/personajes/batallas/Vegetta
O otro ejemplo http://localhost:3000/api/personajes/batallas/Goku?ordenar=CapiTuloFin*/
app.get("/api/personajes/batallas/:id", (req, res) => {
    //Obtenemos la URL original
    let url = req.params.id;
    console.log(battles);
    let resultado = battles.filter(personaje => personaje.name == url);

    if (resultado.length === 0) {
        return res.status(404).send(`Error 404: No se encontro el personaje ${url}`);
    }
    if (req.query.ordenar != undefined) {
        resultado = ordenamiento(resultado, req.query.ordenar);
    }
    res.send(resultado);
});

//Buscar varios recursos
app.get("/api/personajes/batallas", (req, res) => {
    let urlName = req.query.name;
    let ordenar = req.query.ordenar;
    let cantidad = req.query.cantidad;
    let desde = req.query.from;
    let resultado = battles.filter(pj => pj.name == urlName);

    if (resultado.length === 0) 
        return res.status(404).send(`Error 404: No se encontro el personaje ${url}`);
    if (ordenar != undefined) {
        resultado = ordenamiento(resultado, ordenar);
    } else if (cantidad != undefined && desde != undefined) {
        let infoDeFila = resultado[0].infoDeFila;
        let aux = [];
        while (desde >= 0 && desde < infoDeFila.length && desde+1 <= cantidad) {
            aux.push(infoDeFila[desde]);
            desde++;
        }
        resultado[0].infoDeFila = aux;
    }
    
    res.send(resultado);
});

//------------------------------ POST --------------------------------
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

app.post('/api/personajes/agregar', urlencodedParser, function (req, res) {
    response = {
		"integrantes": req.body.integrantes,
		"inicio": req.body.inicio,
		"fin": req.body.fin,
		"ganador": req.body.ganador,
		"link": req.body.link,
		"descripcion": req.body.descripcion
    }
    console.log(response);
})

// ----------------------------------------- GETS CSS Y JS ---------------------------------------------
app.get('/api/battlesData.json', (req, res) => {
    res.sendFile(__dirname + '/public/battlesData.json');
});
app.get('/api/cuadro.html', (req, res) => {
    res.sendFile(__dirname + '/public/cuadro.html');
});
app.get('/api/estilos_cuadro.css', (req, res) => {
    res.sendFile(__dirname + '/public/estilos_cuadro.css');
});
app.get('/api/estilos_index.css', (req, res) => {
    res.sendFile(__dirname + '/public/estilos_index.css');
});
app.get('/api/index.html', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/api/principal-cuadros.js', (req, res) => {
    res.sendFile(__dirname + '/public/principal-cuadros.js');
});

function ordenamiento(r, tipo) {
    switch (tipo.toLowerCase()) {
        case "capituloinicio":
            return r.sort((a, b) => a.infoDeFila.inicio - b.infoDeFila.inicio); break;
        case "capitulofin":
            return r.sort((a, b) => a.infoDeFila.fin - b.infoDeFila.fin); break;
        case "ganador":
            return r.sort((a, b) => a.infoDeFila.ganador - b.infoDeFila.ganador); break;
        case "descripcion":
            return r.sort((a, b) => a.infoDeFila.descripcion - b.infoDeFila.descripcion); break;
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
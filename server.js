const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
let battles = require("./private/battlesData.json");
app.use(express.static('public'));
app.use(express.static('public/imagenes'));

//Recibimos los modulos del otro js

//------------------------------ GETTERS --------------------------------
//Página principal
app.get("/api", (req, res) => {
    app.statusCode = 202;
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

//Buscar recursos
app.get("/api/personajes/batallas", (req, res) => {
    let name = req.query.name;
    let cantidad = req.query.cantidad;
    let desde = req.query.from;
    let resultado;

    if (name == undefined) {
        return res.send(battles);
    } else {
        resultado = battles.filter(pj => pj.name == name);
        if (resultado.length === 0) {
            return res.status(404).send(`Error 404: No se encontro el personaje ${name}`);
        }
        if (cantidad != undefined && desde != undefined) {
            let resultadoAux = JSON.parse(JSON.stringify(resultado));
            let infoDeFila = resultadoAux[0].infoDeFila;
            let aux = [];
            let i = 1;
            while (desde >= 0 && desde < infoDeFila.length && i <= cantidad) {
                aux.push(infoDeFila[desde]);
                desde++;
                i++;
            }
            resultadoAux[0].infoDeFila = aux;
            if (aux.length != 0) {
                return res.send(resultadoAux);
            } else {
                return res.status(404).send(`Error 404: No existe la batalla número ${desde}`);
            }
        }
    }
    res.send(resultado);
});

//------------------------------ POST --------------------------------

app.post('/api/personajes/addBatalla', function (req, res) {
    console.log(req.query.name)
    if(req.query.name!=undefined){
        
        console.log(req.body);
        let jugador = battles.filter(personaje => personaje.name == req.query.name);
        console.log(jugador);
        if(jugador!=undefined){
            jugador[0].infoDeFila.push(req.body);
            res.send(jugador);
        }
    }else{
        res.status(404).send("ERROR");
    }
    
})

// ----------------------------------------- GETS HTML, CSS Y JS ---------------------------------------------
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

//------------------------------------- SERVIDOR -------------------------------------------
const PUERTO = 3000;
var server = app.listen(PUERTO, () => {
    var port = server.address().port;
    console.log(`server running on port ${PUERTO}`);
})
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static('public'));

//GET para index
app.get("/api/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
//GET para cuadro
app.get("/api/battle", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/cuadro.html"));
});

var server = app.listen(4444, () => {
    var port = server.address().port

    console.log("server running on port", 4444)
})
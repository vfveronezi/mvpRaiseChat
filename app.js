var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/assets/css.css', function (req, res) {
    res.sendFile(__dirname + '/assets/css.css');
});

io.on("connection", function (client) {
    client.on("join", function (name) {
        console.log("Entrou: " + name);
        clients[client.id] = name;
        client.emit("update", "Você entrou no servidor.");
        client.broadcast.emit("update", name + " entrou no servidor.")
    });

    client.on("send", function (msg) {
        console.log("Mensagem: " + msg);
        client.broadcast.emit("chat", clients[client.id], msg);
    });

    client.on("disconnect", function () {
        console.log("Desconectou");
        io.emit("update", clients[client.id] + " deixou o servidor.");
        delete clients[client.id];
    });
});


http.listen(3000, function () {
    console.log('ouvindo na porta 3000');
});

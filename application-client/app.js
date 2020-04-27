let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let bodyParser = require('body-parser');
let listeUsagers = []

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

//redirection vers la page principale
app.get('/:token', function(req, res) {
    res.sendFile(__dirname + '/index.html');

    app.post('/musiqueAdd', function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        io.sockets.in(req.body.token).emit('NewMusique', req.body)
        res.send('coucou');
    })
    
    app.post('/currentMusique', function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        io.sockets.in(req.body.token).emit('currentMusique', req.body)
        res.send('coucou');
    })
    
    io.sockets.on('connection', function(socket) {
        console.log("Client connecté");
    
        socket.on('user', function(data) {
            listeUsagers.push(data)
            console.log(listeUsagers)
        })

        socket.on('room', function(room) {
            socket.join(room)
        })

        
        
    
    })
});



server.listen(process.env.PORT || 3000);




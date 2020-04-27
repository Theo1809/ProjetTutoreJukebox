let axios = require('axios')
let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let bodyParser = require('body-parser');
let cors = require('cors')


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(cors())
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

    io.sockets.on('connection', function(socket) {
        socket.on('room', function(room) {
            socket.join(room)
            //setTimeout(updateToken(room), 21600000)
        })
    })

    

});

app.post('/ajouterMusique', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log(req.body.token)
    io.sockets.in(req.body.token).emit('lireMusique', req.body)
    res.send('true')
})

function updateToken(tok) {
    console.log(tok)
    axios({
        method: 'put',
        url: 'https://jukeboxapimusic.herokuapp.com/newToken',
        data: {
            token: tok
        }
      })
        .then(function (response) {
          console.log(response.data)
        });
}






server.listen(process.env.PORT || 3000);
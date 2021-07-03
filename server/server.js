// port 

const _PORT = process.env.PORT || 3001;

// modules here

require('dotenv').config(); // .env file should be in the root folder

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

//const db = require('./config/connection');
// import our typeDefs and resolvers

const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

// Express will be invoked in the top level of the file and 
// stored in a instance of appServer 
const app = express();
const appServer = app.listen(_PORT, () => { 
    // appServer will be passed in 
    // the HOF's arg              
    console.log('listening');
});
const { ApolloServer } = require('apollo-server-express');
const io = require('socket.io')(appServer, {
    // from here the server is instantiated with from the app 
    // instance created in the top level
    cors: {origin: `http://localhost:3000`}
});

// schema, resolver, typeDefs here

/* const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
}); */

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Database connection

/* 

    For Contributors please modularize this code in the config
    and get the .env vars from scrum lead

*/

mongoose.connect(`mongodb+srv://${process.env.UN}:${process.env.PW}@cluster0.kufxl.mongodb.net/${process.env.DB}?retryWrites=true&w=majority` || 'http://localhost:3001', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {

    //emit => sends data
    //on => receives data

    // global object
    let players = {}


    // When the client request hit the server, the socket is instantiated
    io.on('connection', connected);

    function connected(socket) {

        socket.on('newPlayerJoined', data => {
            console.log(`new player joined ${socket.id}`)
            socket.emit('queuePlayerInClient', data)
            /* // with theses new players they can be stored in key value 
            // pairs in a global object
            console.log(`New player add: ${socket.id}`);
            // the player's socket id is made a property of the 
            // data recevied ( which is passed in the client )
            players[socket.id] = data;
            console.log(`Spawned ${data.x}`)
            console.log(`There are ${Object.keys(players).length} players in the server`);
            console.log(`players dictionary: `, players);
            // let's send to the client to update the dictionaries of the players
            socket.emit('updatePlayers', players) */
        });
        // disconnecting
        // "disconnect" is a reserve string keyword for the socket's methods

        socket.on('disconnect', function() {
            /* delete players[socket.id];
            console.log(`${socket.id} left the server`)
            console.log(`There are ${Object.keys(players).length} players in the server`);

            // let's send to the client to update the dictionaries of the players
            socket.emit('updatePlayers', players) */
        });

    }

}).catch(err => {
    console.log('failed')
    console.log(err)
});


// let express = require('express');
//Install and load lowdb
import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

//Initialize the express 'app' object
let app = express();

//Connect to database
let defaultData = { confessionsData: [] };
let adapter = new JSONFile('db.json');
let db = new Low(adapter, defaultData);

//Initialize/read database
db.read().then(() => {
    console.log('Database intialized');
})

//Initialize the express 'app' object 2
app.use('/', express.static('public'));

//To parse JSON
app.use(express.json());

//Route listening for a post request
app.post('/newData', (request, response) => {
    console.log(request.body);
    let obj = {
        msg: request.body.msg
    }
    //Add value to database
    db.data.confessionsData.push(obj);
    db.write()
        .then(() => {
            response.json({ task: "success" });
        });
});

app.get('/getData', (request, response) => {
    //Load values/fetch from database
    db.read()
        .then(() => {
            let obj = { data: db.data.confessionsData }
            response.json(obj);
        });
});


//Initialize HTTP server
//let http = import('http');
// let server = http.createServer(app);
let server = createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('Server listening at port:' + port);
});

//Initialize socket.io
// let io = require('socket.io');
let io = new Server(server);

//Listen for individual clients to connect
io.sockets.on('connection', function (socket) {
    console.log('A new client has entered:' + socket.id);

    //Listen for a message named 'msg' from this client
    socket.on('msg', function (data) {
        console.log('Received a msg event');
        console.log(data);

        //Save confessions to db.json
        let obj = {
            msg: data.msg
        }

        db.data.confessionsData.push(obj);
        db.write()
            .then(() => {
                console.log('Saved to database')

                //Send a response to ALL clients
                io.sockets.emit('msg', data);
            });
    });

    //Listen for this client to disconnect
    socket.on('disconnect', function () {
        console.log('A client has disconnected: ' + socket.id);
    });
});


// app.listen(3000,() => {
//     console.log('listening at localhost:3000');
// });
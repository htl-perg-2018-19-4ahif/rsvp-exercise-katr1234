import * as auth from 'express-basic-auth';
import * as loki from 'lokijs';
import * as express from 'express';
import { NOT_FOUND, BAD_REQUEST, UNAUTHORIZED } from 'http-status-codes';

let guestCount: number;
let server = express();
server.use(express.json());

const port: number = 8090;
server.listen(port, function () {
    console.log('API is listening on port ' + port)
});


let authentification = auth({
    users: {
        'admin': 'admin'
    }
})

const db = new loki(__dirname + '/db.dat');
let guestC = db.addCollection('guests');

server.get('/party', function (req, res) {
    res.send({
        title: 'Christmas Party',
        date: '23.12.2018',
        location: 'At my place'
    }
    );
})

let firstname: string;
let lastname: string;

server.post('/register', function (req, res) {
    firstname = req.body.firstName;
    lastname = req.body.lastName;

    if (firstname == '' || lastname == '') {
        res.status(BAD_REQUEST).send('Schreibe den ganzen Namen!');
    }

    else{
        if (guestCount < 10) {
            guestC.insert({ fistName: firstname, lastName: lastname });
            guestCount++;
        } else {
            res.status(UNAUTHORIZED).send('Maximale Nummer wurde erreicht!');
        }
    }
    
})

server.get('/guests', authentification, function (req, res) {
    if (!res.send(guestC.find())) {
        res.status(NOT_FOUND).send('Keine Gäste gefunden!');
    } else {
        res.send(guestC.find());
    }
})
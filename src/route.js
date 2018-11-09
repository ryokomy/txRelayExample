const express = require("express");
const bodyParser = require('body-parser');
const txController = require('./controllers/txController')

const app = express();

// for post request
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// listen
const server = app.listen(8080, async () => {
    console.log('Node.js is listening to PORT:' + server.address().port)
});

// api -----------------------------------------------------
app.get('/', async (req, res, next) => {
    res.end('Transaction Relay Example');
});
app.post('/txRelay', txController.txRelay);

// error ----------------------------------------------------
// 404 error
app.use((req, res, next) => {
	res.status(404);
	res.end('Not found: ' + req.path);
});
// 500 error
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({error: err.stack})
})
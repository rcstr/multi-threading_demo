// $ time curl --get http://localhost:3000/blocking
// result is 160000000000
// real	0m24.707s
// user	0m0.006s
// sys	0m0.008s

const express = require('express');
const {Worker} = require('worker_threads')

const app = express();
const port = process.env.PORT || 3000;

app.get("/non-blocking/", (req, res) => {
	res.status(200).send("This page is non-blocking");
});

app.get("/blocking", async (req, res) => {
	const counter = new Worker('./worker.js');

	counter.on('message', (data) => {
		res.status(200).send(`result is ${counter}`);
	});
	counter.on('error', (msg) => {
		res.status(404).send(`An error ocurred: ${msg}`);
	});
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});

// time curl --get http://localhost:3000/blocking
// result is 20000000000
// real	0m3.155s
// user	0m0.006s
// sys	0m0.008s

const express = require('express');
const {Worker, workerData} = require('worker_threads')

const app = express();
const port = process.env.PORT || 3000;

app.get("/non-blocking/", (req, res) => {
	res.status(200).send("This page is non-blocking");
});


const THREAD_COUNT = 8;

function createWorker() {
	return new Promise((resolve) => {
		const worker = new Worker('./ten_workers.js', {workerData: {thread_count: THREAD_COUNT}});

		worker.on('message', (data) => {
			resolve(data)
		});
		worker.on('error', (msg) => {
			reject(`An error occurred ${msg}`);
		});
	})
}

app.get("/blocking", async (req, res) => {
	const workerPromises = [];
	for (let i = 0; i < THREAD_COUNT; i++) {
		workerPromises.push(createWorker())
	}

	const thread_results = await Promise.all(workerPromises);
	const total =
		thread_results[0] +
		thread_results[1] +
		thread_results[2] +
		thread_results[3] +
		thread_results[4] +
		thread_results[5] +
		thread_results[6] +
		thread_results[7];
	res.status(200).send(`result is ${total}`);
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});

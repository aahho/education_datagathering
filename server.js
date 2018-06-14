var express = require('express');
var http = require('http');
var morgan = require('morgan');
var connectDB = require('./index').connectDB;

var app = express();
var db = null;
const port = 5050;
const server= http.createServer(app);

app.use(morgan("dev"));

function respond(res, data, status_code = 200) {
	res.json({
		code: status_code,
		data: data,
		message: status_code == 200 ? "Success" : "Error"
	});
}

app.get("/preschool", function(req, res) {
	let page = req.query.page || 1;
	let limit = req.query.limit || 30;
	let skip = (page - 1) * limit;
	let cursor = db.collection('preschool').find({}).skip(skip).limit(limit);
	cursor.toArray((err, result) => {
		if(err) {
			return respond(res, "Some error occured", 500);
		}
		respond(res, result);
	});
});

app.post("/preschool", function(req, res) {
});

if(!module.parent) {
	connectDB((client) => {
		if(!client) {
			console.log("error");
			process.exit();
		}
		db = client.db("education");
		server.listen(port, (err) => {
			if (err) {
				console.log(err);
				process.exit();
			}

			return console.log(`server is listening on ${port}`)
		});
	});
}

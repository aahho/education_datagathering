var express = require('express');
var http = require('http');
var morgan = require('morgan');
var connectDB = require('./index').connectDB;
var fs = require("fs");
var ObjectID = require("mongodb").ObjectID;

var app = express();
var db = null;
const port = 5050;
const server= http.createServer(app);

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', '*');

	next();
});
app.use(morgan("dev"));

const TEMPLATE_DIR = __dirname + "/templates/";
const STATIC_DIR = __dirname + "/static/";

function respond(res, data, status_code = 200) {
	res.json({
		code: status_code,
		data: data,
		message: status_code == 200 ? "Success" : "Error"
	});
}

function render(res, template) {
	fs.readFile(TEMPLATE_DIR + template, "utf8", function(err, result) {
        // console.log(err, res);
        if (err) {
            return res.send(err);
        }
        res.send(result);
    });
}

app.get("/static/:filename", function(req, res){
	var filename = req.params.filename; 
	fs.readFile(STATIC_DIR + filename, "utf8", function(err, result) {
        // console.log(err, res);
        if (err) {
            return res.send(err);
        }
		let fsplits = filename.split(".");
		let extension = fsplits[fsplits.length - 1];
		if(extension == "js") {
			res.set('Content-Type', 'text/javascript');
		} else if (extension == "css") {
			res.set('Content-Type', 'text/css');
		}
        res.send(result);
    });
});

app.get("/preschool/list", function(req, res){
	return render(res, "list.html")
});

app.get("/preschool/details/:id", function(req, res){
	return render(res, "details.html")
});

app.get("/preschool", function(req, res) {
	let page = req.query.page || 1;
	let limit = req.query.limit || 30;
	let skip = (page - 1) * limit;
	console.log(skip, limit);
	let cursor = db.collection('preschool').find({}).skip(skip).limit(limit);
	cursor.toArray((err, result) => {
		if(err) {
			return respond(res, "Some error occured", 500);
		}
		respond(res, result);
	});
});

app.get("/preschool/:id", function(req, res) {
	let cursor = db.collection('preschool').find({ _id: ObjectID(req.params.id) });
	cursor.toArray((err, result) => {
		if(err || result.length < 1) {
			return respond(res, "Some error occured", 500);
		}
		respond(res, result[0]);
	});
});

app.post("/preschool", function(req, res) {
});

app.post("/preschool/:id", function(req, res) {
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

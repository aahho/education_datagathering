var googleMapsClient = require('@google/maps').createClient({
	key: 'AIzaSyD2U7TiCUANSUFYhC27-Duno0kr0_5kzF0'
});

const MongoClient = require('mongodb').MongoClient;
let db = null;

function connectDB(callback) {
	MongoClient.connect("mongodb://35.154.122.180", function(err, client){
		if(err) {
			console.log("Error connecting to database", err);
			return callback(false);
		}
		callback(client);
	});
}

function insertData(collection, data) {
	db.collection(collection).insert(data);
}

function storeGoogleData(school, school_details) {
	insertData('preschool', {
		courses : '',
		highlights: '',
		facilities: '',
		reviews : '',
		qna : '', // q&a
		gallery: '',
		scholarship: '',
		contacts: '',
		fees: '',
		admission_time: '',
		admission_eligibility : ''
	});
}

function gatherData(search_query) {
	googleMapsClient.places({ query: search_query }, function(err, response){
		if (!err) {
			// console.log(response.json.results);
			let list = response.json.results;
			for(let i in list) {
				let school = list[i];
				console.log(school);
				googleMapsClient.place({ placeid: school.place_id }, function(err, response){
					if(err) {
						console.log("Err", err);
						return;
					}
					console.log("Details", response.json.result); 
				});
				// break;
			}
		} else {
			console.log("ERROR: ", err);
		}
	});
}

function init(){
	connectDB((conn) => {
		if(!conn) {
			console.log("DB Connection unsuccessfull");
			process.exit();
		}
		db = conn.db("education");
		gatherData("preschool in hyderabad");
	});
}

module.exports = {
	connectDB: connectDB
}

if (!module.parent) {
	init();
	// console.log("BBB", module.parent);
}

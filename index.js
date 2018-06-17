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
	console.log("Inserting data");
}

function storeGoogleData(school, school_details) {
	/*
	console.log("AAA", Object.keys(school_details));
	let c = 0;
	for(let i in school_details) {
		console.log(i, school_details[i]);
		console.log("---------------------");
		c += 1;
	}
	*/
	insertData('preschool', {
		name : school_details.name,
		courses : school_details.courses,
		highlights: school_details.highlights,
		facilities: school_details.facilities,
		reviews : school_details.reviews,
		qna : school_details.qna, // q&a
		gallery: {
			google_maps: school_details.photos
		},
		logo: school_details.icon,
		scholarship: scholarship.scholarship,
		contacts: {
			address: school_details.address_components,
			adr_address: school_details.adr_address,
			formatted_address: school_details.formatted_address,
			website: school_details.website,
			phone: school_details.international_phone_number,
			formatted_phone_number: school_details.formatted_phone_number,
			geometry: school_details.geometry,
			vicinity: school_details.vicinity
		},
		fees: school_details.fees,
		admission_time: school_details.admission_time,
		admission_eligibility : school_details.admission_eligibility,
		data_from : 'google_maps',
		other: {
			place_id: school_details.place_id,
			rating: school_details.rating,
			url: school_details.url,
			reference: school_details.reference
		}
	});
}

function gatherData(search_query) {
	googleMapsClient.places({ query: search_query }, function(err, response){
		if (!err) {
			// console.log(response.json.results);
			let list = response.json.results;
			for(let i in list) {
				let school = list[i];
				// console.log(school);
				googleMapsClient.place({ placeid: school.place_id }, function(err, response){
					if(err) {
						console.log("Err", err);
						return;
					}
					// console.log("Details", response.json.result); 
					storeGoogleData(school, response.json.result);
				});
				break;
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

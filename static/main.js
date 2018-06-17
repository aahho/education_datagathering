
function getPreschoolList() {
	$.get("/preschool", function(data, status){
		console.log(data.data);
		let elem = $("#preschool_data");
		for(let i in data.data) {
			let d = elem.html();
			let p_data = data.data[i];
			let html = `
				<tr>
					<td><a href="/preschool/details/${p_data._id}">${p_data.name}</a></td>
					<td>${p_data.courses}</td>
					<td>${p_data.highlights}</td>
					<td>${p_data.facilities}</td>
					<td>${ JSON.stringify(p_data.reviews) }</td>
					<td>${p_data.qna}</td>
					<td>${ JSON.stringify(p_data.gallery) }</td>
					<td>${p_data.scholarship}</td>
					<td>${ JSON.stringify(p_data.contacts) }</td>
					<td>${p_data.fees}</td>
					<td>${p_data.admission_time}</td>
					<td>${p_data.admission_eligibility}</td>
				</tr>
			`;
			elem.html(d + html);
			console.log(p_data);
		}
    });
}

function getPreschoolDetails(id) {
	$.get("/preschool/" + id, function(data, status) {
		console.log(data);
	});
}

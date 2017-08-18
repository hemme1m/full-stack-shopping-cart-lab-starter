const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
// Serve files from public folder. That's where all of our HTML, CSS and Angular JS are.
app.use(express.static('public'));
// This allows us to accept JSON bodies in POSTs and PUTs.
app.use(bodyParser.json());

// TODO Set up access to the database via a connection pool. You will then use
// the pool for the tasks below.

var pool = new pg.Pool({
	user: "postgres",
	password: "mark1",
	host: "localhost",
	port: 5432,
	database: "postgres",
	ssl: false
});


// GET /api/items - responds with an array of all items in the database.
// TODO Handle this URL with appropriate Database interaction.

app.get("/api/items", function(req, res) {
	pool.query("SELECT * FROM shoppingcart").then(function(result) {
		res.send(result.rows);
	}).catch(function(err) {
		console.log(err);
		res.status(500);
		res.send("Server Error");
	});
});


// POST /api/items - adds and item to the database. The items name and price
// are available as JSON from the request body.
// TODO Handle this URL with appropriate Database interaction.

app.post("/api/items", function(req, res) {
	var sql = "INSERT INTO shoppingcart (product, price) VALUES ($1::text, $2::float)";
	var values = [req.body.product, req.body.price];
	pool.query(sql, values).then(function(result) {
		res.status(201).send("Added");
	}).catch(function(err) {
		console.log(err);
		res.status(500);
		res.send("Server Error");
	});
});

// DELETE /api/items/{ID} - delete an item from the database. The item is
// selected via the {ID} part of the URL.
// TODO Handle this URL with appropriate Database interaction.

app.delete('/api/items/:id', function(req, res) {
	var id = parseInt(req.params.id);
	pool.query("DELETE FROM shoppingcart WHERE id = $1::int", [id]).then(function() {
		res.send("Deleted Item ID:" + id);
	}).catch(function(err) {
		console.log(err);
		res.status(500);
		res.send("Server Error");
	});
});


var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log('JSON Server is running on ' + port);
});

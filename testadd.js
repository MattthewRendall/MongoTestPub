const { MongoClient } = require("mongodb");

// The uri string must be the connection string for the database (obtained on Atlas).
const uri = "mongodb+srv://matthewrendall:Ladiesman217@cluster0.oql8tvl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// This password is not one I normally use, just for this assignment.


const RegisterPage = """
  <html>
        <form action = "/register" method = "post">
            <input type="text" name="username" placeholder="Username"><br>
            <input type="password" name="password" placeholder="Password"><br>
            <button type="submit">Login</button>
        </form>
  </html>
"""

const LoginPage = """
  <html>
        <form action = "/login" method = "post">
            <input type="text" name="username" placeholder="Username"><br>
            <input type="password" name="password" placeholder="Password"><br>
            <button type="submit">Login</button>
        </form>
  </html>
"""
  
// --- This is the standard stuff to get it to work on the browser
const express = require('express');
const app = express();
const port = 3000;
app.listen(port);
console.log('Server started at http://localhost:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes will go here

// Default route.
// Provides a selection of routes to go to as links.
app.get('/', function(req, res) {
  var outstring = 'Default endpoint starting on date: ' + Date.now();
  outstring += '<p><a href=\"./register\">Go to Register</a>';
  outstring += '<p><a href=\"./login\">Go to Login</a>';
  res.send(outstring);
});

  // Connect to the MongoDB Atlas database
  const client = new MongoClient(uri);

  try {
    // Connect to the database
    await client.connect();

    // Access the "goodStuff2" collection
    const database = client.db('matthewrendallDB');
    const goodStuffCollection = database.collection('goodStuff2');

    // Create a document with the provided userID and password
    const credentials = { userID, password };

    // Insert the credentials into the collection
    const result = await goodStuffCollection.insertOne(credentials);

    // Send a response indicating successful registration
    res.send('Registration successful');
  } catch (error) {
    // Handle any errors that occur during registration
    console.error('Error during registration:', error);
    res.status(500).send('Registration failed');
  } finally {
    // Close the database connection
    await client.close();
  }
});

app.get('/register', function(req, res) {
  var outstring = RegisterPage
  res.send(outstring);
});

app.get('/login', function(req, res) {
  var outstring = LoginPage
  res.send(outstring);
});

app.get('/say/:name', function(req, res) {
  res.send('Hello ' + req.params.name + '!');
});


// Access Example-1
// Route to access database using a parameter:
// access as ...app.github.dev/api/mongo/9876
app.get('/api/mongo/:item', function(req, res) {
const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('matthewrendallDB');
    const parts = database.collection('goodStuff2');

    // Here we make a search query where the key is hardwired to 'partID' 
    // and the value is picked from the input parameter that comes in the route
     const query = { partID: req.params.item };
     console.log("Looking for: " + query);

    const part = await parts.findOne(query);
    console.log(part);
    res.send('Found this: ' + JSON.stringify(part));  //Use stringify to print a json

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
});


// Access Example-2
// Route to access database using two parameters:
app.get('/api/mongo2/:inpkey&:item', function(req, res) {
// access as ...app.github.dev/api/mongo2/partID&12345
console.log("inpkey: " + req.params.inpkey + " item: " + req.params.item);

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('matthewrendallDB');
    const where2look = database.collection('goodStuff2');

    // Here we will make a query object using the parameters provided with the route
    // as they key:value pairs
    const query = {};
    query[req.params.inpkey]= req.params.item;

    console.log("Looking for: " + JSON.stringify(query));

    const part = await where2look.findOne(query);
    console.log('Found this entry: ', part);
    res.send('Found this: ' + JSON.stringify(part));  //Use stringify to print a json

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
});


// Route to write to the database:
// Access like this:  https://.....app.github.dev/api/mongowrite/partID&54321
// References:
// https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertOne
// https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertMany

app.get('/api/mongowrite/:inpkey&:inpval', function(req, res) {
console.log("PARAMS: inpkey: " + req.params.inpkey + " inpval: " + req.params.inpval);

const client = new MongoClient(uri);

// The following is the document to insert (made up with input parameters) :
// First I make a document object using static fields
const doc2insert = { 
  name: 'Cris', 
  Description: 'This is a test', };
// Additional fields using inputs:
  doc2insert[req.params.inpkey]=req.params.inpval;

console.log("Adding: " + doc2insert);

async function run() {
  try {
    const database = client.db('matthewrendallDB');
    const where2put = database.collection('goodStuff2');

    const doit = await where2put.insertOne(doc2insert);
    console.log(doit);
    res.send('Got this: ' + JSON.stringify(doit));  //Use stringify to print a json

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
});

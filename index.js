const express = require("express");
const bodyParser = require("body-parser");
const serveStatic = require('serve-static');
const path = require('path');
const port = 3000;

/*Never store like this on a production server:*/
const users = [
    {
        username: 'test',
        password: 'pass',
        role: 'admin'
    }, {
        username: 'test2',
        password: 'pass2',
        role: 'member'
    }
];


const app = express()

//Serve the public folder containing the login form:
app.use(serveStatic(path.join(__dirname, 'public')));

//For apps sending POST directly - application/x-www-form-urlencoded:
app.use(bodyParser.urlencoded({ extended: true }));

//Handle Login from public/index.html
app.post('/login', (req, res) => {

    // Read username and password from request body
    const { username, password } = req.body;

    // Filter user from the users array by username and password
    const user = users.find(u => {
      return u.username === username && u.password === password }
    );

    if (user) {
        //Setup a route for private:
        app.get('/private',(req, res) => {
            res.sendFile('index.html', { root: path.join(__dirname, '/private') });
        });
        //Redirect to private:
        res.redirect('/private');

    } else {
        //Setup a route for error:
        app.get('/error',(req, res) => {
            res.sendFile('error.html', { root: path.join(__dirname, '/public') });
        });
        //Redirect to private:
        res.redirect('/error');
    }
    res.end('');

});

app.listen(port, () => {
    console.log('Authentication service started on port 3000');
});

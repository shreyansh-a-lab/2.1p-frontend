//Server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Mailgun = require('mailgun.js');
const formData = require('form-data');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/signup', function(req, res) {
    const firstname = req.body.firstname;
    const email = req.body.email;

    sendWelcomeEmail(firstname, email, function(error, body) {
        if (error) {
            console.error("Error sending email:", error);
            res.send("There was an error signing up. Please try again.");
        } else {
            console.log("Email sent successfully:", body);
            res.send(`Welcome, ${firstname}! Your email is ${email}`);
        }
    });
});

function sendWelcomeEmail(firstname, email, callback) {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({username: 'api', key: '12e8a03c4435bf8b87819b2793eeeb8a-79295dd0-b49d55f4'});

    const data = {
        from: 'gursharanpreet4779.be23@chitkara.edu.in',
        to: email,
        subject: 'Welcome to Deakin Newsletter',
        text: `Hi ${firstname} ,\n\nThank you for signing up for the Deakin Newsletter! We're excited to have you with us.\n\nBest regards,\nDeakin Team`,
    };

    mg.messages.create('sandbox0658f58e39e74e988c9b31ba29732a4b.mailgun.org', data)
        .then(body => callback(null, body))
        .catch(error => callback(error, null));
}

app.listen(8080, function() {
    console.log("The server is listening on port 8080");
});
const express = require('express');
const bodyParser = require('body-parser');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
require('dotenv').config();

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// Mailgun setup
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || 'e9dd9daa8f4a593614eb25558f8ab929-79295dd0-c72fc8af' 
});

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html'); 
});

// Route to handle form submission
app.post('/', (req, res) => {
    const { Email } = req.body;

    if (!Email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Send welcome email using Mailgun
    mg.messages.create(process.env.MAILGUN_DOMAIN || 'sandbox8085a717f439400f83ae97812dc1a57e.mailgun.org', {
        from: `bullet <mailgun@${process.env.MAILGUN_DOMAIN || 'sandbox8085a717f439400f83ae97812dc1a57e.mailgun.org'}>`,
        to: [Email],
        subject: 'Welcome to our Daily Insider!',
        text: 'Thank you for subscribing to our Daily Insider newsletter. Stay tuned for more updates!',
        html: '<h1>Thank you for subscribing to our Daily Insider newsletter. Stay tuned for more updates!</h1>'
    })
    .then(msg => {
        console.log(msg); // logs response data
        res.status(200).json({ message: 'Subscription successful, email sent!' });
    })
    .catch(err => {
        console.error(err); // logs any error
        res.status(500).json({ error: 'Failed to send email' });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

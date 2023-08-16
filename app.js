const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch'); // Import the node-fetch library
const app = express();
const port = process.env.PORT || 5000; // Use process.env.PORT for compatibility with hosting platforms

// Set up middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.post('/submit', async (req, res) => {
    const { name, email, message } = req.body;
    console.log('Received submission:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    try {
        // Send form data to Formspree endpoint using node-fetch
        const response = await fetch('https://formspree.io/f/mdorejyz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message }),
        });

        if (response.ok) {
            // Form submission was successful
            console.log('Form submitted to Formspree successfully.');
            res.status(200).json({ message: 'Submission received and forwarded!' });
        } else {
            // Form submission failed
            console.error('Form submission to Formspree failed.');
            res.status(500).json({ error: 'Form submission failed.' });
        }
    } catch (error) {
        console.error('Error sending form data:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

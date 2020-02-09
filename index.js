const express = require('express'); // import the express package
const { insert } = require('./data/db')
const server = express(); // creates the server
const bodyParser = require('body-parser')

server.use(express.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// handle requests to the root of the api, the / route
server.get('/', (req, res) => {
    res.send('Hello from Express');
});

server.post('/api/users', async (req, res, next) => {
    try {
        const { name, bio } = req.body
        if (!name|| !bio) {
            const provideBioAndName = new Error("Please provide name and bio for the user.")
            provideBioAndName.httpStatusCode = 400
            throw provideBioAndName
        }
        const newUser = await insert({ name, bio })
        return res.json(newUser)
    } catch (e) {
        console.log(e)
        next(new Error('There was an error while saving the user to the database'))
    }
})



server.use((err, req, res, next) => {
    res.status(err.httpStatusCode || 500).json({
        errorMessage: err.message
    })
})

// watch for connections on port 5000
server.listen(5000, () =>
    console.log('Server running on http://localhost:5000')
);
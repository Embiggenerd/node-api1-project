const express = require('express'); // import the express package
const { insert, find, findById, remove, update } = require('./data/db')
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
        if (!name || !bio) {
            const provideBioAndName = new Error("Please provide name and bio for the user.")
            provideBioAndName.httpStatusCode = 400
            throw provideBioAndName
        }
        const {id} = await insert({ name, bio })
        const newUser = await findById(id)
        console.log(id, newUser)
        return res.status(201).json(newUser)
    } catch (e) {
        if (e.httpStatusCode !== 400) {
            next(new Error('There was an error while saving the user to the database'))
        }
        next(e)
    }
})

server.get('/api/users', async (req, res, next) => {
    try {
        const users = await find()
        return res.json(users)
    } catch (e) {
        throw new Error('The users information could not be retrieved.')
    }
})

server.get('/api/users/:id', async (req, res, next) => {
    try {
        const user = await findById(req.params.id)
        if (!user) {
            const noSuchUser = new Error('The user with the specified ID does not exist.')
            noSuchUser.httpStatusCode = 404
            throw noSuchUser
        }
        return res.json(user)
    } catch (e) {
        if (e.httpStatusCode !== 404) {
            return next('The user information could not be retrieved.')
        }
        next(e)
    }
})

server.delete('/api/users/:id', async (req, res, next) => {
    try {
        const user = await remove(req.params.id)
        if (!user) {
            const noSuchUser = new Error('The user with the specified ID does not exist.')
            noSuchUser.httpStatusCode = 404
            throw noSuchUser
        }
        return res.json(user)
    } catch (e) {
        if (e.httpStatusCode !== 404) {
            return next('The user could not be removed')
        }
        next(e)
    }
})

server.put('/api/users/:id', async (req, res, next) => {
    try {
        const { name, bio } = req.body
        if (!name || !bio) {
            const provideBioAndName = new Error("Please provide name and bio for the user.")
            provideBioAndName.httpStatusCode = 400
            throw provideBioAndName
        }

        const user = await update(req.params.id, { name, bio })
        if (!user) {
            const noSuchUser = new Error('The user with the specified ID does not exist.')
            noSuchUser.httpStatusCode = 404
            throw noSuchUser
        } 

        const newUser = await findById(req.params.id)
        return res.json(newUser)

    } catch (e) {
        if(!e.httpStatusCode) {

        }
        next(new Error('The user information could not be modified.'))
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
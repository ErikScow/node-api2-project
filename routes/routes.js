const express = require('express')

const router = express.Router()

const db = require('../data/db.js')

router.post('/', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        db.insert(req.body)
            .then(id => {res.status(201).json(id)
            })
            .catch(error => {
                console.log('post database error: ', error)
                res.status(500).json({ error: "There was an error while saving the post to the database" })
            })
    }
})

router.post('/:id/comments', (req, res) => {
    if(!req.params.id) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else if(!req.body.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else {
        db.insertComment(req.body)
            .then(comment => {
                res.status(201).json(comment)
            })
            .catch(error => {
                console.log('comment post database error: ', error)
                res.status(500).json({ error: "There was an error while saving the comment to the database" })
            })
    }
})

router.get('/', (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            console.log('get database error: ', error)
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})

router.get('/:id', (req, res) => {

})

router.get('/:id/comments', (req, res) => {

})

router.delete('/:id', (req, res) => {

})

router.put('/:id', (req, res) => {

})

module.exports = router
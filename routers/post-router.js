const express = require('express')
const db = require('../data/db.js')

const router = express.Router()

router.post('/', (req, res) => {
    if (!req.body.title || !req.body.contents){
        res.status(400).json({errorMessage: 'Please provide title and contents for the post.'})
    } else {
        db.insert(req.body)
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                res.status(500).json({error: "Database Error"})
            })
    }
})

router.post('/:id/comments', (req, res) => {
    db.findById(req.params.id)
        .then(post => {
            if (post !== []) {
                if (!req.body.text){
                    res.status(400).json({errorMessage: "Please provide text for the comment."})
                } else {
                    db.insertComment(req.body)
                        .then(comment => {
                            res.status(201).json(comment)
                        })
                        .catch(err => {
                            res.status(500).json({error: "Database Error"})
                        })
                }
                
            } else {
                res.status(404).json({message: "The post with the specified ID does not exist"})
            }
        })
        .catch(err => {
            res.status(500).json({error: "Database Error"})
        })
})

module.exports = router
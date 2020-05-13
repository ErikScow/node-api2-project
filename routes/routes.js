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


db.findById(req.params.id)
    .then(post => {
        if(post.length === 0){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            if(!req.body.text) {
                res.status(400).json({ errorMessage: "Please provide text for the comment." })
            } else {
                req.body.post_id = req.params.id
                db.insertComment(req.body)
                    .then(comment => {
                        res.status(201).json(comment)
                    })
                    .catch(error => {
                        console.log('comment post database error: ', error)
                        res.status(500).json({ error: "There was an error while saving the comment to the database" })
                    })
            }
        } 
    })
    .catch(error => {
        console.log('comment post error could not find post error: ', error)
        res.status(500).json({ error: "Could not determine whether or not the post exists" })
    })



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

db.findById(req.params.id)
    .then(post => {
        if(post.length === 0){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            res.status(200).json(post)
        }
            
    })
    .catch(error => {
        console.log('get by id db error: ', error)
        res.status(500).json({ error: "The post information could not be retrieved." })
    })

})

router.get('/:id/comments', (req, res) => {
    db.findPostComments(req.params.id)
        .then(comment => {
            res.status(200).json(comment)
        })
        .catch(error => {
            console.log('get by comment id db error: ', error)
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
})

router.delete('/:id', (req, res) => {

    let postToDelete
    db.findById(req.params.id)
        .then(post => {
            postToDelete = post
        })
        .catch(error => {
            console.log('Unable to retrieve original post: ', error)
        })

    db.remove(req.params.id)
        .then(numDeleted => {
            if(postToDelete.length === 0){
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                res.status(200).json(postToDelete)
            }
        })
        .catch(error => {
            console.log('delete db error: ', error)
            res.status(500).json({ error: "The post could not be removed" })
        })

})

router.put('/:id', (req, res) => {

})

module.exports = router
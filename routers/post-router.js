const express = require('express')
const db = require('../data/db.js')

const router = express.Router()
router.use(express.json())

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
            if (post.length !== 0) {
                if (!req.body.text){
                    res.status(400).json({errorMessage: "Please provide text for the comment."})
                } else {
                    req.body.post_id = req.params.id
                    db.insertComment(req.body)
                        .then(comment => {
                            res.status(201).json(comment)
                        })
                        .catch(err => {
                            res.status(500).json({error: "Database Error could not insert"})
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

router.get('/', (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({error: "Database Error"})
        })
})

router.get('/:id', (req, res) => {
    db.findById(req.params.id)
        .then(post => {
            if (post.length !== 0){
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({error: "Database Error"})
        })
})

router.get('/:id/comments', (req, res) => {
    db.findById(req.params.id)
        .then(post => {
            if (post.length !== 0) {
                db.findPostComments(req.params.id)
                    .then(comments => {
                        res.status(200).json(comments)
                    })
                    .catch(err => {
                        res.status(500).json({error: "Database Error couldnt find comments"})
                    })
                
            } else {
                res.status(404).json({message: "The post with the specified ID does not exist"})
            }
        })
        .catch(err => {
            res.status(500).json({error: "Database Error"})
        })
})

router.delete('/:id', (req, res) => {
    db.findById(req.params.id)
        .then(post => {
            if (post.length !== 0) {
                db.remove(req.params.id)
                    .then(numDeleted => {
                        res.status(204).json(numDeleted)
                    })
                    .catch(err => {
                        res.status(500).json({error: "Database Error couldnt delete"})
                    })
            } else {
                res.status(404).json({message: "The post with the specified ID does not exist"})
            }
        })
        .catch(err => {
            res.status(500).json({error: "Database Error couldnt check database"})
        })
})

router.put('/:id', (req, res) => {
    db.findById(req.params.id)
        .then(post => {
            if (post.length !== 0) {
                if (!req.body.title || !req.body.contents) {
                    res.status(404).json({ errorMessage: "Please provide title and contents for the post."})
                } else {
                    db.update(req.params.id, req.body)
                        .then(numUpdated => {
                            db.findById(req.params.id)
                                .then(post => {
                                    res.status(200).json(post)
                                })
                                .catch(err => {
                                    res.status(500).json({ message: "couldnt get post after successful update."})
                                })
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
            res.status(500).json({error: "Database Error couldnt check database"})
        })
})

module.exports = router
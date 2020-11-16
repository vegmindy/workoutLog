const express = require('express');
const router = express.Router();
const {Log} = require('../models');
const validateSession = require('../middleware/validateSession');
const validateSessiion = require('../middleware/validateSession');

// router.get('/', (req, res) => res.send('Lets see if this is working?'));

router.get("/", (req, res) => {
    Log.findAll()
        .then(log => res.status(200).json(log))
        .catch(err => res.status(500).json({
            error: err
        }))
});

router.post('/', async (req, res) => {

    console.log("Logcontroller =>", req.user)
    try {
        const {description, definition, results} = req.body;

        let newLog = await Log.create({
            description, 
            definition, 
            results, 
            owner_id: req.user.id
        });
        res.status(200).json({
            log: newLog,
            message: "New log created!"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Log creation failed."
        })
    }
})

router.put('/:id', (req, res) => {
    Log.update(req.body, { where: { id: req.params.id}})
    .then(log => res.status(200).json(log))
    .catch(err => res.json(req.errors))
})

router.delete('/:id', (req, res) => {
    Log.destroy({
        where: { id: req.params.id}
    })
    .then(log => res.status(200).json(log))
    .catch(err => res.json({error: err}))
})

router.get('/:id', (req, res) => {
    Log.findAll({
        where: { id: req.params.id }
    })
    .then(log => res.status(200).json(log))
    .catch(err => res.json({error: err}))
})

module.exports = router;
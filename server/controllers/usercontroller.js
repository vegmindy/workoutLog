const router = require('express').Router();
const {User} = require('../models');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { UniqueConstraintError } = require('sequelize/lib/errors');

// SIGN UP SECTION
router.post('/register', async (req, res) => {
    let {username, password} = req.body;

    try {
        const newUser = await User.create({
            username,
            password: bcrypt.hashSync(password, 13)
        })
        res.status(201).json({
            message: "User registered!",
            user: newUser
        })
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use."
            })
        } else {
            res.status(500).json({
                error:"Failed to register user."
            })
        }
    }
})

// LOGIN SECTION

router.post('/login', async (req, res) => {
    let {username, password} = req.body;

    try {
        let loginUser = await User.findOne({
            where: { username }
        })
        
        if(loginUser && await bcrypt.compare(password, loginUser.password)) {
            const token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24})

            res.status(200).json({
                message: 'Login succeeded!',
                user: loginUser,
                token
            })
        } else {
            res.status(401).json({
                message: 'Login failed.'
            })
        }
    } catch (error) {
        res.status(500).json({
            error: 'Error logging in!'
        })
    }
})



module.exports = router;
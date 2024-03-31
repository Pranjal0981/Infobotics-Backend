const express = require('express')
const router = express.Router()
const { signup, signin, currentUser, userUpdate, deleteUser, signout,userSendMail,userforgetlink,userresetpassword } = require('../controllers/indexController')
const { isAuthenticated } = require('../middleware/auth')

router.post('/user', isAuthenticated, currentUser)

router.post('/signup', signup)

router.post('/signin', signin)

router.get('/signout', signout)

router.post('/update/:id', isAuthenticated, userUpdate)

router.post('/send-mail', userSendMail)

router.post('/forget-link/:id', userforgetlink)

router.post('/reset-password', isAuthenticated, userresetpassword)

router.post('/delete/:id', isAuthenticated, deleteUser)

module.exports = router
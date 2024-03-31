const express=require('express')
const router=express.Router()
const {postBlog, otherBlog,currentUserBlogs, deleteBlog,entertainment, sports, technology, breakingnews}=require('../controllers/blogController')
const { isAuthenticated } = require('../middleware/auth')

router.post('/post-blog',isAuthenticated,postBlog)

router.get('/other-blog',isAuthenticated, otherBlog)

router.get('/entertainment-blog',isAuthenticated, entertainment)

router.get('/sports-blog',isAuthenticated, sports)

router.get('/technology-blog',isAuthenticated, technology)

router.get('/breakingnews-blog',isAuthenticated, breakingnews)

router.post('/getcurrentuserblogs',isAuthenticated,currentUserBlogs)

router.delete('/deleteblog/:id',isAuthenticated,deleteBlog)
module.exports=router
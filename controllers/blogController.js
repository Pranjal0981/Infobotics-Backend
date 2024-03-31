const { catchAsyncErrors } = require('../middleware/catchAsyncErrors');
const Blog = require('../models/blogModel');
const ErrorHandler = require('../utils/ErrorHandler');
const imagekit = require('../utils/imagekit').initimagekit();

exports.postBlog = catchAsyncErrors(async (req, res, next) => {
    // Extracting data from the request body
    const { title, description, category,userId } = req.body;
    console.log(req.files);
    console.log(req.body)
    try {
        const { data, name } = req.files.image; // Accessing data and name properties

        const { fieldId, url } = await imagekit.upload({
            file: data, // Using the file data
            fileName: name, // Using the file name
        });

        console.log("File Data:", data);
        console.log("File Name:", name);

        // Create a new Blog object
        const newBlog = new Blog({
            title: title,
            description: description,
            category: category,
            blogImage: { fieldId, url },
            author: userId 

        });

        // Save the newBlog object
        await newBlog.save();

        res.status(201).json({
            success: true,
            message: 'Blog posted successfully',
            data: newBlog,
        });
    } catch (error) {
        next(error);
    }
});


exports.otherBlog = catchAsyncErrors(async (req, res, next) => {
    const otherBlogs = await Blog.find({ category: 'other' }).populate('author');
    console.log(otherBlogs)
    res.status(200).json({
      success: true,
      message: 'Other category blogs fetched successfully',
      data: otherBlogs,
    });
  });
  

  exports.entertainment = catchAsyncErrors(async (req, res, next) => {
    const entertainment = await Blog.find({ category: 'entertainment' }).populate('author');
    console.log(entertainment)
    res.status(200).json({
      success: true,
      message: 'Entertainment category blogs fetched successfully',
      data: entertainment,
    });
  });
  
  exports.sports = catchAsyncErrors(async (req, res, next) => {
    const sports = await Blog.find({ category: 'sports' }).populate('author');
    console.log(sports)
    res.status(200).json({
      success: true,
      message: 'Sports category blogs fetched successfully',
      data: sports,
    });
  });
  
  exports.technology = catchAsyncErrors(async (req, res, next) => {
    const technology = await Blog.find({ category: 'technology' }).populate('author');
    console.log(technology)
    res.status(200).json({
      success: true,
      message: 'Technology category blogs fetched successfully',
      data: technology,
    });
  });
  
  exports.breakingnews = catchAsyncErrors(async (req, res, next) => {
    const breakingnews = await Blog.find({ category: 'breaking-news' }).populate('author');
    console.log(breakingnews)
    res.status(200).json({
      success: true,
      message: 'Breaking-news category blogs fetched successfully',
      data: breakingnews,
    });
  });
  

  exports.currentUserBlogs = catchAsyncErrors(async (req, res, next) => {
    try {
        const { userId } = req.body;
        console.log(req.body)
        if (!userId) {
            throw new ErrorHandler('User ID is required', 400);
        }

        const userBlogs = await Blog.find({ author: userId }).populate('author');
        console.log(userBlogs);
        res.status(200).json({
            success: true,
            message: 'User blogs fetched successfully',
            data: userBlogs,
        });
    } catch (error) {
        next(error);
    }
});

exports.deleteBlog=catchAsyncErrors(async(req,res,next)=>{
    const {id}=req.params
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.status(200).json({ success: true, message: 'Blog deleted successfully', deletedBlog });
})
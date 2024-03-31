const { catchAsyncErrors } = require('../middleware/catchAsyncErrors')
const User = require('../models/userModel');
const ErrorHandler = require('../utils/ErrorHandler');
const { sendToken } = require('../utils/sendToken');
const path = require('path');
const {sendmail} =require('../utils/nodemailer')
const imagekit = require('../utils/imagekit').initimagekit()

exports.signup = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    console.log(req.body)
    const existingid = await User.findOne({ email });

    if (existingid) {
        return res.status(400).json({ error: 'Email already registered.' });
    }
    const user = await new User(req.body).save();
    sendToken(user, 201, res)
});

exports.signout = catchAsyncErrors(async (req, res, next) => {
    res.clearCookie("token")
    res.json({ message: "Successfully Signout" })
})

exports.currentUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.id).exec()
    res.json({ user })
})

exports.signin = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email }).select("+password").exec()
    if (!user)
        return next(new ErrorHandler("User not found with this email address", 404))
    const isPasswordMatched = await user.comparePassword(req.body.password)
    if (!isPasswordMatched)
        return next(new ErrorHandler("Wrong Credentials", 401))
    sendToken(user, 200, res)


})

exports.userSendMail = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email }).exec()
    if (!user) {
        return next(
            new ErrorHandler("User Not Found with this email address", 404)
        )
    }
    const url1 = `${req.protocol}://${req.get("host")}/user/forget-link/${user._id}`
    const url = `http://localhost:5173/user/forget-link/${user._id}`
    sendmail(req,url1, res, url, next)
    res.json({ user, url1 })
    user.resetPassword = "1"
    await user.save()
})
exports.userforgetlink = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id).exec();
    
    if (!user) {
        return next(new ErrorHandler("User Not Found with this email address", 404));
    }

    if (user.resetPassword === "1") {
        user.resetPassword = "0";
        user.password = req.body.password;
    } else {
        return next(new ErrorHandler("Link Expired", 404));
    }

    await user.save();

    res.status(200).json({ message: "Password Updated Successfully" });
});
exports.userforgetlink = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id).exec();
    
    if (!user) {
        return next(new ErrorHandler("User Not Found with this email address", 404));
    }

    if (user.resetPassword === "1") {
        user.resetPassword = "0";
        user.password = req.body.password;
    } else {
        return next(new ErrorHandler("Link Expired", 404));
    }

    await user.save();

    res.status(200).json({ message: "Password Updated Successfully" });
});


exports.userresetpassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.id).exec()
    user.password = req.body.password
    await user.save()
    res.status(200).json({ message: "Password Updated Successfully" })

})



exports.userUpdate = async (req, res, next) => {
    const userId = req.params.id;
    const update = req.body;

    try {
        // Upload image to ImageKit
        const imageUploadResponse = await imagekit.upload({
            file: req.files.avatar.data.toString("base64"),
            fileName: `${userId}.jpg`,
            useUniqueFileName: false
        });

        // Update the user object with the new data
        const user = {
            name: update.name,
            email: update.email,
            phone: update.phone,
            avatar: {
                fieldId: imageUploadResponse.fileId,
                url: imageUploadResponse.url
            }
        };

        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(userId, user, { new: true });

        if (!updatedUser) {
            throw new ErrorHandler("User not found", 404);
        }

        res.status(200).json({
            message: "User Updated Successfully",
            user: updatedUser
        });
    } catch (err) {
        next(err);
    }
};


exports.userSendmail = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email }).exec()
    if (!user) {
        return next(
            new ErrorHandler("User Not Found with this email address", 404)
        )
    }
    const url1 = `${req.protocol}://${req.get("host")}/forget-link/${user._id}`
    const url = `http://localhost:5173/forget-link/${user._id}`
    sendmail(req,url1, res, url, next)
    res.json({ user, url1 })
    user.resetPassword = "1"
    await user.save()
})
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const userId = req.params.id;
    
    try {
        // Delete the user from the database
        await User.deleteOne({ _id: userId });
        
        // Send a response indicating successful deletion
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        // Handle any errors that occur during deletion
        console.error(error);
        return next(new ErrorHandler('Error deleting user', 500));
    }
});
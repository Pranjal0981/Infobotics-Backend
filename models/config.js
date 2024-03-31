const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://pranjalshukla245:cdImBMeclOAfbR6X@cluster0.vtjn0jv.mongodb.net/Infobotics?retryWrites=true&w=majority')
.then(()=>{
    console.log("Db connected")

})
.catch((err)=>{
    console.log(err)
})
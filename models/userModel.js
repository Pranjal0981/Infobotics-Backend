
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const usermodel=new mongoose.Schema({
   
    name:{
        type:String,
        required:[true,"Firstname is required"],
       minlength:[4,"Firstname should be atleast 4 char long"]
    },
    phone:{
        type:String,
       maxlength:[10,"Contact should be not exceed 10 char"],
       minlength:[10,"Contact should be atleast 10 char long"]

    },
  
    email:{
        type:String,
        unique:true,
        required:[true,"Email is required"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password:{
        type:String,
        select:false,
        maxlength:[15,"Password should exceed more than 15 char"],
        minlength:[6,"Password should atleast 6 char"]

    },
    resetPassword:{
        type:String,
        default:"0"
    },
    avatar: {
        fieldId: String,
        url: String
    
}
   
},
    {timestamps:true}

)
usermodel.pre("save",function(){
    if(!this.isModified("password")){
        return;
    }
    let salt=bcrypt.genSaltSync(10);
    this.password=bcrypt.hashSync(this.password,salt)
})

usermodel.methods.comparePassword=function(password){
    return bcrypt.compareSync(password,this.password)
}

usermodel.methods.getjwttoken=function(){
return jwt.sign({id:this._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRE
})
}
const User=mongoose.model("User",usermodel)
module.exports=User
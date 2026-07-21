import { Schema, model } from "mongoose";

const repairSchema = new Schema({
  user_name: {
    type: String,
    trim: true,
    required: [true, "User Name is Required"],
    minLength: [2, "Invalid name"],
    maxLength: [32, "Invalid name"],
  },

  email: {
    type: String,
    trim: true,
    required: [true, "Email Id Is Required"],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid Email Id!`,
    },
    lowercase: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: [true, "Mobile Number is Required"],
    validate: {
      validator: function (v) {
        return /^(\+91[-\s]?)?0?(91)?[6-9]\d{9}$/.test(v);
      },
      message: (props) => `${props.value} is Not a Valid Mobile Number`,
    },
    unique: true,
  },
  product_type:{
    type: String,
    trim:true,
    required:[true,"Product Type is required"]    
  },
  describation:{
    type:String,
    trim:true
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed", "cancelled"],
    default: "pending",
  },
  
},{timestamps:true});

const repairModel = model("repair",repairSchema);
export default repairModel;
import { Schema,model } from "mongoose";

const contactFromSchema = new Schema({
    user_name: {
        type: String,
        trim: true,
        required: [true, "User Name is Required"],
        minLength: [2, "Invalid name"],
        maxLength: [32, "Invalid name"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email Id Is Required"],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: props => `${props.value} is not a valid Email Id!`
        },
        lowercase: true,
        unique: true
    },
    mobile: {
        type: String,
        required: [true, "Mobile Number is Required"],
        validate: {
            validator: function (v) {
                return /^(\+91[\-\s]?)?[0]?(91)?[6-9]\d{9}$/.test(v)
            },
            message: props => `${props.value} is Not a Valid Mobile Number`
        },
        unique: true
    },
    message:{
        type:String,
        required:[true,"Message is required"],
        minLength: [2, "Invalid name"],
        maxLength: [100, "Invalid name"]
    }
},{timestamps:true});

const contactFormModel = model("contactForm",contactFromSchema);
export default contactFormModel;
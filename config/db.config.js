import {connect} from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUri = process.env.MONGOURI || 'mongodb://localhost:27017/vijayradios';

export default async function dbConnect() {
    try{
        const client = await connect(mongoUri);
        if(client){
            console.log("Database Connected Successfully Vijay Radios");
        }
    }
    catch(error){
        console.log(error);
    }
    
}

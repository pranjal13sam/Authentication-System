//connetion to the database:
import mongoose from "mongoose";


const connectDB=async()=>{

    //whenever connected with the database geting msg in the console
    mongoose.connection.on('connected',()=>console.log('Database Connected!'))
    await mongoose.connect(`${process.env.MONGODB_URI}`)
}

export default connectDB
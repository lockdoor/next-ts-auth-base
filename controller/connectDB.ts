import mongoose from "mongoose";
const connectDB = async () => mongoose.connect(process.env.MONGO_URI as string)
export default connectDB
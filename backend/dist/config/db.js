import mongoose from "mongoose";
const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected`);
    }
    catch (err) {
        console.error(`failed to connect to database ${err}`);
    }
};
export default connectToDB;
//# sourceMappingURL=db.js.map
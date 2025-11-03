import mongoose from "mongoose";
const { Schema } = mongoose;

const cardModel = new Schema({
    cardID: String,
    email: String
})

export default mongoose.model('cards', cardModel);
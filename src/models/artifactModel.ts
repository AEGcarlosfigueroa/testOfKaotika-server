import mongoose from 'mongoose';
const { Schema } = mongoose;

const artifactModel = new Schema({
    artifactID: String,
    artifactName: String,
    isCollected: Boolean,
    latitude: Number,
    longitude: Number
})

export default mongoose.model('artifacts', artifactModel);
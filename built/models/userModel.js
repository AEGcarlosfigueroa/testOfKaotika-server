// Load Mongoose
import mongoose from "mongoose";
const { Schema } = mongoose;
// Basic attribute fields
const attributeField = {
    intelligence: Number,
    dexterity: Number,
    charisma: Number,
    constitution: Number,
    strength: Number,
    insanity: Number,
};
// Basic item fields
const itemFields = {
    name: String,
    description: String,
    type: String,
    image: String,
    value: Number,
    min_lvl: Number,
};
// Weapon Schema
const weaponsSchema = new Schema(Object.assign(Object.assign({ modifiers: attributeField }, itemFields), { base_percentage: Number, die_faces: Number, die_modifier: Number, die_num: Number, isUnique: Boolean, isActive: Boolean }));
// Artifact Schema
const artifactsSchema = new Schema(Object.assign({ modifiers: attributeField }, itemFields));
// Armor Schema
const armorsSchema = new Schema(Object.assign(Object.assign({ modifiers: attributeField }, itemFields), { defense: Number }));
// Potion Schemas
const healingPotSchema = new Schema(Object.assign({ modifiers: attributeField }, itemFields));
const recoveryEffectsSchema = new Schema({
    modifiers: attributeField,
    name: String,
    description: String,
    type: String,
    antidote_effects: [String],
    poison_effects: [String],
});
const antidoteSchema = new Schema(Object.assign(Object.assign({}, itemFields), { recover_effect: recoveryEffectsSchema }));
const enhancerPotSchema = new Schema(Object.assign(Object.assign({ modifiers: attributeField }, itemFields), { duration: Number }));
// Equipment pieces
const helmetSchema = new Schema(Object.assign(Object.assign({ modifiers: attributeField }, itemFields), { defense: Number }));
const shieldSchema = new Schema(Object.assign(Object.assign({ modifiers: attributeField }, itemFields), { defense: Number, isUnique: Boolean, isActive: Boolean }));
const bootSchema = new Schema(Object.assign(Object.assign({ modifiers: attributeField }, itemFields), { isUnique: Boolean, isActive: Boolean }));
const ringSchema = new Schema(Object.assign({ modifiers: attributeField }, itemFields));
// Equipment Schema (equipped items)
const equipmentSchema = new Schema({
    weapon: weaponsSchema,
    armor: armorsSchema,
    artifact: artifactsSchema,
    antidote_potion: antidoteSchema,
    healing_potion: healingPotSchema,
    enhancer_potion: enhancerPotSchema,
    helmet: helmetSchema,
    shield: shieldSchema,
    boot: bootSchema,
    ring: ringSchema,
});
// Inventory Schema (multiple items)
const inventorySchema = new Schema({
    helmets: [helmetSchema],
    weapons: [weaponsSchema],
    shields: [shieldSchema],
    artifacts: [artifactsSchema],
    boots: [bootSchema],
    rings: [ringSchema],
    antidote_potions: [antidoteSchema],
    healing_potions: [healingPotSchema],
    enhancer_potions: [enhancerPotSchema],
    ingredients: [String],
});
// Player Profile & Attributes
const playerAttributesSchema = new Schema({
    name: String,
    description: String,
    value: Number,
});
const playerProfileSchema = new Schema({
    name: String,
    description: String,
    image: String,
    attributes: [playerAttributesSchema],
    role: { type: String, enum: ["ISTVAN", "VILLANO", "MORTIMER", "ACOLITO"], default: "ACOLITO" }
});
// Tasks Schema
const tasksSchema = new Schema({
    classroom_Id: String,
    courseWorkName: String,
    grade: Number,
    selectedAssignment: String,
    maxPoints: Number,
});
// Skills Schema
const skillsSchema = new Schema({
    skill: String,
    activeLevels: [Number],
});
// Player Info Schema
const playerInfoSchema = new Schema({
    name: String,
    nickname: String,
    email: String,
    avatar: String,
    classroom_Id: String,
    level: Number,
    experience: Number,
    is_active: Boolean,
    socketId: String || null, //gets assigned automatically when it gets connected via socket, changes every time you get it
    isInside: Boolean, // determines whether the user is inside the laboratory or not.
    profile: playerProfileSchema,
    gold: Number,
    tasks: [tasksSchema],
    created_date: {
        type: Date,
        default: Date.now,
    },
    isBetrayer: Boolean,
    skills: [skillsSchema],
});
// Main Player Schema
const playerSchema = new Schema(Object.assign({ attributes: [attributeField], equipment: [equipmentSchema], inventory: [inventorySchema] }, playerInfoSchema.obj));
export default mongoose.model('players', playerSchema);

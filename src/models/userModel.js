// Load Mongoose
const mongoose = require('mongoose');
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
const weaponsSchema = new Schema({
  modifiers: attributeField,
  ...itemFields,
  base_percentage: Number,
  die_faces: Number,
  die_modifier: Number,
  die_num: Number,
  isUnique: Boolean,
  isActive: Boolean,
});

// Artifact Schema
const artifactsSchema = new Schema({
  modifiers: attributeField,
  ...itemFields,
});

// Armor Schema
const armorsSchema = new Schema({
  modifiers: attributeField,
  ...itemFields,
  defense: Number,
});

// Potion Schemas
const healingPotSchema = new Schema({
  modifiers: attributeField,
  ...itemFields,
});

const recoveryEffectsSchema = new Schema({
  modifiers: attributeField,
  name: String,
  description: String,
  type: String,
  antidote_effects: [String],
  poison_effects: [String],
});

const antidoteSchema = new Schema({
  ...itemFields,
  recover_effect: recoveryEffectsSchema,
});

const enhancerPotSchema = new Schema({
  modifiers: attributeField,
  ...itemFields,
  duration: Number,
});

// Equipment pieces
const helmetSchema = new Schema({
  modifiers: attributeField,
  ...itemFields,
  defense: Number,
});

const shieldSchema = new Schema({
  modifiers: attributeField,
  ...itemFields,
  defense: Number,
  isUnique: Boolean,
  isActive: Boolean,
});

const bootSchema = new Schema({
  modifiers: attributeField,
  ...itemFields,
  isUnique: Boolean,
  isActive: Boolean,
});

const ringSchema = new Schema({
  modifiers: attributeField,
  ...itemFields,
});

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
const playerSchema = new Schema({
  attributes: [attributeField],
  equipment: [equipmentSchema],
  inventory: [inventorySchema],
  ...playerInfoSchema.obj, // spread fields from playerInfoSchema
});

module.exports = mongoose.model('UserDatabase', playerSchema);

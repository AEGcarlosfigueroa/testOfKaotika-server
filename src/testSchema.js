require('dotenv').config();
const mongoose = require('mongoose');
const Player = require('./models/userModel'); 

async function testSchema() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    // Create a mock player
    const mockPlayer = new Player({
      attributes: [{
        intelligence: 10,
        dexterity: 5,
        charisma: 7,
        constitution: 8,
        strength: 6,
        insanity: 0,
      }],
      equipment: [],
      inventory: [],
      name: "Test Player",
      nickname: "Tester",
      email: "test@example.com",
      avatar: "avatar.png",
      level: 1,
      experience: 0,
      is_active: true,
      gold: 100,
      tasks: [],
      skills: [],
      profile: {
        name: "Test Profile",
        description: "Profile description",
        image: "profile.png",
        attributes: []
      }
    });

    // Save it
    mockPlayer.inventory.push({
  helmets: [{ name: "Iron Helmet", modifiers: { strength: 2 } }],
});
  console.log(mockPlayer.inventory[0].helmets)

    const savedPlayer = await mockPlayer.save();
    console.log("Player saved successfully:", savedPlayer);

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error testing schema:", err);
  }
}

testSchema();

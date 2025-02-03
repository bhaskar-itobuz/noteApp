import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import noteSchema from '../model/noteSchema.js';  // Adjust path to your noteSchema
import userSchema from '../model/userSchema.js';  // Adjust path to your userSchema

// Connect to MongoDB
mongoose.connect('mongodb+srv://bhaskar:1234@cluster0.vidhb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Function to generate fake note data associated with a random userId
const generateFakeNote = (userId) => {
  return {
    userId: userId,  // Associate the note with the random user's _id
    title: faker.lorem.sentence(),  // Generate a random title
    content: faker.lorem.paragraph(),  // Generate random content
    timestamps: faker.date.recent(),  // Set recent timestamps
  };
};

// Seed the notes database with fake data for a random user
export const seedNotesDatabase = async (req, res) => {
  try {
    // Clear existing notes in the database
    await noteSchema.deleteMany();

    // Fetch all users from the userSchema
    const users = await userSchema.find({});
    
    if (users.length === 0) {
      return res.status(400).send('No users found. Please create users first.');
    }

    // Randomly select one user from the list of users
    const randomUser = users[Math.floor(Math.random() * users.length)];  // Get a random user

    // Generate and insert fake notes for the selected user
    const fakeNotes = [];
    for (let i = 0; i < 10; i++) {
      const fakeNote = generateFakeNote(randomUser._id);  // Use the random user's _id
      fakeNotes.push(fakeNote);
    }

    // Insert the fake notes into the database
    await noteSchema.insertMany(fakeNotes);
    res.send(fakeNotes);  // Send the generated notes in the response
    console.log('Seed data inserted!');
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).send('Error seeding notes database');  // Handle any error during seeding
  }
};

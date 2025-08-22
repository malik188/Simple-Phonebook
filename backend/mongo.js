const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.3fasfhp.mongodb.net/contactApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

/*
const person = new Person({
  id: Math.floor(Math.random() * 10000).toString(),
  name: process.argv[3],
  number: process.argv[4],
});

person.save().then((result) => {
  console.log("added", result.name, "number", result.number, "to phonebook");
  mongoose.connection.close();
});
*/

Person.find({}).then((result) => {
  console.log("phonebook:");
  if (result.length === 0) {
    console.log("No entries found.");
    mongoose.connection.close();
    return;
  }
  result.forEach((person) => {
    console.log(person.name, person.number);
  });
  mongoose.connection.close();
});

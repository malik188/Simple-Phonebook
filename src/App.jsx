import { useEffect, useState } from "react";
import Person from "./components/Person";
import axios from "axios";
import personService from "./service/persons";

const Filter = ({ filter, onChange }) => {
  // Renders the filter input field for searching people
  return (
    <div>
      filter shown with <input value={filter} onChange={onChange} />
    </div>
  );
};

const PersonForm = ({
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
  onSubmit,
}) => {
  // Renders the form for adding a new contact (name and number)
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const App = () => {
  // Main application component, manages state and logic
  const [persons, setPersons] = useState([]); // Stores the list of people
  const [newName, setNewName] = useState(""); // Stores the value of the name input
  const [newNumber, setNewNumber] = useState(""); // Stores the value of the number input
  const [filter, setFilter] = useState(""); // Stores the value of the filter input

  useEffect(() => {
    // Fetches initial data from the JSON server when the component mounts
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  const addContact = (event) => {
    // Handles form submission to add a new contact
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);

    existingPerson
      ? personService
          .update(existingPerson.id, { ...existingPerson, number: newNumber })
          .then((updatedPerson) => {
            if (
              window.confirm(
                `Replace the old number for ${existingPerson.name}?`
              )
            ) {
              setPersons(
                persons.map((person) =>
                  person.id !== existingPerson.id ? person : updatedPerson
                )
              );
              setNewName("");
              setNewNumber("");
            } else {
              alert("Update cancelled.");
            }
          })
          .catch((error) => {
            alert(`Failed to update ${newName}'s number.`);
          })
      : personService
          .create({ name: newName, number: newNumber })
          .then((returnedPerson) => {
            setPersons(persons.concat(returnedPerson));
            setNewName("");
            setNewNumber("");
          });
  };

  const deleteContact = (id) => {
    // Handles deletion of a contact
    personService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      })
      .catch((error) => {
        alert(`Information of the person has already been removed from server`);
        setPersons(persons.filter((person) => person.id !== id));
      });
  };

  const handleNumberChange = (event) => {
    // Handles changes in the number input field
    setNewNumber(event.target.value);
  };

  const handleNameChange = (event) => {
    // Handles changes in the name input field
    setNewName(event.target.value);
  };

  const handleFilterChange = (event) => {
    // Handles changes in the filter input field
    setFilter(event.target.value);
  };

  // Filter persons case-insensitively based on the filter input
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={handleFilterChange} />
      <h2>Add a New Contact</h2>
      <PersonForm
        onSubmit={addContact}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map((person) => (
          <Person
            key={person.id}
            person={person}
            deleteContact={() => deleteContact(person.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;

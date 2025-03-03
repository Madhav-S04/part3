import { useState, useEffect } from 'react';
import personService from './Services';
import Filter from './Filter';
import PersonForm from './PersonForm';
import Persons from './Persons';
import Notification from './Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null); // ✅ Notification state

  // Fetch initial contacts from backend
  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  // ✅ Function to add a person with validation handling
  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson) {
      if (window.confirm(`${newName} is already in the phonebook, replace the old number?`)) {
        personService
          .update(existingPerson.id, { name: newName, number: newNumber })
          .then(updatedPerson => {
            setPersons(persons.map(p => (p.id !== existingPerson.id ? p : updatedPerson)));
            setNotification({ message: `Updated ${updatedPerson.name}`, type: 'success' });
          })
          .catch(error => {
            setNotification({ message: error.response?.data?.error || 'Error updating contact', type: 'error' });
          })
          .finally(() => {
            setTimeout(() => setNotification(null), 5000);
          });
      }
      return;
    }

    const newPerson = { name: newName, number: newNumber };

    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons([...persons, returnedPerson]);
        setNewName('');
        setNewNumber('');
        setNotification({ message: `Added ${returnedPerson.name}`, type: 'success' });
      })
      .catch(error => {
        setNotification({ message: error.response?.data?.error || 'Failed to add contact', type: 'error' });
      })
      .finally(() => {
        setTimeout(() => setNotification(null), 5000);
      });
  };

  // ✅ Function to delete a contact
  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setNotification({ message: `Deleted ${name}`, type: 'success' });
        })
        .catch(error => {
          setNotification({ message: `Error: ${name} was already removed from the server`, type: 'error' });
          setPersons(persons.filter(person => person.id !== id)); // Remove from UI
        })
        .finally(() => {
          setTimeout(() => setNotification(null), 5000);
        });
    }
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification notification={notification} /> {/* ✅ Display messages */}

      <Filter searchTerm={searchTerm} onSearchChange={handleSearchChange} />

      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={(e) => setNewName(e.target.value)}
        onNumberChange={(e) => setNewNumber(e.target.value)}
        onSubmit={addPerson}
      />

      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} onDelete={deletePerson} />
    </div>
  );
};

export default App;

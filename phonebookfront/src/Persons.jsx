const Persons = ({ filteredPersons, onDelete }) => {
    return (
      <ul>
        {filteredPersons.map(person => (
          <li key={person.id}>
            {person.name} {person.number} 
            <button onClick={() => onDelete(person.id, person.name)}>Delete</button>
          </li>
        ))}
      </ul>
    );
  };
  
  export default Persons;
  
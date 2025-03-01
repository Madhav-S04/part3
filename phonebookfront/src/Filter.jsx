const Filter = ({ searchTerm, onSearchChange }) => {
    return (
      <div>
        search: <input value={searchTerm} onChange={onSearchChange} />
      </div>
    );
  };
  
  export default Filter;
  
const Person = ({ person, deleteContact }) => {
  return (
    <li>
      {person.name} {person.number}
      <span> </span>
      <button
        onClick={() => {
          if (window.confirm(`Delete ${person.name}?`)) {
            deleteContact();
          }
        }}
      >
        Delete
      </button>
    </li>
  );
};

export default Person;

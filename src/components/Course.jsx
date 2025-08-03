/* eslint-disable no-unused-vars */
const Course = ({ course }) => {
  return (
    <div>
      {course.map((c) => (
        <div key={c.id}>
          <h2>{c.name}</h2>
          <ul>
            {c.parts.map((part) => (
              <li key={part.id}>
                {part.name} — {part.exercises} exercises
              </li>
            ))}
          </ul>
          <strong>
            Total of {c.parts.reduce((sum, part) => sum + part.exercises, 0)}{" "}
            exercises
          </strong>
        </div>
      ))}
    </div>
  );
};

export default Course;

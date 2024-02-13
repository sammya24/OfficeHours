import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';

const ClassDetails = () => {
  const { classId } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchClassDetailsAndStudents = async () => {
      const classRef = doc(db, 'classes', classId);
      const classSnapshot = await getDoc(classRef);

      if (classSnapshot.exists()) {
        setClassDetails(classSnapshot.data());
        setStudents(classSnapshot.data().students);
      }
    };

    fetchClassDetailsAndStudents();
  }, [classId]);

  // Function to promote a student to a TA
  const promoteToTA = async (studentId) => {
    const classRef = doc(db, 'classes', classId);
    const classSnapshot = await getDoc(classRef);

    if (classSnapshot.exists()) {
      const studentList = classSnapshot.data().students;
      const taList = classSnapshot.data().TAs;

      // Check if the student is not already a TA
      if (studentList.includes(studentId) && !taList.includes(studentId)) {
        // Remove the student from the 'students' array and add to 'TAs'
        await updateDoc(classRef, {
          students: arrayRemove(studentId),
          TAs: arrayUnion(studentId)
        });

        // Update the local state
        setStudents(studentList.filter(id => id !== studentId));
        setClassDetails({ ...classDetails, TAs: [...taList, studentId] });
      }
    }
  };

  return (
    <div>
      {classDetails && (
        <>
          <h1>{classDetails.className}</h1>
          <p>{classDetails.classDescription}</p>
          
          <h2>Students</h2>
          <ul>
            {students.map(studentId => (
              <li key={studentId}>
                Student ID: {studentId}{' '}
                {/* Button to promote student to TA */}
                <button onClick={() => promoteToTA(studentId)}>Promote to TA</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ClassDetails;

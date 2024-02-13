import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';

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

  return (
    <div>
      {classDetails && (
        <>
          <h1>{classDetails.className}</h1>
          <p>{classDetails.classDescription}</p>
          
          <h2>Students</h2>
          <ul>
            {students.map(studentId => (
              <li key={studentId}>Student ID: {studentId}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ClassDetails;

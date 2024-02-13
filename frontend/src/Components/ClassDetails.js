import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const ClassDetails = () => {
  const { classId } = useParams();
  const [classDetails, setClassDetails] = useState(null);

  useEffect(() => {
    const fetchClassDetails = async () => {
      const classRef = doc(db, 'classes', classId);
      const classSnapshot = await getDoc(classRef);

      if (classSnapshot.exists()) {
        setClassDetails(classSnapshot.data());
      }
    };

    fetchClassDetails();
  }, [classId]);

  return (
    <div>
      {classDetails && (
        <>
          <h1>{classDetails.className}</h1>
          <p>{classDetails.classDescription}</p>
          {/* Render other class details here */}
        </>
      )}
    </div>
  );
};

export default ClassDetails;

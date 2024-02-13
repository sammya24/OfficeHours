import { auth, db } from "../firebase";
import { useEffect, useState } from 'react';
import { collection, addDoc, doc, updateDoc, arrayUnion, query, where, getDocs, getDoc} from 'firebase/firestore';

const Dashboard = () => {
    const [userEmail, setUserEmail] = useState(null);
    const [className, setClassName] = useState('');
    const [classDescription, setClassDescription] = useState('');
    const [classCode, setClassCode] = useState('');
    const [instructorId, setInstructorId] = useState('');
    const [joinClassCode, setJoinClassCode] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [userClasses, setUserClasses] = useState([]); 

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (auth.currentUser) {
                const userRef = doc(db, 'users', auth.currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setInstructorId(auth.currentUser.uid);
                    setUserEmail(auth.currentUser.email);
                    setUserRole(userData.role);

                    // Fetch user's classes when the component mounts
                    const q = query(collection(db, 'classes'), where("instructor", "==", auth.currentUser.uid));
                    const instructorClasses = await getDocs(q);

                    const q2 = query(collection(db, 'classes'), where("students", "array-contains", auth.currentUser.uid));
                    const studentClasses = await getDocs(q2);

                    const classes = [];
                    instructorClasses.forEach((classDoc) => {
                        classes.push({ id: classDoc.id, ...classDoc.data() });
                    });
                    studentClasses.forEach((classDoc) => {
                        classes.push({ id: classDoc.id, ...classDoc.data() });
                    });
                    setUserClasses(classes);
                }
            }
        };

        fetchUserDetails();
    }, []);


    const handleCreateClassSubmit = async (e) => {
        e.preventDefault();

        // Check if the user has the 'instructor' role before proceeding
    if (userRole !== 'instructor') {
        alert('Only instructors can create classes.');
        return;
    }

        try {
            const classesCollection = collection(db, 'classes');
            await addDoc(classesCollection, {
                className: className,
                classDescription: classDescription,
                createdBy: userEmail,
                classCode: classCode,
                instructor: instructorId,
                students: [],
                TAs: []
            });

            // Reset input fields after successful submission
            setClassName('');
            setClassDescription('');
            setClassCode('');
            alert('Class created successfully!');
        } catch (error) {
            console.error('Error creating class:', error);
            alert('Failed to create class. Please try again.');
        }
    };

    const handleJoinClassSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // Query the classes collection to find the document with the matching class code
            const q = query(collection(db, 'classes'), where("classCode", "==", joinClassCode));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (classDoc) => {
                    const classData = classDoc.data();
    
                    // Update user document with the class joined
                    const userRef = doc(db, 'users', auth.currentUser.uid);
                    await updateDoc(userRef, {
                        classes: arrayUnion(classDoc.id)
                    });
    
                    // Update class document with the student joined
                    await updateDoc(classDoc.ref, {
                        students: arrayUnion(auth.currentUser.uid)
                    });
    
                    alert('You have successfully joined the class!');
                });
            } else {
                alert('Class not found. Please check the code and try again.');
            }
    
            setJoinClassCode('');
        } catch (error) {
            console.error('Error joining class:', error);
            alert('Failed to join class. Please try again.');
        }
    };
    

    return (
        <>
        <div>
            <h1>Welcome to the Dashboard, {userEmail || 'Guest'}!</h1>
            <form onSubmit={handleCreateClassSubmit}>
                <input type="text" placeholder="Class Name" value={className} onChange={(e) => setClassName(e.target.value)} />
                <input type="text" placeholder="Class Description" value={classDescription} onChange={(e) => setClassDescription(e.target.value)} />
                <input type="text" placeholder="Class Code" value={classCode} onChange={(e) => setClassCode(e.target.value)} />
                <button type="submit">Create Class</button>
            </form>
            <form onSubmit={handleJoinClassSubmit}>
                <input type="text" placeholder="Enter Class Code to Join" value={joinClassCode} onChange={(e) => setJoinClassCode(e.target.value)} />
                <button type="submit">Join Class</button>
            </form>
        </div>
         {/* Display user's classes */}
         <div>
                <h2>Your Classes</h2>
                <ul>
                    {userClasses.map((userClass) => (
                        <li key={userClass.id}>
                            <strong>Class Name:</strong> {userClass.className}, 
                            <strong> Class Description:</strong> {userClass.classDescription}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Dashboard;

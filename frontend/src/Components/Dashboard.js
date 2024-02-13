import { auth, db } from "../firebase";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, updateDoc, arrayUnion, query, where, getDocs, getDoc} from 'firebase/firestore'; // Importing doc function

const Dashboard = () => {
    const [userEmail, setUserEmail] = useState(null);
    const [className, setClassName] = useState('');
    const [classDescription, setClassDescription] = useState('');
    const [classCode, setClassCode] = useState('');
    const [instructorId, setInstructorId] = useState('');
    const [joinClassCode, setJoinClassCode] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [userStatus, setUserStatus] = useState(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch the currently logged-in user's ID and role
        const fetchUserDetails = async () => {
            if (auth.currentUser) {
                const userRef = doc(db, 'users', auth.currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setInstructorId(auth.currentUser.uid);
                    setUserEmail(auth.currentUser.email);
                    setUserRole(userData.role); // Assuming 'role' is the field name for user roles
                    setUserStatus(userData.status);
                }
            }
        };
        setIsLoading(false);
        // Call fetchUserDetails when the component mounts
        fetchUserDetails();
    }, []);

    const handleCreateClassSubmit = async (e) => {
        e.preventDefault();

        // Check if the user has the 'instructor' role before proceeding
    if (userRole !== 'instructor' || userStatus !== 'approved') {
        alert('Only approved instructors can create classes.');
        return;
    }

        try {
            // Add logic to create a new class in your database
            const classesCollection = collection(db, 'classes');
            await addDoc(classesCollection, {
                className: className,
                classDescription: classDescription,
                createdBy: userEmail,
                classCode: classCode, // Use the user-defined class code
                instructor: instructorId, // Add the user as an instructor
                students: [], // Initialize an empty array for students
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
    
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <div>
            <h1>Welcome to the Dashboard, {userEmail || 'Guest'}!</h1>
            {userRole === 'instructor' && userStatus === 'approved' && (
            <form onSubmit={handleCreateClassSubmit}>
                <input type="text" placeholder="Class Name" value={className} onChange={(e) => setClassName(e.target.value)} />
                <input type="text" placeholder="Class Description" value={classDescription} onChange={(e) => setClassDescription(e.target.value)} />
                <input type="text" placeholder="Class Code" value={classCode} onChange={(e) => setClassCode(e.target.value)} />
                <button type="submit">Create Class</button>
            </form>
            )}
            <form onSubmit={handleJoinClassSubmit}>
                <input type="text" placeholder="Enter Class Code to Join" value={joinClassCode} onChange={(e) => setJoinClassCode(e.target.value)} />
                <button type="submit">Join Class</button>
            </form>
        </div>
        </>
    );
};

export default Dashboard;

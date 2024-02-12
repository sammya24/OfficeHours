import { auth, db } from "../firebase";
import { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';

const Dashboard = () => {
    const [userEmail, setUserEmail] = useState(null);
    const [className, setClassName] = useState('');
    const [classDescription, setClassDescription] = useState('');
    const [classCode, setClassCode] = useState('');
    const [instructorId, setInstructorId] = useState('');

    useEffect(() => {
        // Fetch the currently logged-in user's ID
        const fetchUserId = () => {
            if (auth.currentUser) {
                setInstructorId(auth.currentUser.uid);
                setUserEmail(auth.currentUser.email);
            }
        };

        // Call fetchUserId when the component mounts
        fetchUserId();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            // Add logic to create a new class in your database
            const classesCollection = collection(db, 'classes');
            await addDoc(classesCollection, {
                className: className,
                classDescription: classDescription,
                createdBy: userEmail,
                classCode: classCode, // Use the user-defined class code
                instructors: [instructorId] // Add the user as an instructor
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

    return (
        <>
        <div>
            <h1>Welcome to the Dashboard, {userEmail || 'Guest'}!</h1>
            <form onSubmit={handleFormSubmit}>
                <input type="text" placeholder="Class Name" value={className} onChange={(e) => setClassName(e.target.value)} />
                <input type="text" placeholder="Class Description" value={classDescription} onChange={(e) => setClassDescription(e.target.value)} />
                <input type="text" placeholder="Class Code" value={classCode} onChange={(e) => setClassCode(e.target.value)} />
                <button type="submit">Create Class</button>
            </form>
        </div>
        </>
    );
};

export default Dashboard;

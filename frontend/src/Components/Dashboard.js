import { auth } from "../firebase";
import { useEffect, useState } from 'react';

const Dashboard = () => {
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        // Fetch the currently logged-in user's display name
        const fetchUserEmail = () => {
            if (auth.currentUser) {
                setUserEmail(auth.currentUser.email);
            }
        };

        // Call fetchUserName when the component mounts
        fetchUserEmail();
    }, []);

    return (
        <div>
            <h1>Welcome to the Dashboard, {userEmail || 'Guest'}!</h1>
        </div>
    );
};

export default Dashboard;

import React from 'react';
import './Home.css';

// bypass this page automatically if signed in already

const Home = () => {
    return (
        <div class="home-container">
            <h1>Welcome to Online Office Hours!</h1>
            <p class="description">
                Our platform provides a seamless solution for organizing and attending office hours
                with instructors and TAs. Say goodbye to scattered Zoom links and hello to a centralized
                hub for academic support.
            </p>
            <h2>Key Features</h2>
            <ul>
                <li>Create customizable pages for instructors and TAs</li>
                <li>Join video calls, text chats, or utilize whiteboard elements</li>
                <li>Find the perfect instructor for your learning style</li>
                <li>Enroll in classes and keep track of upcoming office hours sessions</li>
            </ul>
            <h2>How It Works</h2>
            <p class="description">
                Students and instructors can sign up for an account and start creating or joining
                office hours sessions. Instructors can customize their virtual classrooms, while
                students can easily find and join sessions that match their needs.
            </p>
            <h2>Get Started</h2>
            <p class="description">
                Ready to enhance your learning experience? <a href="/login" class="login-link">Log in</a> now or sign up to get started!
            {/* add link to signup */}
            </p>

        </div>
    );
};

export default Home;

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../firebase";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from "firebase/firestore";

const Login = () => {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("")
    const handleForgotPassword = () => {
        console.log("resetting password...")
        sendPasswordResetEmail(auth, email).then(()=>{
            alert("An email to reset your password has been sent!")
        }).catch((e)=>{
            if(e.code === "auth/invalid-email") {
                alert("Please enter a valid email and then click \"forgot password?\"")
            }
        })
    }
    const navigate = useNavigate(); // Initialize useNavigate hook

    const performLogin = (e) => {
        e.preventDefault();
        if(!e.target.email.value) {
            alert("Please enter an email!")
            return;
        }
        if(!e.target.password) {
            alert("Please enter a password!")
            return;
        }
        const email = e.target.email.value;
        const pass = e.target.password.value;


        signInWithEmailAndPassword(auth, email, pass)
            .then((credentials) => {
                console.log("Success!");
                setUser(credentials.user);
                navigate('/dashboard'); // Navigate to the dashboard route
            })
            .catch((error) => {
                if (error.code === "auth/invalid-credential") {
                    console.log("User with that email was not found, creating new account with these credentials.");
                    createUserWithEmailAndPassword(auth, email, pass)
                        .then(async (credentials) => {
                            console.log("Successfully created new account");
                            setUser(credentials.user);
                            navigate('/dashboard'); // Navigate to the dashboard route
                            console.log("Attempting to create document...");
                            // Add user data to Firestore upon successful account creation
                            await setDoc(doc(db, "users", credentials.user.uid), {
                                email: credentials.user.email,
                                // Add more user data if needed
                            })
                            .then(() => {
                                console.log("Firestore document created successfully");
                            })
                            .catch((error) => {
                                console.error("Error creating Firestore document:", error);
                            });
                        })
                        .catch((error) => {
                            console.error(error.code);
                        });
                } else if (error.code === "auth/invalid-email") {
                    console.log("Invalid Email");
                }
            });
    };

    return (
        <>
          <form onSubmit={performLogin}>
            <input type="text" name="email" onChange={(e)=>{
                 setEmail(e.target.value)
            }}/>
            <input type="password" name="current_password"/>
            <input type="submit" value="login"/>
            <input type="button" value="forgot password?" onClick={handleForgotPassword} />
        </form>
        </>
    );
};

export default Login;

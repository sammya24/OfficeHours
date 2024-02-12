import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useState, setState } from "react";

const performLogin = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const pass = e.target.current_password.value
    signInWithEmailAndPassword(auth, email, pass).then((credentials)=>{
        alert("Success!")
        setUser(credentials.user)
    }).catch((error)=>{
        if(error.code === "auth/invalid-credential") {
            console.log("User with that email was not found, creating new account with these credentials.")
            createUserWithEmailAndPassword(auth, email, pass).then((credentials)=>{
                alert("New account created!")
                console.log("Successfully created new account")
                setUser(credentials.user)
            }).catch((error) => {
                console.error(error.code)
            })
        }
        else if (error.code === "auth/invalid-email") {
            console.log("Invalid Email")
        }
    })
}



var user;
const setUser = (u) => {
    user = u;
    console.log(user)
}
const Login = () => {
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
    return (<>
        <form onSubmit={performLogin}>
            <input type="text" name="email" onChange={(e)=>{
                 setEmail(e.target.value)
            }}/>
            <input type="password" name="current_password"/>
            <input type="submit" value="login"/>
            <input type="button" value="forgot password?" onClick={handleForgotPassword} />
        </form>
    </>)
}

export default Login;
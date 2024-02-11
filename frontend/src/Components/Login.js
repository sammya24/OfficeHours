import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const performLogin = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const pass = e.target.password.value
    signInWithEmailAndPassword(auth, email, pass).then((credentials)=>{
        console.log("Success!")
        setUser(credentials.user)
    }).catch((error)=>{
        if(error.code == "auth/invalid-credential") {
            console.log("User with that email was not found, creating new account with these credentials.")
            createUserWithEmailAndPassword(auth, email, pass).then((credentials)=>{
                console.log("Successfully created new account")
                setUser(credentials.user)
            }).catch((error) => {
                console.error(error.code)
            })
        }
        else if (error.code == "auth/invalid-email") {
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
    return (<>
        <form onSubmit={performLogin}>
            <input type="text" name="email"/>
            <input type="text" name="password"/>
            <input type="submit" />
        </form>
    </>)
}

export default Login;
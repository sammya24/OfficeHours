import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const performLogin = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const pass = e.target.password.value
    signInWithEmailAndPassword(auth, email, pass).then((credentials)=>{
        console.log("Success!")
    }).catch((error)=>{
        console.log(error.message)
        if(error.code == "auth/invalid-email") {
            createUserWithEmailAndPassword(auth, email, pass).then(()=>{
                console.log("Successfully created new account")
            }).catch((error) => {
                console.error(error.code)
            })
        }
        else if (error.code == "auth/invalid-credential") {
            console.log("Incorrect Password")
        }
    })
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
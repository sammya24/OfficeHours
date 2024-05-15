import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {getUser, getCurrentUser} from "../UserUtils"


const Login = () => {
    const navigate = useNavigate();
    const [checkingAuth, setCheckingAuth] = useState(true);
    const currentToken = localStorage.getItem("token")

    useEffect(() => {
        if(currentToken) {
            getCurrentUser().then(user => {
                setCheckingAuth(false);
                if (user) {
                    navigate('/dashboard');
                }
            });
        }
        setCheckingAuth(false)
    }, [navigate, currentToken]);

    const performLogin = (e) => {
        e.preventDefault();
        if (!e.target.email.value) {
            alert("Please enter an email!");
            return;
        }
        if (!e.target.current_password.value) {
            alert("Please enter a password!");
            return;
        }
        const email = e.target.email.value;
        const pass = e.target.current_password.value;
        getUser(email, pass).then(userResult => {
            if(userResult.error) {
                console.log("something went wrong", userResult.error)
                alert("Please check your email");
            }
            navigate("/dashboard")
        }).catch(e => console.log(e))
    };

    const handleForgotPassword = () => {
        navigate("/forgotPassword")
    };

    if (checkingAuth) {
        return <div>Loading...</div>;
    }

    return (
        <div className="font-mono bg-indigo-50 h-dvh">
            <header className="bg-indigo-50 p-0 py-5">
                <div className="container flex justify-center items-center max-w-full">
                    <Link to="/home">
                        <div className="flex items-center">
                            <img src="/logo.png" alt="Logo" className="h-12 w-auto mr-2" />
                            <h1 className="text-3xl font-bold text-gray-900 font-mono">ONLINE OFFICE HOURS</h1>
                        </div>
                    </Link>
                </div>
            </header>
            <div className="border-0.5 border-gray-800 border-solid relative" >
               

               </div>
            <h1 className="pt-10 text-2xl text-center font-bold text-indigo-900 font-mono">Welcome! Sign In</h1>
            <div className="flex justify-center p-10 pb-4">
                <form onSubmit={performLogin} className="shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg bg-indigo-300">
                    <div className="mb-4">
                        <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="bg-gray-50 hover:bg-gray-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="text"
                            name="email"
                            placeholder="Email"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="bg-gray-50 hover:bg-gray-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                            id="current_password"
                            type="password"
                            name="current_password"
                            placeholder="Password"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <input
                            className="bg-indigo-500 hover:bg-indigo-700 text-gray-50 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                            value="Sign in"
                        />
                        <input
                            className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-800"
                            type="button"
                            value="Forgot Password?"
                            onClick={handleForgotPassword}
                        />
                    </div>
                </form>
            </div>
            <div className="text-gray-800 flex sm:flex-row flex-col justify-center text-center">
            Don't have an account? <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-800 ml-2 mr-2">Sign up</Link>
            </div>
           
        </div>
    );
};

export default Login;

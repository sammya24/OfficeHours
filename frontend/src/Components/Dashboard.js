import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { Link } from "react-router-dom";
import { getCurrentUser, getEnrolledCourses, logout,getPendingInstructors, approveInstructor  } from "../UserUtils"
import { createClass, joinClass } from "../ClassUtils"
import Header from "./Header";

const Dashboard = () => {
  const [className, setClassName] = useState("");
  const [classDescription, setClassDescription] = useState("");
  const [classCode, setClassCode] = useState("");
  const [joinClassCode, setJoinClassCode] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userClasses, setUserClasses] = useState([]);
  const [user, setUser] = useState(null)
  const currentToken = localStorage.getItem("token")
  const [pendingInstructors, setPendingInstructors] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);

  console.log(userClasses)
  useEffect(() => {
    if (!user) {
      const currentUser = getCurrentUser()
      console.log(currentUser)
      if (!currentToken) {
        navigate("/login")
      }
      if (currentUser.error) {
        return;
      }
      currentUser.then(userObject => {
        console.log(userObject)
        if (userObject.status) { // if there was an error in the backend
          if (userObject.status === 401) {
            logout().then(res => {
              if (res === true) {
                navigate("/login")
              }
              else {
                alert("something has gone wrong. pls close and try again")
                return;
              }
            })
          }
        }
        if (userObject.data && userObject.data.user) {
          const currentUser = userObject.data.user



          setUser(currentUser)
          // get user's classes
          getEnrolledCourses(currentUser._id).then(courses => {
            setUserClasses(courses)
            setIsLoading(false)
          })
        }
        else if (userObject.message) {
          console.log(userObject)
        }
      }).catch(e => console.log(e))
    }
  }, [navigate, currentToken, user])


  const handleCreateClassSubmit = (e) => {
    e.preventDefault();

    // Check if the user has the 'instructor' role before proceeding
    if (user.role !== "instructor") {
      alert("Only instructors can create classes.");
      return;
    }
    console.log(user)

    createClass(className, classDescription, classCode, user.email, user._id).then((result) => {
      console.log(result)
      joinClass(classCode, user._id, "instructor").then(value => {
        console.log(value)
        if (value === true) {
          console.log("success")
          window.location.reload()
        }
      }).catch(e => {
        return { error: e }
      })
    }).catch(e => console.log(e))

    // Reset input fields after successful submission
    setClassName("");
    setClassDescription("");
    setClassCode("");
    // window.location.reload(); // force automatic reload

  };

  const handleJoinClassSubmit = (e) => {
    e.preventDefault();
    const isAlreadyEnrolled = ["TA", "instructor", "student"].some(role =>
      userClasses[role].some(classInfo => classInfo.classCode === joinClassCode)
    );

    if (isAlreadyEnrolled) {
      alert("You are already enrolled in this class.");
      setJoinClassCode("");
      return;
    }

    joinClass(joinClassCode, user._id, "student").then((result) => {
      if (result === true) {
        window.location.reload();
      } else {
        alert("Class not found. Please check the code and try again.");
      }
      setJoinClassCode("");
    }).catch(error => {
      console.error("Error joining class:", error);
      alert("Failed to join class. Please try again.");
    });
  };

  useEffect(() => {
    if (user && user.org && user.role === "admin") {
      console.log(user.org)
      getPendingInstructors(user.org).then(instructors => {
        setPendingInstructors(instructors || []);
        console.log("instructors")
        console.log(instructors);
        setIsLoading(false);
      }).catch(error => {
        console.error('Failed to fetch instructors:', error);
        setIsLoading(false);
      });
    } else {
      console.log("User or user's organization is not available.");
      setIsLoading(false); 
    }
  }, [user]);


  const handleSelectInstructor = (userId) => {
    setSelectedInstructors(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };
  console.log("selectedInstructors")

  console.log(selectedInstructors)

  const handleApproveSelected = () => {
  if (window.confirm("Are you sure you want to approve the selected instructors?")) {
    console.log("selectedInstructors")
    console.log(selectedInstructors)

    Promise.all(selectedInstructors.map(userId => approveInstructor(userId)))
      .then(results => {
        console.log('All selected instructors approved:', results);
        window.location.reload();
      }).catch(error => {
        console.error('Error approving instructors:', error);
      });
  }
};

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex justify-center items-center">
          <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (!isLoading && user && pendingInstructors && user.role === 'admin') {
    return (
      <div className="font-mono bg-indigo-50 min-h-screen text-gray-800">
        <header className="bg-indigo-50 py-5 shadow-md">
          <div className="container mx-auto flex justify-between items-center px-10">
            <div className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-12 w-auto mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">ONLINE OH</h1>
            </div>
            <LogoutButton />
          </div>
        </header>

        <div className="container mx-auto mt-8 px-10">
          <h1 className="text-2xl font-bold mb-6 text-center">Pending Instructors Approval</h1>
          <div className="flex flex-wrap justify-center">
            {pendingInstructors.length > 0 ? (
              pendingInstructors.map(instructor => (
                <div key={instructor._id} className="p-4 bg-white-100 border rounded m-4 w-64 shadow-md">
                  <div className="flex flex-col">
                    <span className="text-md font-bold mb-1">{instructor.firstName} {instructor.lastName}</span>
                    <span className="text-sm text-gray-500">{instructor.email}</span>
                    <label className="mt-2">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={selectedInstructors.includes(instructor._id)}
                        onChange={() => handleSelectInstructor(instructor._id)}
                      />
                    </label>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center w-full">No pending instructors to approve.</p>
            )}
          </div>
          <div className="text-center mt-6">
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded transition-colors duration-300"
              onClick={handleApproveSelected}
            >
              Approve Selected
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && user && userClasses && user.role !== 'admin') {
  return (
    <div className="font-mono bg-indigo-50 h-dvh text-gray-800">
      <Header user={user} showSetOfficeHours={false} />

      <div className="font-mono container mx-auto sm:px-4 p-0 pt-10 pb-2">

        {/* Display user's classes */}

        <div className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {
              ["TA", "instructor", "student"].map((role) => {
                const coursesAsRole = userClasses[role] || [];
                return coursesAsRole.map((course) => (
                  <Link key={course._id} to={`/class/${course._id}`} className="">
                    <div className="p-4 bg-indigo-300 rounded-lg shadow-lg p-4 flex flex-col justify-between h-48 hover:bg-indigo-400">
                      <div>
                        <h3 className="font-bold text-lg mb-2">{course.className}</h3>
                        <p className="text-gray-700 flex-grow">{course.classDescription}</p>
                      </div>
                      <span className="inline-block bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-sm font-semibold mt-4 self-start">
                        {role}
                      </span>
                    </div>
                  </Link>
                ))
              })
            }
          </div>
        </div>

        {!isLoading && user.role === "instructor"  ? (
          user.status === 'approved'?(
            <form onSubmit={handleCreateClassSubmit} className="mt-6 mb-6 flex items-center flex-wrap items-center font-mono p-4 bg-indigo-300 rounded-lg shadow-md">
              <label htmlFor="classCode" className="mr-2 font-bold">
                Create A Class:
              </label>
              <div className="flex flex-wrap">
                <input
                  className="hover:bg-gray-100 border border-gray-300 p-2 rounded block mr-2"
                  type="text"
                  placeholder="Class Name"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
                <input
                  className="hover:bg-gray-100 border border-gray-300 p-2 rounded block mr-2"
                  type="text"
                  placeholder="Class Description"
                  value={classDescription}
                  onChange={(e) => setClassDescription(e.target.value)}
                />
                <input
                  id="classCode"
                  className="hover:bg-gray-100 bg-gray-50 border border-gray-300 p-2 rounded block mr-2"
                  type="text"
                  placeholder="Class Code"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                />
                <button
                  className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                >
                  +
                </button>
              </div>

            </form>

          ) : (<div className="text-center my-6">
          <p>Your instructor account is currently awaiting approval.</p>
          <p>You will be able to create classes once your account has been approved.</p>
          <p>Please check back later, or contact an administrator if you have any questions.</p>
        </div>)): null}



        {!isLoading && user.role === "student" ? (
          <form onSubmit={handleJoinClassSubmit} className="mb-6 mt-6 p-4 bg-indigo-300 rounded-lg shadow-md mb-6 flex items-center font-mono p-5 bg-indigo-200">
            <label htmlFor="joinClassCode" className="mr-2 font-bold flex-wrap shrink">
              Join a Class:
            </label>
            <input
              id="joinClassCode"
              className="hover:bg-gray-100 grow bg-gray-50 border border-gray-300 p-2 rounded block mr-2 max-w-48 w-1/2"
              type="text"
              placeholder="Join Code"
              value={joinClassCode}
              onChange={(e) => setJoinClassCode(e.target.value)}
            />
            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Join
            </button>
          </form>
        ) : null}

        {/* <div className="flex justify-between items-center mb-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate("/my-room")}
          >
            Go to Classroom
          </button>
        </div> */}
      </div>
    </div>
  );
}};

export default Dashboard;

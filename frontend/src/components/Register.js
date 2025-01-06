import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register(props) {
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  function btnRegister(event) {
    axios({
      method: "POST",
      url: "http://127.0.0.1:5000/register", // Adjust URL accordingly
      data: {
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password
      }
    })
      .then((response) => {
        console.log(response);
        alert("Registration Successful");
        navigate("/login");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          alert("Error: Please check the entered details.");
        }
      });

    // Reset form after submission
    setRegisterForm({
      username: "",
      email: "",
      password: ""
    });

    event.preventDefault();
  }

  function handleChange(event) {
    const { value, name } = event.target;
    setRegisterForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  }

  return (
    <div>
      <div className="container h-50">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-50">
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form>
                <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                  <p className="lead fw-normal mb-0 me-3">Create Your Account</p>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    value={registerForm.username}
                    onChange={handleChange}
                    name="username"
                    id="form3Example1"
                    className="form-control form-control-lg"
                    placeholder="Enter username"
                  />
                  <label className="form-label" for="form3Example1">
                    Username
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={handleChange}
                    name="email"
                    id="form3Example2"
                    className="form-control form-control-lg"
                    placeholder="Enter a valid email address"
                  />
                  <label className="form-label" for="form3Example2">
                    Email address
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={handleChange}
                    name="password"
                    id="form3Example3"
                    className="form-control form-control-lg"
                    placeholder="Enter password"
                  />
                  <label className="form-label" for="form3Example3">
                    Password
                  </label>
                </div>

                <div className="text-center text-lg-start mt-4 pt-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={btnRegister}
                  >
                    Register
                  </button>
                  <p className="small fw-bold mt-2 pt-1 mb-0">
                    Already have an account?{" "}
                    <a href="/login" className="link-danger">
                      Login
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const formChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const login = (event) => {
        event.preventDefault();
    }

    const fromChange = {}

    return (
        <Fragment>
            <div className="alert alert-danger">
                Invalid credentials
            </div>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
            <form className="form" action="dashboard.html" onSubmit={login}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        required
                        onChange={formChange}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={formChange}
                    />
                </div>
                {email}
                {password}
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/login">Sign Up</Link>
            </p>
        </Fragment>
    );
}

export default Login;
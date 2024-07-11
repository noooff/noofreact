import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Import useHistory from react-router-dom

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

   // const history = useHistory(); // Initialize useHistory hook

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`https://noufapi-5cc267ed7086.herokuapp.com/api/users${email}/${password}`);
            const user = response.data[0]; // Assuming it returns a single user
            window.location = "/products"
            
        } catch (error) {
            setError('Error logging in. Please try again later.');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin}>
                <label>Email:</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label>Password:</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;

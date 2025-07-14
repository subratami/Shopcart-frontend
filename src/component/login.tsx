import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { useCart } from "../component/CartContext";
import { toast } from "react-toastify";


interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { fetchCart } = useCart();
  const [formData, setFormData] = useState<LoginForm>({ email: '', password: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (res.ok) {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userName", data.name); // Save user name if available
  localStorage.setItem("access_token", data.access_token); // Save access token
  localStorage.setItem("refresh_token", data.refresh_token); // Save refresh token
  
  await fetchCart();
  toast.success("Login successful!");

  navigate('/dashboard');
}
       else {
        alert(data.detail || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="auth-form">
        <p className="login-signup-p">
          New User? <Link to="/signup">Sign Up</Link>
        </p>
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <input
            placeholder="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            placeholder="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">LOG IN</button>
          <p><a href="#">Forgot Password?</a></p>
        </form>

        <div className="social-login">
          <p>or</p>
          <button className="google-login">Google</button>
          <button className="apple-login">Apple</button>
        </div>
      </div>
    </div>
  );
};

export default Login;

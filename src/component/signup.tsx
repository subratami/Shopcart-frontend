import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';
import { toast } from "react-toastify";


interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        //alert('Signup successful!');
        toast.success("Signup successful!");

        navigate('/dashboard');
      } else {
        //alert(data.detail || 'Signup failed');
        toast.info("Signup failed!");

      }
    } catch (error) {
      console.error('Signup error:', error);
      //alert('Server error. Please try again.');
      toast.error("Server error. Please try again.");

    }
  };

  return (
    <div className="Signup-container">
      <div className="auth-form">
        <p style={{ padding: '10px' }}>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            placeholder="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email Address</label>
          <input
            placeholder="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            placeholder="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">SIGN UP</button>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms" style={{ marginLeft: '10px' }}>
              I agree to the <a href="#">Terms & Conditions</a>
            </label>
          </div>
          <p>By signing up, you agree to our <a href="#">Privacy Policy</a>.</p>
        </form>

        <div className="social-login">
          <p>or</p>
          <button className="google-signup">Google</button>
          <button className="apple-signup">Apple</button>
        </div>
      </div>
    </div>
  );
};

export default Signin;

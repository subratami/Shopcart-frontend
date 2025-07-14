import { useEffect } from 'react';
import { authFetch } from '../utils/authFetch';

const Dashboard = () => {
  useEffect(() => {
    const fetchProtectedData = async () => {
      const res = await authFetch('http://127.0.0.1:8000/protected');
      const data = await res.json();
      console.log("Protected response:", data);
      // You can also store this in state to show in the UI
    };

    fetchProtectedData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>This page is only visible to authenticated users.</p>
    </div>
  );
};

export default Dashboard;

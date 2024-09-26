import { useState, useEffect } from 'react';
import '../assets/css/User_Profile.css';

const Profile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        image: 'default-image.jpg' // Default image
    });

    const [statusData, setStatusData] = useState([
        { id: 1, name: 'Task 1', status: 'Pending' },
        { id: 2, name: 'Task 2', status: 'Pending' },
        { id: 3, name: 'Task 3', status: 'Pending' }
    ]);

    useEffect(() => {
        // Simulating fetching user data from an API
        const fetchUser = async () => {
            const response = await fetch('/api/user/1'); // Adjust this URL for actual API endpoint
            const userData = await response.json();
            setUser(userData);
        };
        fetchUser();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit updated profile data to the API
        console.log('User updated:', user);
        // You can post data to API endpoint here
    };

    const handleStatusChange = (id, newStatus) => {
        setStatusData((prevStatusData) =>
            prevStatusData.map((item) =>
                item.id === id ? { ...item, status: newStatus } : item
            )
        );
    };

    return (
        <>
            <div className="profile-container">
                <div className="profile-header">
                    <img src={`/user_images/${user.image}`} alt="Profile" />
                </div>
                <div className="profile-content">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={user.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone:</label>
                            <input
                                type="number"
                                id="phone"
                                name="phone"
                                value={user.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group my_perent_a_b">
                            <button type="submit">Update Profile</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="profile-container profile-container2">
                <h2>Manage Tasks</h2>
                <table className="status-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statusData.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.status}</td>
                                <td>
                                    <button onClick={() => handleStatusChange(item.id, 'Pending')} className="status-btn pending">Pending</button>
                                    <button onClick={() => handleStatusChange(item.id, 'Accepted')} className="status-btn accept">Accept</button>
                                    <button onClick={() => handleStatusChange(item.id, 'Rejected')} className="status-btn reject">Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Profile;

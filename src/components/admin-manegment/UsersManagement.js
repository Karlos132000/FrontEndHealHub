import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UsersManagement() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
        try {
            const response = await axios.get('http://localhost:3360/admin/users', { headers });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    return (
        <div>
            <h2>Users Management</h2>
            {/* User form and user list */}
        </div>
    );
}

export default UsersManagement;


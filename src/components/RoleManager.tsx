import React, { useState, useEffect } from 'react';

const RoleManager = ({ userRole, onRoleChange }) => {
  const [role, setRole] = useState(userRole);

  useEffect(() => {
    onRoleChange(role);
  }, [role, onRoleChange]);

  return (
    <div>
      <h2>Select Your Segment</h2>
      <button onClick={() => setRole('healthcare')}>Healthcare</button>
      <button onClick={() => setRole('ecommerce')}>E-commerce</button>
    </div>
  );
};

export default RoleManager;

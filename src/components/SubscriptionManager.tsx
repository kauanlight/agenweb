import React, { useState } from 'react';

const SubscriptionManager = ({ currentPlan, onPlanChange }) => {
  const [plan, setPlan] = useState(currentPlan);

  const handleUpgrade = (newPlan) => {
    setPlan(newPlan);
    onPlanChange(newPlan);
  };

  return (
    <div>
      <h2>Manage Your Subscription</h2>
      <button onClick={() => handleUpgrade('flexible')}>Flexible Plan</button>
      <button onClick={() => handleUpgrade('premium')}>Premium Plan</button>
    </div>
  );
};

export default SubscriptionManager;

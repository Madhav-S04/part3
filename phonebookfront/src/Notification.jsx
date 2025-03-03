import React from 'react';

const Notification = ({ notification }) => {
  if (!notification) return null;

  const style = {
    color: notification.type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    fontWeight: 'bold', // 🔥 Make text bold
    border: `3px solid ${notification.type === 'error' ? 'red' : 'green'}`, // 🔥 Stronger border
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return (
    <div style={style} role="alert" aria-live="assertive">
      {notification.message}
    </div>
  );
};

export default Notification;

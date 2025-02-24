import React from 'react';

const Bilde = () => {
    return (
      <div 
      className="flex justify-center items-center h-[calc(60vh+200px)] bg-cover zoomed-out-bg bg-no-repeat"
      style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1616840388998-a514fe2175b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
      }}
    >
    </div>
    );
};

export default Bilde;
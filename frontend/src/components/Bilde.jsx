import React from 'react';

const Bilde = () => {
    return (
        <div>
              <div className="w-full max-h-[600px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1616840388998-a514fe2175b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="bilde"
          className="w-full h-full object-cover"
        />
      </div>
        </div>
    );
};

export default Bilde;
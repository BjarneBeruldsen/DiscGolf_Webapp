import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Hjem = () => {
    return (
        <div>
            <Header />
            <main>
                <h1>Welcome to the Home Page</h1>
                {/* Add your main content here */}
            </main>
            <Footer />
        </div>
    );
};

export default Hjem;
import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage:React.FC = () => {
  return (
    <div className='h-screen'>
    <div className='flex flex-col items-center pt-10  justify-center'>
    <h1 className="bg-gradient-to-r from-fuchsia-400 to-blue-300 bg-clip-text text-transparent text-5xl md:text-7xl font-JosefinSans font-[400] tracking-tight">
        PollZ
      </h1>
      <h2 className="text-slate-300 text-lg font-[400] md:text-2xl font-Quicksand">
        Join the Conversation.
      </h2>
    </div>
    <div className="flex relative top-[20%]  flex-col items-center justify-center text-white">
      <h1 className="text-2xl md:text-6xl font-bold mb-4 font-JosefinSans">404 - Page Not Found</h1>
      <p className="text-sm md:text-xl mb-8 font-Poppins w-[60%] text-center">Oops! The page you are looking for does not exist.</p>
      <Link to="/" className="text-purple-500 hover:text-purple-600 font-bold text-lg md:text-xl">
        Go to Home Page
      </Link>
    </div>
    </div>
  );
};

export default ErrorPage;

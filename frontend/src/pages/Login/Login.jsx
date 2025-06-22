import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useLogin from '../../hooks/useLogin.js';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const iconVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } }
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-cente px-4">
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="" variants={iconVariants} initial="hidden" animate="visible">
          <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4A7.978 7.978 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </motion.div>
        <h1 className="text-xl font-bold text-gray-800 mb-2 text-center">
          Welcome to <span className="text-blue-500">ChitChatHub</span>
        </h1>
        <p className="text-gray-500 text-center mb-5">
          Sign in to start chatting with your friends!
        </p>
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="off"
              required
              placeholder="Enter your username"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-gray-800 placeholder-gray-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="off"
              required
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-gray-800 placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <motion.button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition disabled:opacity-60 flex items-center justify-center"
            whileTap={{ scale: 0.96 }}
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            )}
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
        <div className="mt-4">
          <Link to="/signup" className="text-sm text-blue-500 hover:underline">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;




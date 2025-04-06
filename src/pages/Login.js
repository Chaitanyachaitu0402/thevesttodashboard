import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import ImageLight from '../assets/img/login-office.jpeg';
import ImageDark from '../assets/img/login-office-dark.jpeg';
import { Label, Input, Button } from '@windmill/react-ui';
import { Spinner } from '@windmill/react-ui';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  const onSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://thevesttobackend.vercel.app/web/user/login-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send only email and password
      });

      const result = await response.json();

      if (response.ok) {
        const accessToken = result.data.accessToken;
        localStorage.setItem('accessToken', accessToken);
        getLoginUserData(accessToken);
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  const getLoginUserData = async (accessToken) => {
    try {
      const response = await fetch('https://thevesttobackend.vercel.app/web/user/get-logged-in-user-details', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('userData', JSON.stringify(result.data));
        localStorage.setItem('userName', JSON.stringify(result.data.user_name));
        localStorage.setItem('Email', JSON.stringify(result.data.email));
        localStorage.setItem('user_id', JSON.stringify(result.data.user_id));
        localStorage.setItem('Password', JSON.stringify(result.data.password));
        // localStorage.setItem('Address', JSON.stringify(result.data.Address));
        localStorage.setItem('Role', JSON.stringify(result.data.role));
        localStorage.setItem('grocery_userLoggedIn', true);
        history.push('/app'); // Redirect after successful login
      } else {
        setError(result.message || 'Login User Details failed');
      }
    } catch (error) {
      setError('Login User Details error: ' + error.message);
    }
  };

  return (
    <div>
      
      <div className="flex  items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">

      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className='text-gray-400 font-bold text-2xl text-center mb-5 underline'>TheVestto Admin Dashboard</h1>
              {/* <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Login</h1> */}
              {error && <p className="text-red-500">{error}</p>}
              <Label>
                <span>Email</span>
                <Input
                  className="mt-1"
                  type="email"
                  placeholder="Enter Your Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Label>

              <Label className="mt-4">
                <span>Password</span>
                <Input
                  className="mt-1"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Label>

              <Button className="mt-4" block onClick={onSubmit} disabled={loading}>
                { 'Log in'}
              </Button>

              <hr className="my-8" />

              <p className="mt-4">
                <Link
                  className="text-sm text-[#ffffff] dark:text-white font-bold hover:underline"
                  to="/forgot-password"
                >
                  Forgot your password?
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Login;

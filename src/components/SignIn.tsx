"use client"
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignInCmp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleUsernameChange = (e: { target: { value: any; }; }) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
  };

  const handlePasswordChange = (e: { target: { value: any; }; }) => {
    const newPassword = e.target.value;
    setPassword(newPassword)
  };

  const handleSignIn = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false, // Prevent automatic redirect
      username,
      password,
    });

    if (res?.ok) {
      router.push('/dashboard'); // Manually redirect after successful sign-in
    } else {
      console.error('Failed to sign in');
    }
}
   

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl overflow-hidden border-4 border-gray-500 dark:border-blue-800"
        onSubmit={handleSignIn}>
        <div className="px-8 py-10 md:px-10">
            
          <h2 className="text-4xl font-extrabold text-center text-zinc-800 dark:text-white">
            Welcome Back!
          </h2>
          <p className="text-center text-zinc-600 dark:text-zinc-400 mt-3">
            We missed you, sign in to continue.
          </p>
          <div className="mt-10">
            <div className="relative">
              <label className="block mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-200">
                Username
              </label>
              <input
                placeholder="john doe"
                className="block w-full px-4 py-3 mt-2 text-zinc-800 bg-white border-2 rounded-lg dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-opacity-50 focus:outline-none focus:ring focus:ring-blue-400"
                name="username"
                type="text"
                onChange={handleUsernameChange}
              />
            </div>
            <div className="mt-6">
              <label className="block mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-200">
                Password
              </label>
              <input
                placeholder="••••••••"
                className="block w-full px-4 py-3 mt-2 text-zinc-800 bg-white border-2 rounded-lg dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-opacity-50 focus:outline-none focus:ring focus:ring-blue-400"
                name="password"
                id="password"
                type="password"
                onChange={handlePasswordChange}
              />
            </div>
            <div className="mt-10">
              <button
                className="w-full px-4 py-3 tracking-wide text-white transition-colors duration-200 transform bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-blue-400 dark:focus:ring-blue-800"
                type="submit"
              >
                Let's Go
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

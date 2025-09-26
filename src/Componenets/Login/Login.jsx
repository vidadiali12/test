import React, { useEffect, useState } from 'react';
import { totalUsersFetch } from '../../Data';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const Login = ({ setAccess, setUserId }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [totalUsers, setTotalUsers] = useState([])

    const handleLogin = async (e) => {
        e.preventDefault();

        const matchedUser = totalUsers.find(
            (user) => user.username === username && user.password === password
        );

        if (matchedUser) {
            const userId = matchedUser.userId;

            const encryptedId = btoa(String(userId));

            localStorage.setItem('chatUserAccess1', encryptedId);
            console.log(userId)

            setUserId(userId)
            setAccess(true);
            setError('');
        } else {
            setError('❌ İstifadəçi adı və ya şifrə yanlışdır.');
        }
    };

    const createTotalUsers = async () => {
        setTotalUsers(await totalUsersFetch())
    }
    useEffect(() => {
        createTotalUsers()
    })

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-olive-700">Daxil ol</h2>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    {/* Username */}
                    <div>
                        <label className="block mb-1 text-olive-700 font-semibold">İstifadəçi adı</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-olive-400"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-1 text-olive-700 font-semibold">Şifrə</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="w-full border border-gray-300 rounded px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-olive-400"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-olive-600"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="bg-olive-500 hover:bg-olive-600 text-white font-semibold py-2 rounded transition"
                    >
                        Giriş et
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Login;

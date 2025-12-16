import React, { useState } from "react";
import type  {ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiRequest } from "../utils/apiRequest";
import { logo } from "../assets";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required!");
      return;
    }

    setLoading(true);
    const { success, data } = await apiRequest("/admin_auth/login", {
      method: "POST",
      body: formData,
    });
    setLoading(false);

    if (success) {
      localStorage.setItem("token", data.token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid email or password!");
    }
  };

  return (
    <div className="flex flex-col bg-purple-800 min-h-screen text-center px-4">
      <div className="text-center mb-6 mt-6">
        <img src={logo} alt="Logo" className="w-42 mx-auto" />
      </div>

      <div className="rounded-2xl px-3 text-white shadow-md py-10 w-full max-w-sm mx-auto bg-purple-700">
        <h3 className="text-2xl font-bold mb-2 text-gray-200">Login to Account</h3>
        <p className="text-sm text-gray-300 mb-6">
          Please enter your details to access your account
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className={`w-full font-semibold py-2 rounded-lg transition ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

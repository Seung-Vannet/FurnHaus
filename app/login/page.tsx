"use client";

import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { loginUser, registerUser } from "@/app/lib/api";
import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");
  const [regPhone, setRegPhone] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await loginUser(loginEmail, loginPassword);
      if (result.success && result.data?.token) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("admin_token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        router.push("/dashboard");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (regPassword !== regPasswordConfirm) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      const result = await registerUser({
        first_name: regFirstName,
        last_name: regLastName,
        email: regEmail,
        password: regPassword,
        password_confirmation: regPasswordConfirm,
        phone: regPhone,
      });

      if (result.success && result.data?.token) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("admin_token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        router.push("/dashboard");
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Form */}
          {isLogin && (
            <div>
              <h1 className="text-3xl font-bold mb-2 text-[#222222]">Login</h1>
              <p className="text-[#666666] mb-8">
                Sign in to your FurnHaus account
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#222222]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full border border-[#E5E5E5] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-[#333333] placeholder-[#999999]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#222222]">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full border border-[#E5E5E5] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-[#333333] placeholder-[#999999]"
                  />
                </div>

                <div className="flex items-center justify-between mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm text-[#333333]">Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="text-sm text-black hover:underline font-semibold"
                  >
                    Forgot password?
                  </a>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "LOGGING IN..." : "LOGIN"}
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 border-t border-[#E5E5E5]"></div>
                <span className="text-[#666666]">Or</span>
                <div className="flex-1 border-t border-[#E5E5E5]"></div>
              </div>

              <button className="w-full border-2 border-black py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" />
                Continue with Google
              </button>

              <p className="text-center mt-6 text-[#666666]">
                Don't have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-black hover:underline font-semibold"
                >
                  Create one
                </button>
              </p>
            </div>
          )}

          {/* Register Form */}
          {!isLogin && (
            <div>
              <h1 className="text-3xl font-bold mb-2 text-[#222222]">
                Create Account
              </h1>
              <p className="text-[#666666] mb-8">
                Join FurnHaus and start shopping
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#222222]">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      required
                      className="w-full border border-[#E5E5E5] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text[#333333] placeholder-[#999999]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#222222]">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      required
                      className="w-full border border-[#E5E5E5] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-[#333333] placeholder-[#999999]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#222222]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    className="w-full border border-[#E5E5E5] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-[#333333] placeholder-[#999999]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#222222]">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    required
                    className="w-full border border-[#E5E5E5] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-[#333333] placeholder-[#999999]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#222222]">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    className="w-full border border-[#E5E5E5] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-[#333333] placeholder-[#999999]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#222222]">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={regPasswordConfirm}
                    onChange={(e) => setRegPasswordConfirm(e.target.value)}
                    required
                    className="w-full border border-[#E5E5E5] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-[#333333] placeholder-[#999999]"
                  />
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 mt-1" />
                  <span className="text-sm text-[#333333]">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-black hover:underline font-semibold"
                    >
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-black hover:underline font-semibold"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                </button>
              </form>

              <p className="text-center mt-6 text-[#666666]">
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-black hover:underline font-semibold"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}

          {/* Side Info */}
          <div className="hidden md:flex flex-col justify-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-3 text-[#222222]">
                  Why Shop with FurnHaus?
                </h3>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-[#222222]">
                  ✓ Exclusive Deals
                </h4>
                <p className="text-[#666666]">
                  Get access to member-only discounts and sales
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-[#222222]">
                  ✓ Order Tracking
                </h4>
                <p className="text-[#666666]">Track your orders in real-time</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-[#222222]">
                  ✓ Save Favorites
                </h4>
                <p className="text-[#666666]">
                  Build your wishlist and save items for later
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-[#222222]">
                  ✓ Easy Returns
                </h4>
                <p className="text-[#666666]">
                  30-day return guarantee on all items
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

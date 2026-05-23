import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginCustomer } from "../../services/customerAuthApi";
import { customerAuthStorage } from "../../auth/customerAuthStorage";
import { motion } from "framer-motion";

export default function LoginPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const session = await loginCustomer(loginForm);
      customerAuthStorage.setSession({
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        customer: session.customer,
      });
      navigate("/");
      // Ideally trigger a global state update here or refresh
      window.location.reload();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-theme-bg flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-theme-surface rounded-3xl p-8 shadow-sm border border-theme-border"
      >
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-theme-accent text-2xl font-serif font-bold text-theme-inverse-text mb-4">
            B
          </div>
          <h1 className="font-serif text-3xl font-bold text-theme-text">Welcome Back</h1>
          <p className="text-theme-text-muted mt-2 font-sans text-sm">Sign in to your account</p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-500/25 bg-red-50 p-4 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-muted mb-2">Email Address</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-xl border border-theme-border bg-theme-surface px-4 py-3 text-sm outline-none transition-colors focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-muted">Password</label>
              <Link to="/forgot-password" className="text-xs text-theme-accent font-semibold hover:underline">Forgot?</Link>
            </div>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full rounded-xl border border-theme-border bg-theme-surface px-4 py-3 text-sm outline-none transition-colors focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting} 
            className="mt-4 w-full rounded-xl bg-theme-accent py-4 font-sans text-sm font-bold uppercase tracking-wider text-theme-inverse-text transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-theme-text-muted">
          Don't have an account?{" "}
          <Link to="/register" className="font-bold text-theme-accent hover:underline">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

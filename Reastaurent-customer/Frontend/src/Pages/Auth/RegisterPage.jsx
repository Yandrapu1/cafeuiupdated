import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCustomer } from "../../services/customerAuthApi";
import { customerAuthStorage } from "../../auth/customerAuthStorage";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const handleRegister = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const session = await registerCustomer(registerForm);
      customerAuthStorage.setSession({
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        customer: session.customer,
      });
      navigate("/");
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
        className="w-full max-w-md bg-theme-surface rounded-3xl p-8 shadow-sm border border-theme-border my-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-theme-accent text-2xl font-serif font-bold text-theme-inverse-text mb-4">
            B
          </div>
          <h1 className="font-serif text-3xl font-bold text-theme-text">Create Account</h1>
          <p className="text-theme-text-muted mt-2 font-sans text-sm">Join the Bagel Cafe family</p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-500/25 bg-red-50 p-4 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-muted mb-2">Full Name</label>
            <input
              type="text"
              value={registerForm.name}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-xl border border-theme-border bg-theme-surface px-4 py-3 text-sm outline-none transition-colors focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-muted mb-2">Email Address</label>
            <input
              type="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-xl border border-theme-border bg-theme-surface px-4 py-3 text-sm outline-none transition-colors focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-muted mb-2">Phone Number</label>
            <input
              type="tel"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full rounded-xl border border-theme-border bg-theme-surface px-4 py-3 text-sm outline-none transition-colors focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-muted mb-2">Password</label>
            <input
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full rounded-xl border border-theme-border bg-theme-surface px-4 py-3 text-sm outline-none transition-colors focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-muted mb-2">Confirm Password</label>
            <input
              type="password"
              value={registerForm.confirm_password}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, confirm_password: e.target.value }))}
              className="w-full rounded-xl border border-theme-border bg-theme-surface px-4 py-3 text-sm outline-none transition-colors focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting} 
            className="mt-4 w-full rounded-xl bg-theme-accent py-4 font-sans text-sm font-bold uppercase tracking-wider text-theme-inverse-text transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
          >
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-theme-text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-theme-accent hover:underline">
            Sign In here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

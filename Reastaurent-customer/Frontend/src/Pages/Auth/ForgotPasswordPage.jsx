import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setMessage("");

    try {
      // Assuming a forgot password API endpoint will be added or exists.
      // For now, we'll just mock a success response.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("If an account exists for this email, you will receive a password reset link shortly.");
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
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
            ?
          </div>
          <h1 className="font-serif text-3xl font-bold text-theme-text">Reset Password</h1>
          <p className="text-theme-text-muted mt-2 font-sans text-sm">Enter your email to receive a reset link</p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-green-500/25 bg-green-50 p-4 text-sm text-theme-accent">
            {message}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-500/25 bg-red-50 p-4 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-muted mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-theme-border bg-theme-surface px-4 py-3 text-sm outline-none transition-colors focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={submitting} 
            className="mt-4 w-full rounded-xl bg-theme-accent py-4 font-sans text-sm font-bold uppercase tracking-wider text-theme-inverse-text transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
          >
            {submitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-theme-text-muted">
          Remembered your password?{" "}
          <Link to="/login" className="font-bold text-theme-accent hover:underline">
            Back to login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase/config";
import "./Login.css";

const provider = new GoogleAuthProvider();

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
   } catch (err) {
  if (err.code === "auth/weak-password") {
    setError("Password must be at least 6 characters.");
  } else if (err.code === "auth/email-already-in-use") {
    setError("This email is already registered. Try logging in.");
  } else if (err.code === "auth/invalid-email") {
    setError("Please enter a valid email address.");
  } else if (err.code === "auth/invalid-credential") {
    setError("Wrong email or password. Please try again.");
  } else {
    setError("Something went wrong. Please try again.");
  }
} finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/\(auth.*\)/, ""));
    }
  };

  return (
    <div className="login">
      <div className="login__card">

        <Link to="/" className="login__back">← Back to Shop</Link>

        <div className="login__header">
          <h1 className="login__title">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="login__subtitle">
            {isRegister
              ? "Sign up to start shopping"
              : "Login to your ShopReact account"}
          </p>
        </div>

        {/* Google Button */}
        <button className="login__google" onClick={handleGoogle}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="login__divider">
          <span>or</span>
        </div>

        {/* Error */}
        {error && <div className="login__error">{error}</div>}

        {/* Form */}
        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login__field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="login__submit" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
          </button>
        </form>

        <p className="login__switch">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <button onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? " Login" : " Sign Up"}
          </button>
        </p>

      </div>
    </div>
  );
}
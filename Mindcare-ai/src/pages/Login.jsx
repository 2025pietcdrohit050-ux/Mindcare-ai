import { useState } from "react";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [verificationRequired, setVerificationRequired] = useState(false);

  const API = "https://mindcare-ai-hesy.onrender.com/api/auth";

  // SIGNUP
  async function handleSignup(event) {
    event.preventDefault();

    try {
      const response = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Signup failed");
        return;
      }

      setUserId(data.userId);
      setShowOTP(true);
      setVerificationRequired(false);
      setMessage("OTP has been sent to your email.");
    } catch (error) {
      console.error(error);
      setMessage("Backend se connection nahi ho raha.");
    }
  }

  // VERIFY EMAIL OTP
  async function verifyOTP(event) {
    event.preventDefault();

    try {
      const response = await fetch(`${API}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "OTP verification failed");
        return;
      }

      setMessage("Email verified successfully! You can now login.");
      setShowOTP(false);
      setIsSignup(false);
      setVerificationRequired(false);
      setOtp("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setMessage("OTP verification failed.");
    }
  }

  // LOGIN
  async function handleLogin(event) {
    event.preventDefault();

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setVerificationRequired(true);
          setMessage("Please verify your email before login.");
        } else {
          setVerificationRequired(false);
          setMessage(data.message || "Login failed");
        }
        return;
      }

      setVerificationRequired(false);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful!");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      setMessage("Backend se connection nahi ho raha.");
    }
  }

  // RESEND VERIFICATION OTP
  async function resendVerificationOTP() {
    try {
      const response = await fetch(`${API}/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to send verification OTP");
        return;
      }

      setUserId(data.userId);
      setShowOTP(true);
      setVerificationRequired(false);
      setOtp("");
      setMessage("Verification OTP has been sent to your email.");
    } catch (error) {
      console.error(error);
      setMessage("Backend se connection nahi ho raha.");
    }
  }

  // SEND FORGOT PASSWORD OTP
  async function sendResetOTP(event) {
    event.preventDefault();

    try {
      const response = await fetch(`${API}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to send reset OTP");
        return;
      }

      setResetStep(2);
      setMessage("Password reset OTP has been sent to your email.");
    } catch (error) {
      console.error(error);
      setMessage("Backend se connection nahi ho raha.");
    }
  }

  // VERIFY RESET OTP
  async function verifyResetOTP(event) {
    event.preventDefault();

    try {
      const response = await fetch(`${API}/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "OTP verification failed");
        return;
      }

      setResetStep(3);
      setMessage("OTP verified. Create your new password.");
    } catch (error) {
      console.error(error);
      setMessage("OTP verification failed.");
    }
  }

  // RESET PASSWORD
  async function resetPassword(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await fetch(`${API}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newPassword: password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Password reset failed");
        return;
      }

      setMessage("Password changed successfully! Please login.");

      setTimeout(() => {
        setForgotPassword(false);
        setResetStep(1);
        setPassword("");
        setConfirmPassword("");
        setOtp("");
        setMessage("");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage("Password reset failed.");
    }
  }

  function handleSubmit(event) {
    if (isSignup) {
      handleSignup(event);
    } else {
      handleLogin(event);
    }
  }

  function backToLogin() {
    setForgotPassword(false);
    setResetStep(1);
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
  }

  // FORGOT PASSWORD SCREEN
  if (forgotPassword) {
    return (
      <div className="page">
        <div className="login-card">
          <div className="ai-avatar">🔐</div>
          <p className="small-title">MINDCARE AI</p>

          {resetStep === 1 && (
            <>
              <h1>Forgot Password?</h1>
              <p className="description">
                Enter your registered email address and we will send you a
                password reset OTP.
              </p>

              <form onSubmit={sendResetOTP}>
                <input
                  type="email"
                  placeholder="Registered email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />

                <button type="submit" className="primary-btn">
                  Send OTP
                </button>
              </form>
            </>
          )}

          {resetStep === 2 && (
            <>
              <h1>Verify OTP 📧</h1>
              <p className="description">
                Enter the 6-digit OTP sent to your email.
              </p>

              <form onSubmit={verifyResetOTP}>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  maxLength="6"
                  required
                />

                <button type="submit" className="primary-btn">
                  Verify OTP
                </button>
              </form>
            </>
          )}

          {resetStep === 3 && (
            <>
              <h1>Create New Password 🔑</h1>
              <p className="description">
                Enter your new password below.
              </p>

              <form onSubmit={resetPassword}>
                <input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />

                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                />

                <button type="submit" className="primary-btn">
                  Change Password
                </button>
              </form>
            </>
          )}

          {message && <p className="login-message">{message}</p>}

          <button
            type="button"
            className="text-btn"
            onClick={backToLogin}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="login-card">
        <div className="ai-avatar">🧠</div>
        <p className="small-title">MINDCARE AI</p>

        {!showOTP ? (
          <>
            <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>

            <p className="description">
              {isSignup
                ? "Create an account to start your cognitive wellness journey."
                : "Login to continue your MindCare journey."}
            </p>

            <form onSubmit={handleSubmit}>
              {isSignup && (
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              )}

              <input
                type="email"
                placeholder="Gmail address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              {isSignup && (
                <input
                  type="tel"
                  placeholder="Mobile number"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
              )}

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button type="submit" className="primary-btn">
                {isSignup ? "Create Account" : "Login"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>Verify your email 📧</h1>

            <p className="description">
              We sent a 6-digit OTP to your email address. Enter it below to
              verify your account.
            </p>

            <form onSubmit={verifyOTP}>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                maxLength="6"
                required
              />

              <button type="submit" className="primary-btn">
                Verify OTP
              </button>
            </form>
          </>
        )}

        {message && <p className="login-message">{message}</p>}

        {!showOTP && (
          <>
            {!isSignup && (
              <button
                type="button"
                className="forgot-password-btn"
                onClick={resendVerificationOTP}
              >
                Resend Verification OTP
              </button>
            )}

            {!isSignup && (
              <button
                type="button"
                className="forgot-password-btn"
                onClick={() => {
                  setForgotPassword(true);
                  setVerificationRequired(false);
                  setMessage("");
                }}
              >
                Forgot Password?
              </button>
            )}

            <button
              type="button"
              className="text-btn"
              onClick={() => {
                setIsSignup(!isSignup);
                setVerificationRequired(false);
                setMessage("");
              }}
            >
              {isSignup
                ? "Already have an account? Login"
                : "Don't have an account? Sign up"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;

import { useState } from "react";
import { useLanguage } from "../LanguageContext";

function Login() {
  const { language, changeLanguage } = useLanguage();
  const isHindi = language === "Hindi";

  const text = {
    en: {
      forgot: "Forgot Password?",
      registeredEmail: "Enter your registered email address and we will send you a password reset OTP.",
      registeredEmailPlaceholder: "Registered email address",
      sendOtp: "Send OTP",
      verifyOtp: "Verify OTP",
      otpDescription: "Enter the 6-digit OTP sent to your email.",
      otpPlaceholder: "Enter 6-digit OTP",
      newPassword: "Create New Password 🔑",
      newPasswordDescription: "Enter your new password below.",
      newPasswordPlaceholder: "New password",
      confirmPasswordPlaceholder: "Confirm new password",
      changePassword: "Change Password",
      backLogin: "← Back to Login",
      createAccount: "Create Account",
      welcomeBack: "Welcome Back",
      createJourney: "Create an account to begin your cognitive wellness journey.",
      loginJourney: "Login to continue your MindCare journey.",
      name: "Your name",
      email: "Gmail address",
      phone: "Mobile number",
      password: "Password",
      create: "Create Account",
      login: "Login",
      verifyEmail: "Verify your email 📧",
      verifyEmailDescription: "We sent a 6-digit OTP to your email address. Enter it below to verify your account.",
      resend: "Resend Verification OTP",
      already: "Already have an account? Login",
      signup: "Don't have an account? Sign up",
      lang: "English",
      switchLang: "हिंदी",
    },
    hi: {
      forgot: "पासवर्ड भूल गए?",
      registeredEmail: "अपना रजिस्टर्ड ईमेल पता दर्ज करें। हम आपको पासवर्ड रीसेट OTP भेजेंगे।",
      registeredEmailPlaceholder: "रजिस्टर्ड ईमेल पता",
      sendOtp: "OTP भेजें",
      verifyOtp: "OTP सत्यापित करें",
      otpDescription: "अपने ईमेल पर भेजा गया 6 अंकों का OTP दर्ज करें।",
      otpPlaceholder: "6 अंकों का OTP दर्ज करें",
      newPassword: "नया पासवर्ड बनाएं 🔑",
      newPasswordDescription: "नीचे अपना नया पासवर्ड दर्ज करें।",
      newPasswordPlaceholder: "नया पासवर्ड",
      confirmPasswordPlaceholder: "नया पासवर्ड दोबारा दर्ज करें",
      changePassword: "पासवर्ड बदलें",
      backLogin: "← लॉगिन पर वापस जाएँ",
      createAccount: "अपना अकाउंट बनाएं",
      welcomeBack: "वापसी पर स्वागत है",
      createJourney: "अपनी संज्ञानात्मक वेलनेस यात्रा शुरू करने के लिए अकाउंट बनाएं।",
      loginJourney: "अपनी MindCare यात्रा जारी रखने के लिए लॉगिन करें।",
      name: "अपना नाम",
      email: "Gmail पता",
      phone: "मोबाइल नंबर",
      password: "पासवर्ड",
      create: "अकाउंट बनाएं",
      login: "लॉगिन",
      verifyEmail: "अपना ईमेल सत्यापित करें 📧",
      verifyEmailDescription: "हमने आपके ईमेल पर 6 अंकों का OTP भेजा है। अकाउंट सत्यापित करने के लिए इसे दर्ज करें।",
      resend: "वेरिफिकेशन OTP दोबारा भेजें",
      already: "पहले से अकाउंट है? लॉगिन करें",
      signup: "अकाउंट नहीं है? साइन अप करें",
      lang: "हिंदी",
      switchLang: "English",
    },
  };

  const tx = isHindi ? text.hi : text.en;

  function toggleLanguage() {
    changeLanguage(isHindi ? "English" : "Hindi");
  }

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

        <button
          type="button"
          onClick={toggleLanguage}
          className="text-btn"
          style={{ marginBottom: "12px" }}
        >
          🌐 {tx.switchLang}
        </button>

          {resetStep === 1 && (
            <>
              <h1>{tx.forgot}</h1>
              <p className="description">
                {tx.registeredEmail}
              </p>

              <form onSubmit={sendResetOTP}>
                <input
                  type="email"
                  placeholder={tx.registeredEmailPlaceholder}
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
              <h1>{tx.verifyOtp} 📧</h1>
              <p className="description">
                {tx.otpDescription}
              </p>

              <form onSubmit={verifyResetOTP}>
                <input
                  type="text"
                  placeholder={tx.otpPlaceholder}
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
              <h1>{tx.newPassword}</h1>
              <p className="description">
                {tx.newPasswordDescription}
              </p>

              <form onSubmit={resetPassword}>
                <input
                  type="password"
                  placeholder={tx.newPasswordPlaceholder}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />

                <input
                  type="password"
                  placeholder={tx.confirmPasswordPlaceholder}
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
            {tx.backLogin}
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

        <button
          type="button"
          onClick={toggleLanguage}
          className="text-btn"
          style={{ marginBottom: "12px" }}
        >
          🌐 {tx.switchLang}
        </button>

        {!showOTP ? (
          <>
            <h1>{isSignup ? tx.createAccount : tx.welcomeBack}</h1>

            <p className="description">
              {isSignup
                ? tx.createJourney
                : tx.loginJourney}
            </p>

            <form onSubmit={handleSubmit}>
              {isSignup && (
                <input
                  type="text"
                  placeholder={tx.name}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              )}

              <input
                type="email"
                placeholder={tx.email}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              {isSignup && (
                <input
                  type="tel"
                  placeholder={tx.phone}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
              )}

              <input
                type="password"
                placeholder={tx.password}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button type="submit" className="primary-btn">
                {isSignup ? tx.create : tx.login}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>{tx.verifyEmail}</h1>

            <p className="description">
              {tx.verifyEmailDescription}
            </p>

            <form onSubmit={verifyOTP}>
              <input
                type="text"
                placeholder={tx.otpPlaceholder}
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
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "24px",
      marginTop: "14px",
      flexWrap: "wrap",
    }}
  >
    <button
      type="button"
      className="forgot-password-btn"
      onClick={resendVerificationOTP}
    >
      {tx.resend}
    </button>

    <button
      type="button"
      className="forgot-password-btn"
      onClick={() => {
        setForgotPassword(true);
        setVerificationRequired(false);
        setMessage("");
      }}
    >
      {tx.forgot}
    </button>
  </div>
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
                ? tx.already
                : tx.signup}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;

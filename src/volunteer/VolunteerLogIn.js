import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { useNavigate } from 'react-router-dom';

function LoginVolunteer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Retrieve user role from Firestore
      const userDoc = await getDoc(doc(db, "users", email));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === "volunteer") {
          navigate('/VolunteerMain', { state: { userId: user.email } });
        } else {
          setMessage("!הנך בכניסת מתנדב");
        }
      } else {
        setMessage("לא נמצא משתמש");
      }
    } catch (error) {
      console.error("Error logging in user:", error.code, error.message);
      setMessage("Login failed. Please check your credentials and try again.");
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setResetMessage("Please enter your email to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email:", error.code, error.message);
      setResetMessage("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <div className="LogInModel">
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="שם משתמש"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          dir="rtl"
        />
        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          dir="rtl"
        />
        <button type="submit">התחבר</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={handleResetPassword}>שכחת סיסמה?</button>
      {resetMessage && <p>{resetMessage}</p>}
    </div>
  );
}

export default LoginVolunteer;

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginApi, callAxiosApi } from "../api_utils";

function LoginForm({ language }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await callAxiosApi(loginApi, { mobile, password });
      
      if (!response.data.errorStatus) {
        const { token, isMaster } = response.data.data;
        login(token, isMaster);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-icon">
          <h1>Login Page</h1>
          <p style={{fontSize: "20px"}}>Please enter your Mobile and Password to Continue</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Mobile"
              value={mobile}
              style={{ fontSize: "1rem", borderRadius: "5px" }}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
            <span className="input-icon">
              <img src="/assets/user.png" alt="User Icon" height={20} width={20} />
            </span>
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              style={{ fontSize: "1rem", borderRadius: "5px" }}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="input-icon">
              <img src="/assets/lock.png" alt="Lock Icon" height={20} width={20} />
            </span>
          </div>
          <button type="submit" className="login-submit-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;

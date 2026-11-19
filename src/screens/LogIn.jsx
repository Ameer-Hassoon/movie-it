import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { AuthCard, Field, SubmitButton } from "../components/AuthCard";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message === "Invalid email or password" ? "That email and password don't match an account." : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Log in"
      error={error}
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="font-semibold text-bulb hover:text-bulb-deep">
            Create an account
          </Link>
        </>
      }
    >
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <Field id="email" label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <SubmitButton loading={loading} loadingText="Logging in…">
          Log in
        </SubmitButton>
      </form>
    </AuthCard>
  );
};

export default LogIn;

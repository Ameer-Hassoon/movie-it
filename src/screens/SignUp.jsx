import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { AuthCard, Field, SubmitButton } from "../components/AuthCard";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await register(name.trim(), email, password);
      navigate("/");
    } catch (err) {
      setError(err.message === "User already exists" ? "An account with this email already exists. Log in instead." : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Sign up"
      intro="Make an account to keep track of what you want to watch."
      error={error}
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-bulb hover:text-bulb-deep">
            Log in
          </Link>
        </>
      }
    >
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <Field id="name" label="Name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        <Field id="email" label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <SubmitButton loading={loading} loadingText="Creating account…">
          Create account
        </SubmitButton>
      </form>
    </AuthCard>
  );
};

export default SignUp;

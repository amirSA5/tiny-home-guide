import { Link } from "react-router-dom";

function WelcomePage() {
  return (
    <div>
      <h2>Welcome</h2>
      <p>
        This app helps you plan and optimize your tiny home with layout ideas,
        multifunctional furniture and minimalism tips.
      </p>

      <p>Ready to start?</p>
      <Link to="/space">Create your space profile →</Link>
    </div>
  );
}

export default WelcomePage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Character from "../components/Character";
import Sparkles from "../components/Sparkles";
import api from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  
  async function handleSubmit(e) {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please enter username");
      return;
    }

    try {
      const res = await api.post("/chat-bot/login", {
        username: username.trim(),
      });

      sessionStorage.setItem(
        "deepspace.user",
        res.data.result.username
      );

      navigate("/characters");
    } catch (err) {
      console.error(err);
      setError("Login failed.");
    }
  }

  return (
    <main className="min-h-screen bg-cream text-ink font-display">
      <div className="mx-auto max-w-7xl px-8 py-8">
        {/* Main Layout */}
        <div className="mt-12 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* ================= Left ================= */}
          <div className="mx-auto w-full max-w-md">
            <h1 className="mb-4 text-center text-5xl font-bold text-gray-900">
              CHAT·BOT
            </h1>
            <h2 className="mb-8 text-center text-4xl font-bold">
              Log in
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Username */}
              <div className="flex items-center rounded-full border bg-white px-5 py-3 shadow-sm">
                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    
                    (e.target.value)
                  }
                  placeholder="Username"
                  className="w-full bg-transparent outline-none"
                />
              </div>

              {/* Password */}
              <div className="flex items-center rounded-full border bg-white px-5 py-3 shadow-sm">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Password"
                  className="w-full bg-transparent outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="ml-3 text-sm text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {error && (
                <p className="text-red-500">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) =>
                      setRemember(
                        e.target.checked
                      )
                    }
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="text-ink hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-ink py-3 font-semibold text-white transition hover:bg-ink"
              >
                Log In
              </button>
            </form>

            {/* OR */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-300" />
              <span className="text-sm text-gray-500">
                OR
              </span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>

            {/* Google */}
            <button
              className="w-full rounded-full border bg-white py-3 shadow-sm transition hover:bg-gray-50"
            >
              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm">
              Don't have an account?{" "}
              <button className="font-semibold text-ink hover:underline">
                Sign up
              </button>
            </p>
          </div>

          {/* ================= Right ================= */}
          <div className="relative flex justify-center">
            <Sparkles />

            <Character
              size={430}
              decorated
            />
          </div>
        </div>
      </div>
    </main>
  );
}
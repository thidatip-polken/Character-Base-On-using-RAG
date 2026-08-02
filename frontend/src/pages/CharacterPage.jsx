import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sparkles from "../components/Sparkles";
import CharacterCard from "../components/CharacterCard";
import { characters } from "../lib/characters";
import { selectCharacter } from "../services/api";

export default function CharacterPage() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState(null);
  const [pending, setPending] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("deepspace.user");

    if (!stored) {
      navigate("/", { replace: true });
      return;
    }

    setUserName(stored);
  }, [navigate]);

  async function handleChoose(character) {
    if (!userName) return;

    setError(null);
    setPending(character);

    try {
      const res = await selectCharacter(character.id);

      if (res.status_code !== 200 && res.status_code !== "200") {
        throw new Error(
          res.status_desc || "Could not start the session."
        );
      }

      sessionStorage.setItem(
        "deepspace.character",
        character.id
      );

      navigate("/chat");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not open this chat. Try again."
      );

      setPending(null);
    }
  }

  if (!userName) return null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_#EFE9E0_0%,_#D8CFDD_55%,_#B9AFC7_100%)]">
      <Sparkles />
      {/*  fix button link login page */}
      <button
        onClick={() => navigate("/chat-bot/login")}
        className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow hover:bg-gray-100"
      >
        ←
      </button>

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16">
        <h1 className="mb-10 text-4xl font-display text-gray-900">
          Select Character
        </h1>

        {error && (
          <p className="mb-6 text-red-500">{error}</p>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {characters.map((character) => (
            <div key={character.id} className="relative">
              <CharacterCard
                character={character}
                onChoose={handleChoose}
              />

              {pending?.id === character.id && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/60">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-400 border-t-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-12 font-display text-gray-500 italic">
          More companions coming soon...
        </p>
      </div>
    </main>
  );
}
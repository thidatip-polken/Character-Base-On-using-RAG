import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Character from "../components/Character";
import ChatBubble from "../components/ChatBubble";
import { characters } from "../lib/characters";
import { askQuestion } from "../services/api";

export default function ChatPage() {
    const navigate = useNavigate();
    const [ready, setReady] = useState(false);
    const [userName, setUserName] = useState("");
    const [characterId, setCharacterId] = useState("rafayel");
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);


    useEffect(() => {
        const storedUser = sessionStorage.getItem("deepspace.user");
        const storedChar = sessionStorage.getItem("deepspace.character");
        if (!storedUser || !storedChar) {
            navigate("/", { replace: true });
            return;
        }
        setUserName(storedUser);
        setCharacterId(storedChar);
        setReady(true);
    }, [navigate]);

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    const character =
        characters.find((c) => c.id === characterId) ?? characters[0];

    async function handleSend() {
        const question = input.trim();
        if (!question || sending) return;

        const userMsg = {
            id: crypto.randomUUID(),
            role: "user",
            text: question,
        };

        setMessages((m) => [...m, userMsg]);
        setInput("");
        setSending(true);
        setError(null);

        try {
            const res = await askQuestion(characterId, question);

            if (res.status_code !== 200 && res.status_code !== "200") {
                throw new Error(res.status_desc || "No reply came back.");
            }

            const botMsg = {
                id: crypto.randomUUID(),
                role: "bot",
                text: res.result.answer,
            };

            setMessages((m) => [...m, botMsg]);

        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : "No reply came back. Try again."
            );
        } finally {
            setSending(false);
        }

    }

    function handleNewChat() {
        setMessages([]);
        setError(null);
    }

    if (!ready) return null;

    return (
        <main className="flex h-screen bg-cream text-ink">
            {/* left rail */}
            <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-paper/60 px-5 py-6 sm:flex">
                <button
                    onClick={() => navigate("/characters")}
                    className="flex items-center gap-2 text-sm text-inkSoft transition-colors hover:text-ink"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M15 5l-7 7 7 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className="font-display text-base italic">CHAT·BOT</span>
                </button>

                <div className="mt-auto flex items-center gap-3 border-t border-line pt-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lilacSoft font-display text-sm text-lilacDeep">
                        {userName.charAt(0).toUpperCase()}
                    </span>
                    <span className="flex-1 truncate text-sm font-semibold">{userName}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-inkSoft">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </aside>

            {/* center conversation */}
            <section className="flex min-w-0 flex-1 flex-col">
                <header className="flex flex-col items-center gap-1 border-b border-line py-4">
                    <div className="flex items-center gap-2 sm:hidden">
                        <button onClick={() => navigate("/characters")} aria-label="Back">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <span className="font-display text-lg italic text-ink">{character.name}</span>
                    <span className="text-xs text-inkSoft">
                        Chat with {character.name}, {character.title.toLowerCase()}
                    </span>
                </header>

                <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 sm:px-10">
                    <div className="mx-auto flex max-w-xl flex-col gap-4">
                        {messages.length === 0 && (
                            <div className="flex items-end gap-2.5">
                                <div className="h-12 w-15 shrink-0 overflow-hidden rounded-full">
                                    <Character
                                        size={48}
                                        className="shrink-0"
                                    />
                                </div>
                                <div className="max-w-[70%] rounded-3xl rounded-tl-md bg-paper px-5 py-3 text-sm leading-relaxed text-ink shadow-sm">
                                    Say hello — {character.name} is just on the other side of this.
                                </div>
                            </div>
                        )}
                        {messages.map((m) => (
                            <ChatBubble key={m.id} message={m} />
                        ))}
                        {sending && (
                            <div className="flex items-end gap-2.5">
                                <div className="h- 12 w-12 shrink-0 overflow-hidden rounded-full">
                                    <Character
                                        size={48}
                                        className="shrink-0"
                                    />
                                </div>
                                <div className="flex items-center gap-1 rounded-3xl rounded-tl-md bg-paper px-5 py-3 shadow-sm">
                                    <div className="flex items-center gap-1">
                                        <span
                                            className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                                            style={{ animationDelay: "0s" }}
                                        />
                                        <span
                                            className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                                            style={{ animationDelay: "0.15s" }}
                                        />
                                        <span
                                            className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                                            style={{ animationDelay: "0.3s" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <p role="alert" className="px-6 pb-1 text-center text-xs text-blushDeep">
                        {error}
                    </p>
                )}

                <div className="border-t border-line px-6 py-4 sm:px-10">
                    <div className="mx-auto flex max-w-xl items-center gap-2 rounded-full border border-line bg-paper px-4 py-2">
                        <button
                            type="button"
                            aria-label="Add attachment"
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-inkSoft transition-colors hover:bg-lilacSoft hover:text-ink"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder={`Message ${character.name}…`}
                            className="w-full bg-transparent font-body text-sm text-ink placeholder:text-inkSoft/70 focus:outline-none"
                        />
                        <button
                            onClick={handleSend}
                            disabled={sending || !input.trim()}
                            aria-label="Send message"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-transform disabled:opacity-30 enabled:hover:scale-105"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <p className="mt-2 text-center text-[11px] text-inkSoft/70">
                        {character.name} is an AI character — replies are for roleplay and may not be accurate.
                    </p>
                </div>
            </section>

            {/* right panel */}
            <aside className="hidden w-64 shrink-0 flex-col border-l border-line bg-paper/60 px-5 py-6 md:flex">
                <button
                    onClick={handleNewChat}
                    className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors hover:bg-white"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    New chat
                </button>

                <p className="mt-8 text-center text-xs text-inkSoft/70">
                    Your conversations will appear here.
                </p>
            </aside>
        </main>
    );
}
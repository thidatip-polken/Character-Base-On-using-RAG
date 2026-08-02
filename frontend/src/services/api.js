import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

export const login = async (username) => {
    const res = await api.post("/chat-bot/", {
        username,
    });

    return res.data;
};

export const selectCharacter = async (character) => {
    console.log(`character is ${character}`);
    const res = await api.post("/chat-bot/character", {
        character_name: character,
    });

    return res.data;
};

export const askQuestion = async (character, question) => {
    const res = await api.post("/chat-bot/chat", {
        character_name: character,
        question,
    });
    
    return res.data;
};

export default api;
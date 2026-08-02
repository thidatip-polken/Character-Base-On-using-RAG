import LoginPage from "./pages/LoginPage";
import CharacterPage from "./pages/CharacterPage";
import ChatPage from "./pages/ChatPage";

import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter basename="/Character-Base-On-using-RAG">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/characters" element={<CharacterPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}
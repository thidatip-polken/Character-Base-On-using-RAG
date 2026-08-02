import Character from "./Character";

export default function ChatBubble({ message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[70%] rounded-3xl rounded-tr-md bg-blush px-5 py-3">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2.5">
      <div className="shrink-0">
        <Character size={48} />
      </div>

      <div className="max-w-[70%] rounded-3xl rounded-tl-md bg-paper px-5 py-3">
        {message.text}
      </div>
    </div>
  );
}
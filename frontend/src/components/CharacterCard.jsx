import Character from "./Character";

export default function CharacterCard({
  character,
  onChoose,
}) {
  const { name, available } = character;

  return (
    <button
      type="button"
      disabled={!available}
      onClick={() => available && onChoose(character)}
      className={`group flex flex-col items-center gap-3 ${
        available
          ? "cursor-pointer"
          : "cursor-not-allowed opacity-70"
      }`}
    >
      <div
        className={`relative flex h-36 w-36 items-center justify-center rounded-full transition duration-300 ${
          available
            ? "group-hover:-translate-y-2"
            : ""
        }`}
      >
        {available ? (
          <Character
            size={140}
            decorated={false}
          />
        ) : (
          <div className="h-36 w-36 rounded-full bg-gray-300" />
        )}
      </div>

      {available ? (
        <span className="text-lg font-display text-gray-800">
          {name}
        </span>
      ) : (
        <span className="text-sm font-body text-gray-400 uppercase">
          Locked
        </span>
      )}
    </button>
  );
}
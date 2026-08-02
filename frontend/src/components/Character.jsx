import characterImg from "../assets/Rafayel.png";

export default function Character({
  size = 350,
  decorated = false,
  className = "",
}) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* วงกลมพื้นหลัง */}
      <div
        className="absolute rounded-full bg-[#c7c7ff]"
        style={{
          width: size,
          height: size,
        }}
      />

      {/* รูป */}
      <div
        className="relative z-10 overflow-hidden rounded-full shadow-xl"
        style={{
          width: size * 0.85,
          height: size * 0.85,
        }}
      >
        <img
          src={characterImg}
          alt="Character"
          className="h-full w-full object-cover"
        />
      </div>

      {decorated && (
        <>
          <div className="absolute left-4 top-10 text-6xl text-yellow-300">
            ✦
          </div>

          <div className="absolute right-6 top-6 text-4xl text-yellow-300">
            ☾
          </div>

          <div className="absolute right-0 bottom-16 h-10 w-10 rounded-full bg-[#9d8ab5]" />
          <div className="absolute right-16 bottom-10 h-12 w-12 rounded-full bg-[#9d8ab5]" />

          <div className="absolute bottom-12 left-2 h-12 w-6 rounded-full bg-pink-300" />
          <div className="absolute bottom-10 left-10 h-14 w-7 rounded-full bg-pink-200" />

          <div className="absolute right-28 top-20 text-green-400">✦</div>
          <div className="absolute bottom-10 left-12 text-cyan-400">✦</div>
        </>
      )}
    </div>
  );
}
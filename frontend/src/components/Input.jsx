export default function Input({ label, type, placeholder }) {
  return (
    <div>
      <label className="mb-2 block font-medium">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
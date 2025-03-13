export const Input = ({ type = "text", value, onChange, placeholder }) => {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border px-3 py-2 rounded-md w-full"
      />
    );
  };
  
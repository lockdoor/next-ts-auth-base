import React from "react";

interface Props {
  label: string;
  value: string;
  type: string;
  setValue: (value: string) => void;
}

const Input = ({ label, value, type, setValue }: Props) => {
  return (
    <div className="my-3">
      <label className="block">{label}:</label>
      <input
        type={type}
        className="border-b w-full outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default Input;

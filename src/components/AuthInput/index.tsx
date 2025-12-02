import styles from "./AuthInput.module.css";

interface AuthInputProps {
  label: string;
  name: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AuthInput({
  label,
  name,
  type = "text",
  onChange,
}: AuthInputProps) {
  return (
    <div className={styles.group}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} onChange={onChange} />
    </div>
  );
}

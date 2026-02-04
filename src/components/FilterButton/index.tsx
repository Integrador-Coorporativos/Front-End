import MenuIcon from '@mui/icons-material/Menu';
import styles from "./FilterButton.module.css";

// 1. Atualizamos a "receita" do componente
interface FilterButtonProps {
  text: string;
  options: string[];
  onSelect: (value: string) => void;
}

export default function FilterButton({ text, options = [], onSelect }: FilterButtonProps) {
  return (
    <div className={styles.filterWrapper}>
      <MenuIcon 
        className={styles.icon}
        sx={{ color: "black", fontSize: 20 }}
      />
      <select 
        className={styles.buttonFilter} 
        onChange={(e) => onSelect(e.target.value)}
        defaultValue="Todos"
      >
        <option value="Todos">{text}</option> 
        {/* Adicionamos a proteção aqui: options? ou options || [] */}
        {options && options.length > 0 && options
          .filter(o => o !== "Todos")
          .map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
      </select>
    </div>
  );
}
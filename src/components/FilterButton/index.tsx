import MenuIcon from '@mui/icons-material/Menu';
import styles from "./FilterButton.module.css";

interface FilterButtonProps {
    text: string;
    onClick?: () => void; 
}

export default function FilterButton({ text, onClick }: FilterButtonProps) {
    return (
        <button 
            className={styles.buttonFilter} 
            onClick={onClick}
            type="button" 
        >
            <MenuIcon 
                sx={{
                    color: "black",
                    fontSize: 20 
                }}
            />
            <span className={styles.text}>{text}</span>
        </button>
    );
}
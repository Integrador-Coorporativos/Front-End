import MenuIcon from '@mui/icons-material/Menu';
import styles from "./FilterButton.module.css";

interface FilterButtonProps {
    text: string;
}

export default function FilterButton({ text }: FilterButtonProps) {
    return (
        <button className={styles.buttonFilter}>
            <MenuIcon 
                sx = {{
                    color: "black"
                }}
            />
            <span className={styles.text}>{text}</span>
        </button>
    );
}

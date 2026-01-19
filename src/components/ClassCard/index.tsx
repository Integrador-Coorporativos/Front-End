import { useState } from "react";
import styles from "./ClassCard.module.css";

interface ClassCardProps {
    anoReferencia: string;
    ano: string;
    curso: string;
    turno: string;
}

export default function ClassCard({ anoReferencia, ano, curso, turno }: ClassCardProps) {
    const [selected, setSelected] = useState(false);

    return (
        <div 
            className={`${styles.card} ${selected ? styles.selected : ""}`}
            onClick={() => setSelected(!selected)}
        >
            <div className={styles.info}>
                <div>
                    <span className={styles.label}>Ano Referência</span>
                    <p className={styles.value}>{anoReferencia}</p>
                </div>

                <div>
                    <span className={styles.label}>Curso</span>
                    <p className={styles.value}>{curso}</p>
                </div>

                <div>
                    <span className={styles.label}>Ano</span>
                    <p className={styles.value}>{ano}</p>
                </div>

                <div>
                    <span className={styles.label}>Turno</span>
                    <p className={styles.value}>{turno}</p>
                </div>
            </div>

            <div className={`${styles.circle} ${selected ? styles.circleSelected : ""}`} />
        </div>
    );
}

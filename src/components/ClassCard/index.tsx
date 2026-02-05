import styles from "./ClassCard.module.css";

interface ClassCardProps {
    anoReferencia: string;
    ano: string;
    curso: string;
    turno: string;
    isSelected?: boolean; // Agora o pai decide se está selecionado
    onSelect?: () => void; // Evento de clique passado pelo pai
}

export default function ClassCard({ 
    anoReferencia, 
    ano, 
    curso, 
    turno, 
    isSelected = false, 
    onSelect 
}: ClassCardProps) {

    return (
        <div 
            className={`${styles.card} ${isSelected ? styles.selected : ""}`}
            onClick={onSelect}
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

            <div className={`${styles.circle} ${isSelected ? styles.circleSelected : ""}`}/>
        </div>
    );
}

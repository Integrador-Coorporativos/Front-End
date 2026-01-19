import styles from "./ListClassCard.module.css";

interface ListClassCardProps {
    anoReferencia: string;
    ano: string;
    curso: string;
    turno: string;
}

export default function ListClassCard({ anoReferencia, ano, curso, turno }: ListClassCardProps) {

    return (
        <div 
            className={styles.card}>
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

        </div>
    );
}

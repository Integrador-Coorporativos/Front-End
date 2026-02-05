import styles from "./ListClassCard.module.css";

interface ListClassCardProps {
    anoReferencia: string;
    ano: string;
    curso: string;
    turno: string;
}

export default function ListClassCard({ anoReferencia, ano, curso, turno }: ListClassCardProps) {
    const cleanValue = (val: string) => (val === "string" || !val ? "---" : val);

    return (
        <div className={styles.card}>
            <div className={styles.info}>
                <div className={styles.item}>
                    <span className={styles.label}>Ano Referência</span>
                    <p className={styles.value}>{cleanValue(anoReferencia)}</p>
                </div>

                <div className={styles.item}>
                    <span className={styles.label}>Curso</span>
                    <p className={`${styles.value} ${styles.curso}`}>{cleanValue(curso)}</p>
                </div>

                <div className={styles.item}>
                    <span className={styles.label}>Ano/Semestre</span>
                    <p className={styles.value}>{cleanValue(ano)}</p>
                </div>

                <div className={styles.item}>
                    <span className={styles.label}>Turno</span>
                    <p className={styles.value}>{cleanValue(turno)}</p>
                </div>
            </div>
        </div>
    );
}
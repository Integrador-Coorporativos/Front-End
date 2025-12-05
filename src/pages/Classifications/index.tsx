import Header from "../../components/Header";
import BreadCrumb from "../../components/BreadCrumb";
import styles from "./Classification.module.css";

import Phone from "../../assets/logo-phone.png";
import Participation from "../../assets/participation-icon.png";
import Performance from "../../assets/perfomance-icon.png";
import Frequency from "../../assets/frequency-icon.png";
import Uniform from "../../assets/uniform-icon.png";
import Behavior from "../../assets/behavior-icon.png";

export default function Classifications () {
    const cards = [
        { title: "Uso do Celular", icon: Phone },
        { title: "Participação", icon: Participation },
        { title: "Desempenho", icon: Performance },
        { title: "Frequência", icon: Frequency },
        { title: "Fardamento", icon: Uniform },
        { title: "Comportamento", icon: Behavior }
    ];

    return (
        <div>
            <Header />
            <div style={{ width: "100%", padding: "3px 0" }}>
                <BreadCrumb items={[
                    { label: "Página Inicial", to: "/" },
                    { label: "Classificações", to: "/classificacoes" }
                ]} />
            </div>
            <div className={styles.highlightsContainer}>
                <h2 className={styles.title}>Destaques</h2>
                <div className={styles.grid}>
                    {cards.map((item, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <img src={item.icon} alt={`${item.title}-icon`} className={styles.cardIcon} />
                                <strong className={styles.cardTitle}>{item.title}</strong>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.cardSubtitle}>
                                    Informática 4 Vespertino
                                </span>
                                <span className={styles.cardNota}>5.0</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.classificationContainer}>
                <div className={styles.box}>
                <h2 className={styles.sectionTitle}>Classificações</h2>
                    <div className={styles.topBar}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Buscar por turmas..."
                        />
                        <div className={styles.filters}>
                            <span className={styles.filterLabel}>Filtrar por:</span>

                            <select className={styles.select}>
                                <option>Curso</option>
                            </select>
                            <select className={styles.select}>
                                <option>Período</option>
                            </select>
                        </div>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Curso</th>
                                <th>Turno</th>
                                <th>Período</th>
                                <th>Frequência</th>
                                <th>Fardamento</th>
                                <th>Participação</th>
                                <th>Desempenho</th>
                                <th>Celular</th>
                                <th>Comportamento</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1,2,3,4,5,6].map((item, idx) => (
                                <tr key={idx}>
                                    <td>{idx+1}</td>
                                    <td>Informática</td>
                                    <td>Vespertino</td>
                                    <td>4º</td>
                                    <td>5.0</td>
                                    <td>5.0</td>
                                    <td>5.0</td>
                                    <td>5.0</td>
                                    <td>5.0</td>
                                    <td>5.0</td>
                                    <td>5.0</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className={styles.pagination}>
                        <button>{'<'}</button>
                        <button className={styles.active}>1</button>
                        <button>2</button>
                        <button>3</button>
                        <span>…</span>
                        <span>Página 3</span>
                        <button>8</button>
                        <button>9</button>
                        <button>{'>'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

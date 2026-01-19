import Header from "../../components/Header";
import BreadCrumb from "../../components/BreadCrumb";
import styles from "./DetailsClass.module.css";
import { useState } from "react";

import Phone from "../../assets/logo-phone.png";
import Participation from "../../assets/participation-icon.png";
import Performance from "../../assets/perfomance-icon.png";
import Frequency from "../../assets/frequency-icon.png";
import Uniform from "../../assets/uniform-icon.png";
import Behavior from "../../assets/behavior-icon.png";
import Footer from "../../components/Footer";

type Avaliacao = {
  frequencia: number;
  participacao: number;
  fardamento: number;
  desempenho: number;
  comportamento: number;
  usoCelular: number;
};

type RatingProps = {
  label: string;
  campo: keyof Avaliacao;
};

export default function Classifications() {
  const cards = [
    { title: "Uso do Celular", icon: Phone },
    { title: "Participação", icon: Participation },
    { title: "Desempenho", icon: Performance },
    { title: "Frequência", icon: Frequency },
    { title: "Fardamento", icon: Uniform },
    { title: "Comportamento", icon: Behavior }
  ];

  const [activeTab, setActiveTab] = useState<"avaliar" | "grafico">("avaliar");
  const [selectedYear, setSelectedYear] = useState("2025");
  const years = ["2022", "2023", "2024", "2025"];

  const [avaliacao, setAvaliacao] = useState<Avaliacao>({
    frequencia: 0,
    participacao: 0,
    fardamento: 0,
    desempenho: 0,
    comportamento: 0,
    usoCelular: 0,
  });

  const handleSelect = (campo: keyof Avaliacao, valor: number) => {
    setAvaliacao(prev => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const Rating = ({ label, campo }: RatingProps) => (
    <div className={styles.ratingGroup}>
      <span className={styles.label}>{label}</span>
      <div className={styles.buttons}>
        {[1, 2, 3, 4, 5].map(num => (
          <button
            key={num}
            className={`${styles.button} ${
              avaliacao[campo] === num ? styles.active : ""
            }`}
            onClick={() => handleSelect(campo, num)}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
    return (
        <div>
            <Header />
            <div style={{ width: "100%", padding: "3px 0" }}>
                <BreadCrumb items={[
                    { label: "Página Inicial", to: "/" },
                    { label: "Classificações", to: "/classificacoes" },
                    {label: "Detalhes da Turma", to: "/detalhes_turma"}
                ]} />
            </div>

            <div className={styles.container}>
                <h2 className={styles.titledc}>Detalhes da Turma</h2>
                <p className={styles.subtitledc}>Informática 4º Vespertino <b>#1</b></p>

                <div className={styles.cardsGrid}>
                    {cards.map((card, index) => (
                        <div key={index} className={styles.card}>
                            <img src={card.icon} alt={card.title} />
                            <div className={styles.cardInfo}>
                                <span className={styles.cardTitle}>{card.title}</span>
                                <strong className={styles.cardScore}>5.0</strong>
                            </div>
                            <span className={styles.rank}>#1</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.switchContainer}>
                <div className={styles.switchButtons}>
                    <button
                        className={activeTab === "grafico" ? styles.active : ""}
                        onClick={() => setActiveTab("grafico")}
                    >
                        Gráfico de Desempenho
                    </button>

                    <button
                        className={activeTab === "avaliar" ? styles.active : ""}
                        onClick={() => setActiveTab("avaliar")}
                    >
                        Avaliar
                    </button>
                </div>

                {activeTab === "grafico" && (
                    <div className={styles.graphContainer}>
                        <div className={styles.filters}>
                            <button className={styles.filterActive}>Geral</button>
                            {years.map((year) => (
                                <button
                                    key={year}
                                    className={
                                        selectedYear === year
                                            ? styles.filterActive
                                            : ""
                                    }
                                    onClick={() => setSelectedYear(year)}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>

                        <div className={styles.graphPlaceholder}>
                            <p className={styles.graphdeleteafter}>Gráfico de desempenho ({selectedYear})</p>
                        </div>
                    </div>
                )}

                {activeTab === "avaliar" && (
                <div className={styles.evaluateContainer}>
                  <h3 className={styles.h3_evaluation_class}>Avalie a turma Informática - 4 - V</h3>

                  <div className={styles.grid}>
                    <Rating label="Frequência" campo="frequencia" />
                    <Rating label="Fardamento" campo="fardamento" />
                    <Rating label="Participação" campo="participacao" />
                    <Rating label="Desempenho" campo="desempenho" />
                    <Rating label="Comportamento" campo="comportamento" />
                    <Rating label="Uso de Celular" campo="usoCelular" />
                  </div>

                  <div className={styles.actions}>
                    <button className={styles.cancel}>Cancelar</button>
                    <button className={styles.confirm}>Confirmar</button>
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.commentsContainer}>
            <h3 className={styles.commentsTitle}>Comentários</h3>

            <p className={styles.commentsClass}>
              Informática 4 Vespertino
            </p>

            <div className={styles.commentsList}>
              <div className={styles.commentItem}>
                <strong>Sergio Pérez</strong>
                <span>21 nov. de 2025</span>
                <p>Turma muito participativa.</p>
              </div>

              <div className={styles.commentItem}>
                <strong>Ana Silva</strong>
                <span>22 nov. de 2025</span>
                <p>Bom desempenho geral, mas precisam melhorar a frequência.</p>
              </div>
            </div>

            <div className={styles.newComment}>
              <input type="text" placeholder="Adicionar comentário..." />
              <button className={styles.postButton}>Postar</button>
            </div>
          </div>
            <Footer />
        </div>
    );
}

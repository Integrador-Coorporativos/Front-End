import Logo from "../../assets/logo-if-footer.png";
import InstagramLogo from "../../assets/logo-insta-footer.png";
import GoogleSalaLogo from "../../assets/logo-gsa-footer.png";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.left}>
                <p className={styles.sadt}>SADT</p>
                <p className={styles.subtitulo}>Sistema de Avaliação e<br />Desempenho de Turmas</p>

                <div className={styles.ifRow}>
                    <img src={Logo} alt="Logo IFRN" className={styles.logo} />
                    <div className={styles.ifText}>
                        <p>Instituto Federal do Rio Grande do Norte<br/>Campus Pau dos Ferros</p>
                    </div>
                </div>
            </div>
            <div className={styles.links}>
                <h4>Links Úteis</h4>
                <a href="https://www.instagram.com/ifrnpaudosferros/" target="blank">
                    <div className={styles.linkItem_1}>
                        <img src={InstagramLogo} alt="Instagram" />
                        <p className={styles.Insta_p}>Instagram</p>
                    </div>
                </a>
                <a href="https://classroom.google.com/" target="blank">
                    <div className={styles.linkItem_2}>        
                        <img src={GoogleSalaLogo} alt="Google Sala de Aula" />
                        <p>Google Sala de Aula</p>
                    </div>
                </a>
            </div>
            <div className={styles.right}>
                <a href="#top" className={styles.backToTop}>Voltar ao Topo</a>
                <p>Todos os direitos reservados © 2025</p>
            </div>
        </footer>
    );
}

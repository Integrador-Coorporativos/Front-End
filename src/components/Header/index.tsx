import Logo from "../../assets/logo-if.png";
import Perfil from "../../assets/perfil.png";
import styles from "./Header.module.css";

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <img className={styles.logo} src={Logo} alt="Logo do IF" />
                <span className={styles.title}> SADT </span>
            </div>

            <div className={styles.right}>
                <nav className={styles.nav}>
                    <a href="/minhas-turmas">Minhas Turmas</a>
                    <a href="/classificacoes">Classificações</a>
                </nav>

                <div className={styles.profile}>
                    <img className={styles.avatar} src={Perfil} alt="User" />
                </div>
            </div>
        </header>
    );
}

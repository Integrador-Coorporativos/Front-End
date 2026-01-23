import Logo from "../../assets/logo-if.png";
import Perfil from "../../assets/perfil.png";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";


export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.contentHeader}>
                <div className={styles.left}>
                    <Link to="/">
                        <img className={styles.logo} src={Logo} alt="Logo do IF" />
                    </Link>
                        <span className={styles.title}> SADT </span>
                </div>

                <div className={styles.right}>
                    <nav className={styles.nav}>
                        <Link to="/minhas-turmas">Minhas Turmas</Link>
                        <Link to="/">Classificações</Link>
                    </nav>

                    <div className={styles.profile}>
                        <img className={styles.avatar} src={Perfil} alt="User" />
                    </div>
                </div>
            </div>
        </header>
    );
}

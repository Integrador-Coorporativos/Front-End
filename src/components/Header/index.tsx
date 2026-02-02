import { useState, useRef, useEffect } from "react";
import Logo from "../../assets/logo-if.png";
import Perfil from "../../assets/perfil.png";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { Users, BarChart3, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface UserToken {
  name: string;
  email: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserToken | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Referência para o input de arquivo escondido
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded: UserToken = jwtDecode(token);
        setUserData(decoded);
      } catch (e) {
        console.error("Erro ao decodificar token:", e);
        setUserData({ name: "Usuário IF", email: "usuario@ifrn.edu.br" });
      }
    } else {
      setUserData({ name: "Usuário IF", email: "usuario@ifrn.edu.br" });
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Função para abrir o seletor de arquivos
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Arquivo selecionado:", file.name);
      // Aqui você implementaria o upload para o servidor futuramente
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.contentHeader}>
        <div className={styles.left}>
          <Link to="/">
            <img className={styles.logo} src={Logo} alt="Logo do IF" />
          </Link>
          <span className={styles.title}>SADT</span>
        </div>

        <div className={styles.right}>
          <nav className={styles.nav}>
            <Link to="/minhas-turmas">Minhas Turmas</Link>
            <Link to="/">Classificações</Link>
          </nav>

          <div className={styles.profileContainer} ref={menuRef}>
            <div className={styles.profile} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <img className={styles.avatar} src={Perfil} alt="User" />
            </div>

            {isMenuOpen && (
              <div className={styles.dropdown}>
                <div className={styles.userHeader}>
                  {/* Container da foto com overlay para trocar */}
                  <div className={styles.avatarWrapper} onClick={handleAvatarClick}>
                    <img src={Perfil} alt="User" className={styles.menuAvatar} />
                    <div className={styles.avatarOverlay}>Trocar</div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange}
                      accept="image/*"
                      style={{ display: 'none' }} 
                    />
                  </div>
                  
                  <div className={styles.userInfo}>
                    <p className={styles.userName}>{userData?.name}</p>
                    <p className={styles.userEmail}>{userData?.email}</p>
                  </div>
                </div>
                
                <div className={styles.divider} />

                <ul className={styles.menuList}>
                  <li><Link to="/"><BarChart3 size={18} /> Classificações</Link></li>
                  <li><Link to="/minhas-turmas"><Users size={18} /> Minhas Turmas</Link></li>
                  <li><Link to="/painel_controle"><LayoutDashboard size={18} /> Painel de Controle</Link></li>
                  <li><Link to="/alterar-dados"><Settings size={18} /> Alterar dados</Link></li>
                  <li className={styles.logout}><Link to="/sair"><LogOut size={18} /> Sair</Link></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
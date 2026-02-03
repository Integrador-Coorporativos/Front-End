import { useState, useRef, useEffect } from "react";
import Logo from "../../assets/logo-if.png";
import Perfil from "../../assets/perfil.png";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { Users, BarChart3, LayoutDashboard, Settings, LogOut } from "lucide-react";
import keycloak from "@/api/config/keycloak";
import { envConfig } from "@/api/config/env";
import { useUploadImage } from "@/hooks/processing/useUploadImage";

interface UserToken {
  name: string;
  email: string;
  type_user: string;
  picture?: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserToken | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { upload, isLoading } = useUploadImage();

  useEffect(() => {
    if (keycloak.authenticated) {

      const token = keycloak.tokenParsed;

      if (token) {
        const roles = token.realm_access?.roles || [];
        
        // Definindo a hierarquia: Admin > Professor > Aluno
        const userRole = roles.includes('ROLE_ADMIN') 
          ? 'Administrador'
          : roles.includes('ROLE_PROFESSOR') 
            ? 'Professor' 
            : roles.includes('ROLE_ALUNO') 
              ? 'Aluno' 
              : 'Usuário';

        const profileImg = token.picture 
        ? `${envConfig.minio.minioBaseUrl}/${envConfig.minio.minioImageBucket}/${token.picture}` 
        : Perfil;
        setUserData({
          name: token.name || '',
          email: token.email || '',
          type_user: userRole,
          picture: profileImg
        });
      }
    }
  }, [keycloak.authenticated, keycloak.tokenParsed]);
  
  // Referência para o input de arquivo escondido
  const fileInputRef = useRef<HTMLInputElement>(null);

  

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

const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const result = await upload(file);

  if (result.success) {
    setUserData(prev => prev ? { ...prev, picture: result.newUrl } : null);
    // Opcional: toast de sucesso
  } else {
    // Opcional: toast de erro
  }
};

const handleLogout = (e: React.MouseEvent) => {
  e.preventDefault();
  console.log(userData);
  keycloak.logout({ redirectUri: window.location.origin });
};

const handleUpdateProfile = (e: React.MouseEvent) => {
  e.preventDefault();
  keycloak.accountManagement();
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
              <img 
                className={styles.avatar} 
                src={userData?.picture || Perfil} 
                alt="User" 
              />
            </div>

            {isMenuOpen && (
              <div className={styles.dropdown}>
                <div className={styles.userHeader}>
                  {/* Container da foto com overlay para trocar */}
                  <div className={styles.avatarWrapper} onClick={handleAvatarClick}>
                    <img 
                      className={styles.avatar} 
                      src={userData?.picture || Perfil} 
                      alt="User" 
                    />
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
                    <li>
                      <Link to="/"><BarChart3 size={18} /> Classificações</Link>
                    </li>
                    {userData?.type_user === 'Professor' && (
                      <li>
                        <Link to="/minhas-turmas"><Users size={18} /> Minhas Turmas</Link>
                      </li>
                    )}
                    {userData?.type_user === 'Administrador' && (
                      <li>
                        <Link to="/painel_controle"><LayoutDashboard size={18} /> Painel de Controle</Link>
                      </li>
                    )}
                    <li>
                      <Link to="#" onClick={handleUpdateProfile}>
                        <Settings size={18} /> Alterar dados
                      </Link>
                    </li>
                    <li className={styles.logout}>
                      <Link to="#" onClick={handleLogout}>
                        <LogOut size={18} /> Sair
                      </Link>
                    </li>
                  </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
import { useState, useRef, useEffect } from "react";
import Logo from "../../assets/logo-if.png";
import Perfil from "../../assets/perfil.png";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { Users, BarChart3, LayoutDashboard, Settings, LogOut, Shuffle } from "lucide-react";
import keycloak from "@/api/config/keycloak";
import { useUploadImage } from "@/hooks/processing/useUploadImage";
import { useAuthUser } from "@/hooks/useAuthUser";
import { type AuthUser } from "@/api/types/auth";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<AuthUser | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { upload, isLoading } = useUploadImage();
  const auth = useAuthUser();

  useEffect(() => {
  if (auth) {
    setUserData(auth);
  }
}, [auth]);



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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const result = await upload(file);

  if (result.success) {
    setUserData(prev => {
      if (!prev) return null;
      
      return { 
        ...prev, 
        picture: `${result.newUrl}?t=${new Date().getTime()}` 
      };
    });
  
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

  const getFirstName = (fullName: string | undefined) => {
    if (!fullName) return "Usuário";
    return fullName.split(" ")[0];
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
          <span className={styles.welcomeText}>
            Olá, <strong>{getFirstName(userData?.name)}</strong>
          </span>

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
                      <Link to="/classificacoes"><BarChart3 size={18} /> Classificações</Link>
                    </li>
                    {userData?.roleLabel === 'Professor' || userData?.roleLabel === 'Administrador' && (
                      <li>
                        <Link to="/minhas-turmas"><Users size={18} /> Minhas Turmas</Link>
                      </li>
                    )}
                    {userData?.roleLabel === 'Professor' || userData?.roleLabel === 'Administrador' && (
                      <li>
                        <Link to="/selecionar-turmas"><Shuffle size={18} /> Alterar Turmas</Link>
                      </li>
                    )}
                    {userData?.roleLabel === 'Administrador' && (
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
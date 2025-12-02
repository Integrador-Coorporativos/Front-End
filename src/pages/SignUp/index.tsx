import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import styles from "./SignUp.module.css";

import AuthButton from "../../components/Button";
import AuthInput from "../../components/AuthInput";
import Logo from "../../assets/logo-if.png";

export default function Cadastro() {
  const [form, setForm] = useState({
    matricula: "",
    senha: "",
    repetirSenha: "",
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log(form);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <div className={styles.logoArea}>
            <img className={styles.imagePlaceholder} src={Logo} alt="Logo do IF" />
          </div>
          <p className={styles.systemName}>
            Sistema de<br />
            Avaliação e<br />
            Desempenho<br />
            de Turmas<br />
            SADT
          </p>
        </div>
        <div className={styles.rightSide}>
          <h1 className={styles.h1MakeYourRegis}>Faça seu cadastro</h1>
          <p className={styles.subText}>
            Informe seus dados corretamente para se cadastrar no SADT
          </p>
          <hr className={styles.divider} />
          <form className={styles.form} onSubmit={handleSubmit}>
            <AuthInput label="Matricula:" name="matricula" onChange={handleChange} />
            <AuthInput label="Senha:" name="senha" type="password" onChange={handleChange} />
            <AuthInput
              label="Repetir Senha:"
              name="repetirSenha"
              type="password"
              onChange={handleChange}
            />
            <AuthButton text="Cadastrar" />
          </form>
        </div>
      </div>
    </div>
  );
}

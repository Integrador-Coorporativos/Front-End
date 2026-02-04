import styles from "./StatTile.module.css";

import AlunosIcon from "../../assets/alunos.png";
import AprovadosIcon from "../../assets/aprovados.png";
import MediaIcon from "../../assets/media.png";
import ReprovadosIcon from "../../assets/reprovados.png";

type Icon = "alunos" | "aprovados" | "media" | "reprovados";

type Props = {
  icon: Icon;
  label: string;
  value: string;
};

function IconBox({ icon }: { icon: Icon }) {
  const map: Record<Icon, string> = {
    alunos: AlunosIcon,
    aprovados: AprovadosIcon,
    media: MediaIcon,
    reprovados: ReprovadosIcon,
  };

  return (
    <div className={styles.icon}>
      <img src={map[icon]} alt={icon} />
    </div>
  );
}

export default function StatTile({ icon, label, value }: Props) {
  return (
    <div className={styles.tile}>
      <IconBox icon={icon} />

      <div className={styles.meta}>
        <span className={styles.label}>{label}</span>
        <strong className={styles.value}>{value}</strong>
      </div>
    </div>
  );
}

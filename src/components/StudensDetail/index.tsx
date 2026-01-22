import style from "./StudentsDetail.module.css";

interface StudensDetailProps {
  nomeCompleto: string;
  indiceRendimentoAcademico: number;
  matricula: string;
  numReprovacoes: number;
  frequencia: number;
  situacao: "Ótimo" | "Bom" | "Ruim";
}

export default function StudentsDetail({
  nomeCompleto,
  indiceRendimentoAcademico,
  matricula,
  numReprovacoes,
  frequencia,
  situacao,
}: StudensDetailProps) {
  return (
    <div className={style.card}>
      <div className={style.item}>
        <span className={style.label}>Nome:</span>
        <span className={style.value} title={nomeCompleto}>
          {nomeCompleto}
        </span>
      </div>

      <div className={style.item}>
        <span className={style.label}>I.R.A:</span>
        <span className={style.value}>
          {indiceRendimentoAcademico.toFixed(2)}
        </span>
      </div>

      <div className={style.item}>
        <span className={style.label}>Matrícula:</span>
        <span className={style.value} title={matricula}>
          {matricula}
        </span>
      </div>

      <div className={style.item}>
        <span className={style.label}>Reprovações:</span>
        <span className={style.value}>{numReprovacoes}</span>
      </div>

      <div className={style.item}>
        <span className={style.label}>Frequência:</span>
        <span className={style.value}>
          {frequencia.toFixed(2)} %
        </span>
      </div>

      <div
        className={`${style.item} ${
          situacao === "Ruim"
            ? style.ruim
            : situacao === "Bom"
            ? style.bom
            : style.otimo
        }`}
      >
        <span className={style.label}>Situação:</span>
        <span className={style.status}>{situacao}</span>
      </div>
    </div>
  );
}

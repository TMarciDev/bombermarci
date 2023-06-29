import { PlayerInfo } from "@backend/types/ClientSliceTypes";
import React from "react";
import styles from "./style.module.scss";
import { useGetCurrentPlayer } from "../../../app/hooks";

interface InfoProps {
  info: PlayerInfo;
}

const Stat = ({ info }: InfoProps) => {
  const currentPlayer = useGetCurrentPlayer();
  const isMe = currentPlayer.number === info.number;
  return (
    <div
      className={`${styles.statContainer} ${info.health <= 0 && styles.dead}`}
      style={{
        border: `4px solid ${info.color}`,
      }}
    >
      <b>
        {info.name}
        {isMe && " (YOU)"}
      </b>
      {info.health > 0 &&
        [...Array(info.health)].map(() => {
          return " ❤️ ";
        })}
    </div>
  );
};

export default React.memo(Stat);

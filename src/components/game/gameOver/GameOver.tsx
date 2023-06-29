import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSmartSession } from "../../../storageHook";
import { useGetStats } from "../../../app/hooks";
import FrogIdle from "../frog/FrogIdle";
import { useEffect } from "react";
import styles from "./style.module.scss";
import { PossibleColors } from "../../../types/Colors";

const GameOver = () => {
  useSmartSession();
  const location = useLocation();
  const navigate = useNavigate();
  const stats = useGetStats();
  let stat = stats[location.state];

  useEffect(() => {
    if (location.state === null) {
      navigate("/", { replace: true });
    } else {
    }
  }, [location.state, navigate]);

  return location.state !== null ? (
    location.state !== "-1" ? (
      <div className={`${styles.box}`}>
        <h1 className={`${styles.name}`}>WINNER:</h1>
        <FrogIdle
          color={stat.color as PossibleColors}
          size={300}
          border={false}
        />
        <span className={`${styles.name}`}>⭐⭐⭐ {stat.name} ⭐⭐⭐</span>
        <Link to="/">Back to home</Link>
      </div>
    ) : (
      <div className={`${styles.box}`}>
        <div className={`${styles.draw}`}>DRAW</div>
        <Link to="/">Back to home</Link>
      </div>
    )
  ) : null;
};

export default GameOver;

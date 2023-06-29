import { useAppDispatch } from "../../../app/hooks";
import Stat from "./Stat";
import { useGetStatsQuery } from "../../../app/services/stats";

import { getResult, isLoaded } from "../../_socket_utils/dataHandler";
import { LoadedData } from "../../../types/DataHandleType";
import { PlayerInfo } from "@backend/types/ClientSliceTypes";
import React, { useEffect } from "react";
import { updateStats } from "./statsSlice";

import styles from "./style.module.scss";

const Stats = () => {
  const dispatch = useAppDispatch();

  const { data } = useGetStatsQuery();
  const ready = isLoaded(data);
  const result = getResult(data as LoadedData<PlayerInfo[]>);

  useEffect(() => {
    if (ready) {
      dispatch(updateStats({ stats: result }));
    }
  }, [dispatch, ready, result]);

  return ready ? (
    <div className={styles.container}>
      {result.map((s) => {
        return <Stat info={s} key={s.number} />;
      })}
    </div>
  ) : null;
};

export default React.memo(Stats);

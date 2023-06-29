import { ExplosionFields } from "@backend/types/ClientSliceTypes";
import Block from "../../components/game/block/Block";
import { getResult, isLoaded } from "../_socket_utils/dataHandler";
import { LoadedData } from "../../types/DataHandleType";
import { useGetExplosionFieldsQuery } from "../../app/services/explosions";
import { selectColoredAsset } from "../../assets/assetHandler";
import { useGetColors } from "../../app/hooks";
import { useOptionalRender } from "../renderHook";
import { nanoid } from "@reduxjs/toolkit";
import { EXPLOSION_TIME } from "../_shared_constants/constants";

const Explosions = () => {
  const isVisible = useOptionalRender();
  const { data } = useGetExplosionFieldsQuery();
  const ready = isLoaded(data);
  const result = getResult(data as LoadedData<ExplosionFields>);

  const calcOpacity = (time: number, endTime: number): number => {
    const difference = endTime - time;
    //* difference: 0..1000
    return difference / EXPLOSION_TIME;
  };
  const colors = useGetColors();
  return (
    <div>
      {ready &&
        "newExplosions" in result &&
        result.newExplosions.map((explosionField) => {
          const opacity = calcOpacity(
            Date.now() + result.timeInfo,
            explosionField.timestamp
          );
          return opacity > 0 && isVisible(explosionField.pos) ? (
            <Block
              pos={explosionField.pos}
              key={nanoid()}
              opacity={opacity}
              imgSrc={selectColoredAsset(
                "explosion",
                colors[explosionField.playerNumber]
              )}
            />
          ) : null;
        })}
    </div>
  );
};

export default Explosions;

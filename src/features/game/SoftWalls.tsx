import { SoftWall } from "@backend/types/ClientSliceTypes";
import Block from "../../components/game/block/Block";
import { getResult, isLoaded } from "../_socket_utils/dataHandler";
import { LoadedData } from "../../types/DataHandleType";
import { useGetSoftWallsQuery } from "../../app/services/softWalls";
import softWall from "../../assets/block/soft.png";
import React from "react";
import { useOptionalRender } from "../renderHook";

const SoftWalls = () => {
  const isVisible = useOptionalRender();
  const { data } = useGetSoftWallsQuery();
  const ready = isLoaded(data);
  const result = getResult(data as LoadedData<SoftWall[]>);
  return (
    <div>
      {ready &&
        result.map((wall) => {
          return isVisible(wall.pos) ? (
            <Block
              pos={wall.pos}
              imgSrc={softWall}
              key={JSON.stringify(wall)}
            />
          ) : null;
        })}
    </div>
  );
};

export default React.memo(SoftWalls);

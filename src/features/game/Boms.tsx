import { Bomb } from "@backend/types/ClientSliceTypes";
import Block from "../../components/game/block/Block";
import { getResult, isLoaded } from "../_socket_utils/dataHandler";
import { LoadedData } from "../../types/DataHandleType";
import { useGetBombsQuery } from "../../app/services/bombs";

import { selectColoredAsset } from "../../assets/assetHandler";
import { useGetColors } from "../../app/hooks";
import React from "react";
import { useOptionalRender } from "../renderHook";
import { nanoid } from "@reduxjs/toolkit";

const Boms = () => {
  const isVisible = useOptionalRender();
  const { data } = useGetBombsQuery();
  const ready = isLoaded(data);
  const result = getResult(data as LoadedData<Bomb[]>);

  const colors = useGetColors();
  return (
    <div>
      {ready &&
        result.map((bomb) => {
          return isVisible(bomb.pos) ? (
            <Block
              pos={bomb.pos}
              imgSrc={selectColoredAsset("bomb", colors[bomb.playerNumber])}
              key={nanoid()}
            />
          ) : null;
        })}
    </div>
  );
};

export default React.memo(Boms);

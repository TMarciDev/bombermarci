import { PowerUp } from "@backend/types/ClientSliceTypes";
import Block from "../../components/game/block/Block";
import { getResult, isLoaded } from "../_socket_utils/dataHandler";
import { LoadedData } from "../../types/DataHandleType";
import { useGetPowersQuery } from "../../app/services/power";

import addBomb from "../../assets/power/power3.png";
import addSpeed from "../../assets/power/power2.png";
import addRange from "../../assets/power/power1.png";
import React from "react";
import { useOptionalRender } from "../renderHook";

const PowerUps = () => {
  const isVisible = useOptionalRender();
  const { data } = useGetPowersQuery();
  const ready = isLoaded(data);
  const result = getResult(data as LoadedData<PowerUp[]>);

  const getImage = (type: string) => {
    switch (type) {
      case "add_bomb":
        return addBomb;
      case "add_speed":
        return addSpeed;
      case "add_range":
        return addRange;
    }
  };
  return (
    <div>
      {ready &&
        result.map((power) => {
          return isVisible(power.pos) ? (
            <Block
              pos={power.pos}
              imgSrc={getImage(power.type)}
              key={JSON.stringify(power)}
            />
          ) : null;
        })}
    </div>
  );
};

export default React.memo(PowerUps);

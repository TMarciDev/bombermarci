import { PrepInfos } from "@backend/types/ClientSliceTypes";
import { getResult, isLoaded } from "../_socket_utils/dataHandler";
import { LoadedData } from "../../types/DataHandleType";
import {
  useGetPreparationQuery,
  usePickColorMutation,
} from "../../app/services/preparation";
import { colors } from "../../colors";
import FrogIdle from "../../components/game/frog/FrogIdle";
import { PossibleColors } from "../../types/Colors";
import { isMobile } from "react-device-detect";
import { useWindow } from "../../windowUtils";
import styles from "./style.module.scss";

interface Props {
  selected: PossibleColors | "";
}

const ColorPicker = ({ selected }: Props) => {
  const window = useWindow();
  const { data } = useGetPreparationQuery();
  const [pickColor] = usePickColorMutation();

  const ready = isLoaded(data);
  const result = getResult(data as LoadedData<PrepInfos>);

  const pickerSize = isMobile ? window.width - 4 : window.height / 2;

  return ready ? (
    <div className={styles.heroSelector}>
      {colors.map((c) => {
        return (
          <FrogIdle
            color={c}
            size={pickerSize / 3 - 40}
            handleClick={(c) => {
              pickColor(c);
            }}
            selected={selected === c}
            available={result.availableColors.includes(c)}
            key={c}
          />
        );
      })}
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default ColorPicker;

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { handleResponseNavigation } from "../_socket_utils/responseHandler";
import {
  useCreateRoomMutation,
  useJoinRoomMutation,
} from "../../app/services/menu";
import FrogIdle from "../../components/game/frog/FrogIdle";
import { useWindow } from "../../windowUtils";
import { isMobile } from "react-device-detect";
import styles from "./style.module.scss";

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("Player");
  const [createRoom] = useCreateRoomMutation();
  const [joinRoom] = useJoinRoomMutation();
  const [roomName, setRoomName] = useState("");
  const myWindow = useWindow();

  const navToPerparation = () => {
    navigate("/preparation");
  };

  useEffect(() => {
    const previousPathname = sessionStorage.getItem("previousPathname");
    if (previousPathname && previousPathname !== "home") {
      sessionStorage.setItem("previousPathname", "home");
      window.location.reload();
    } else {
      sessionStorage.setItem("previousPathname", "home");
    }
  }, [location]);

  return (
    <div className={styles.menuContainer}>
      <FrogIdle
        color="green"
        size={isMobile ? myWindow.width : myWindow.height / 2}
        border={false}
      />
      <input
        className={`${styles.centerInput} ${name === "" && styles.error}`}
        type="text"
        placeholder="Name required"
        defaultValue={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        required
      />
      <div className={styles.roomContainer}>
        <div className={styles.joinContainer}>
          <input
            type="text"
            placeholder="room name"
            onChange={(e) => {
              setRoomName(e.target.value);
            }}
          />
          <button
            onClick={() => {
              if (name.length === 0) return;
              joinRoom({
                name: name,
                roomName: roomName,
              }).then((response) =>
                handleResponseNavigation(response, navToPerparation)
              );
            }}
          >
            Join room
          </button>
        </div>
        <hr />
        <button
          onClick={() => {
            if (name.length === 0) return;
            createRoom({
              name: name,
            }).then((response) =>
              handleResponseNavigation(response, navToPerparation)
            );
          }}
        >
          Create room
        </button>
        <hr />
        <button
          onClick={() => {
            if (name.length === 0) return;
            createRoom({
              name: name,
              test: true,
            }).then((response) =>
              handleResponseNavigation(response, navToPerparation)
            );
          }}
        >
          Start tutorial game
        </button>
      </div>
    </div>
  );
};

export default Menu;

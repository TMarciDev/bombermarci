import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ErrorDisplay from "./features/ErrorDisplay";
import Menu from "./features/menu/Menu";
import Preparation from "./features/preparation/Preparation";
import "react-toastify/dist/ReactToastify.css";
import Game from "./features/game/Game";
import { useEffect } from "react";
//import { isMobile } from "react-device-detect";
import GameOver from "./components/game/gameOver/GameOver";

function App() {
  useEffect(() => {
    //isMobile && window.screen.orientation.lock("portrait");
    const handleLongClick = (event: any) => {
      event.preventDefault();
    };
    window.addEventListener("contextmenu", handleLongClick);
    return () => {
      window.removeEventListener("contextmenu", handleLongClick);
    };
  }, []);
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        closeButton={false}
      />
      <ErrorDisplay />
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/preparation" element={<Preparation />} />
        <Route path="/game" element={<Game />} />
        <Route path="/gameover" element={<GameOver />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

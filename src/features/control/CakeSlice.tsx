interface Props {
  color: string;
  direction: number;
  active: number;
}

const CakeSlice = ({ color, direction, active }: Props) => {
  return (
    <div
      style={{
        width: "50%",
        height: "50%",
        backgroundColor: color,
        filter: `${
          active === direction ? "brightness(200%)" : "brightness(90%)"
        }`,
      }}
    ></div>
  );
};

export default CakeSlice;

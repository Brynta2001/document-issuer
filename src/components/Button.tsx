import { useStatusContext } from "../contexts/StatusContext";

export const Button = ({
  buttonText,
  onHandler,
}: {
  buttonText: string;
  onHandler: () => void;
}) => {
  const { status } = useStatusContext();

  return (
    <button
  onClick={onHandler}
  disabled={status === "pending"}
  style={{
    margin: "0 8px 8px 0",
    backgroundColor: "white",
    border: "1px solid black",
    color: "#0050A6", // Color de texto azul
    padding: "8px 16px",
    cursor: "pointer",
  }}
>
  {status === "pending" ? "Pending..." : buttonText}
</button>
  );
};

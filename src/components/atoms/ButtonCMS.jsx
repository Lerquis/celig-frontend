import { Button } from "@/components/ui/button";
import { Loader } from "../icons/Loader";

export const ButtonCMS = ({
  loading = false,
  text = "",
  type = "button",
  customClass = "",
  children = <></>,
  onClick = () => {},
}) => {
  return (
    <Button
      type={type}
      className={`cursor-pointer ${customClass}`}
      disabled={loading}
      // onClick="hola()"
      // onClick={() => {
      //   console.log("asd");
      // }}
    >
      {loading && <Loader />}
      {text ? text : children}
    </Button>
  );
};

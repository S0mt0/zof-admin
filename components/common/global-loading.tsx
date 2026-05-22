import { HashLoader } from "react-spinners";

export function GlobalLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <HashLoader color="green" size={30} />
    </div>
  );
}

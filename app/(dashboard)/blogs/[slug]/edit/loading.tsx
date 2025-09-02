import { HashLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <HashLoader color="green" size={30} />
    </div>
  );
}

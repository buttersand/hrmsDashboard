import Aside from "../components/Aside";
import Candidates from "./Candidates";
import Header from "../components/Header";

export default function Overview(params) {
  return (
    <>
      <main className="grid grid-cols-16 grid-rows-20 h-screen">
        <div className="col-span-3 row-span-20 border-e border-">
          <Aside />
        </div>
        <div className="col-span-13 row-span-2">
          <Header />
        </div>
        <div className="col-span-13 h-full">
          <Candidates />
        </div>
      </main>
    </>
  );
}

import React from "react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Head from "next/head"; 

interface PaginationProps {
  sendDataToParent: (pageNumber: number) => void;
  activeNumber: number;
}

const Pagination: React.FC<PaginationProps> = ({ sendDataToParent, activeNumber }) => {

  const [active, setActive] = React.useState(activeNumber);
  const [startingNumberArray, setStartingNumberArray] = React.useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  const next = () => {
    if (active === 10) return;
    setActive(active + 1);
    sendDataToParent(active + 1);
  };
 
  const prev = () => {
    if (active === 1) return;
    setActive(active - 1);
    sendDataToParent(active - 1);
  };

  const buttonClick = (number: number) => {
    setActive(number);
    sendDataToParent(number);
  }
 
  return (
    <div className="flex items-center justify-center gap-4 mt-10">
      <Head>
        <title>Pokedex</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="author" content="Asadullah Samoon" />
      </Head>

      <button className={`flex items-center gap-2 rounded-full px-3 py-2 duration-500 ${active > 1 ? 'hover:bg-gray-400 hover:text-white' : ''}`} onClick={prev} disabled={active === 1}>
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> 
        Previous
      </button>

      <div className="flex items-center gap-2">
        {startingNumberArray.map((number: number) => (
          <button key={number} className={`${active === number ? 'bg-[#414142] text-white' : 'bg-white text-[#414142]'} duration-300 hover:bg-gray-400 hover:text-white size-10 rounded-full font-bold text-xl`} onClick={() => buttonClick(number)}> {number} </button>
        ))}
      </div>

      <button className={`flex items-center gap-2 rounded-full px-3 py-2 duration-500 ${active <10 ? 'hover:bg-gray-400 hover:text-white' : ''}`} onClick={next} disabled={active === 10}>
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </button>

    </div>
  );
}

export default Pagination;
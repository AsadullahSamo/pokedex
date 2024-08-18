import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Pagination } from './Pagination'
import Filters from './Filters';
import loader from '../../styles/Loader.module.css'
import search from '../../public/assets/icons/search.svg'
import NoResults from '../../public/assets/images/no results.gif'
import fonts from '../../styles/fonts.module.css';
import PokedexLogo from '../../public/assets/icons/Pokedex-logo.svg';
import Modal from 'react-modal'
Modal.setAppElement('#__next');

import bug from '../../public/assets/icons/bug.svg'
import dark from '../../public/assets/icons/dark.svg'
import dragon from '../../public/assets/icons/dragon.svg'
import electric from '../../public/assets/icons/electric.svg'
import fairy from '../../public/assets/icons/fairy.svg'
import fighting from '../../public/assets/icons/fighting.svg'
import fire from '../../public/assets/icons/fire.svg'
import flying from '../../public/assets/icons/flying.svg'
import ghost from '../../public/assets/icons/ghost.svg'
import grass from '../../public/assets/icons/grass.svg'
import ground from '../../public/assets/icons/ground.svg'
import ice from '../../public/assets/icons/ice.svg'
import normal from '../../public/assets/icons/normal.svg'
import poison from '../../public/assets/icons/poison.svg'
import psychic from '../../public/assets/icons/psychic.svg'
import rock from '../../public/assets/icons/rock.svg'
import steel from '../../public/assets/icons/steel.svg'
import water from '../../public/assets/icons/water.svg'
import DetailsCard from './DetailsCard';



type ColorMap = {
  [key: string]: string;
};

type PokemonData = {
  id: number;
  name: string;
  paddedId: string;
  image: string;
  type: string[];
};

const colors: ColorMap = {
  normal: "168 167 122",
  fire: "236 108 110",
  water: "1 154 256",
  electric: "247 208 44",
  grass: "31 185 17",
  ice: "150 217 214",
  fighting: "194 46 40",
  poison: "163 62 161",
  ground: "226 191 101",
  flying: "169 143 243",
  psychic: "249 85 135",
  bug: "166 185 26",
  rock: "182 161 54",
  ghost: "115 87 151",
  dragon: "111 53 252",
  dark: "112 87 70",
  steel: "183 183 206",
  fairy: "214 133 173"
}

const typeIcons: ColorMap = {
  bug,
  dark,
  dragon,
  electric,
  fairy,
  fighting,
  fire,
  flying,
  ghost,
  grass,
  ground,
  ice,
  normal,
  poison,
  psychic,
  rock,
  steel,
  water
};


const UI: React.FC = () => {

  // const [modalIsOpen, setIsOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [pokemonDetails, setPokemonDetails] = useState({id: 0, name: '', image: '', type: [''], colors: colors, typeIcons});
  const [data, setData] = useState<PokemonData[]>([]);
  const [resultsFound, setResultsFound] = useState<boolean>(true);
  const [filteredData, setFilteredData] = useState<PokemonData[]>([]);
  const [detailsArray, setDetailsArray] = useState<any[]>([]);
  const [type, setType] = useState<string[]>([]);
  const [color, setColor] = useState<string[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchVal, setSearchVal] = useState<string>('');

  

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${(pageNumber - 1) * 20}`)
      .then(res => res.json())
      .then(data => {
        const pokemonPromises = data.results.map((pokemon: { name: string; url: string }) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
          .then(res => res.json())
        );
        
        Promise.all(pokemonPromises)
          .then(pokemonDetails => {
            const updatedData: PokemonData[] = pokemonDetails.map((detail: any, index: number) => ({
              id: index + 1,
              name: detail.name,
              paddedId: detail.id.toString().padStart(3, '0'),
              image: `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${(detail.id).toString().padStart(3, '0')}.png`,
              type: detail.types.map((type: { type: { name: string } }) => type.type.name)
            }));
            setData(updatedData);
            setFilteredData(updatedData);
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error fetching Pokémon details:', error);
            setIsLoading(false);
          });
      })
      .catch(error => {
        console.error('Error fetching Pokémon:', error);
        setIsLoading(false);
      });
  }, [pageNumber]);

  useEffect(() => {
    if (data.length > 0) {
      setType(data.map(pokemon => pokemon.type.join(' / ')));
      setColor(data.map(pokemon => colors[pokemon.type[0]]));
    }
  }, [data]);

  useEffect(() => {
    // console.log('Filters: ', filters);
    if (filters.length > 0) {
      const filtered = data.filter(pokemon => filters.some(filter => pokemon.type.includes(filter.toLowerCase())));
      // console.log('Filtered:', filtered);
      // console.log(filteredData)
      setFilteredData(filtered);
      // setResultsFound(filtered.length > 0);
    } else {
      if(searchVal === '') {
        setFilteredData(data);
      } else {
        const filteredData = data.filter(pokemon => pokemon.name.includes(searchVal.toLowerCase()) || pokemon.type.includes(searchVal.toLowerCase()) || Number(searchVal) === pokemon.id);
        setFilteredData(filteredData);
      }
      // setResultsFound(true);
    }
  }, [filters, data]);

  const handleSearchButton = (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = searchRef.current?.value;
    console.log(search);
    if (search) {
      const filteredData = data.filter(pokemon => pokemon.name.includes(search.toLowerCase()) || pokemon.type.includes(search.toLowerCase()) || Number(search) === pokemon.id);
      // console.log(Number(search))
      // console.log(data[Number(search)])
      setFilteredData(filteredData);
      setResultsFound(filteredData.length > 0);
    } else {
      setFilteredData(data);
      setResultsFound(true);
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const search = event.target.value;
    setSearchVal(search);
    // console.log(search);
    if (search) {
      const filteredData = data.filter(pokemon => pokemon.name.includes(search.toLowerCase()) || pokemon.type.some(type => type.includes(search)) || Number(search) === pokemon.id);
      setFilteredData(filteredData);
      setResultsFound(filteredData.length > 0);
    } else {
      setFilteredData(data);
      setResultsFound(true);
    }
  }

  const handleDataFromPaginationChild = (pageNumber: number) => {
    setPageNumber(pageNumber);
  }

  const handleDataFromCheckboxChild = (type: string, checked: boolean) => {
    // console.log(type);
    // console.log(checked);
    if (checked) {
      setFilters([...filters, type.toLowerCase()]);
      // setFilteredData(filteredData.filter(pokemon => filters.some(filter => pokemon.type.includes(filter))));
      // console.log(filters);
    } else {
      setFilters(filters.filter(filter => filter !== type.toLowerCase()));
    }
  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    if (event.target.value === "Lowest Number First") {
      const sortedData = [...filteredData].sort((a, b) => a.id - b.id);
      setFilteredData(sortedData);
    } else if (event.target.value === "Highest Number First") {
      const sortedData = [...filteredData].sort((a, b) => b.id - a.id);
      setFilteredData(sortedData);
    } else if (event.target.value === "Alphabetically (A-Z)") {
      const sortedData = [...filteredData].sort((a, b) => a.name.localeCompare(b.name));
      setFilteredData(sortedData);
    } else if (event.target.value === "Alphabetically (Z-A)") {
      const sortedData = [...filteredData].sort((a, b) => b.name.localeCompare(a.name));
      setFilteredData(sortedData);
    }
  }
  
  if (isLoading) {
    return <div className='flex justify-center items-center mt-[15%]'><div className={`${loader.loader} self-center`}></div></div>;
  } 

  if(!resultsFound) {
    return (
      <>
        <Image src={PokedexLogo} alt="logo" width={200} height={200} className="self-start" />
        <div className="flex items-center justify-center relative right-5 w-[88vw]">
          <Image src={search} alt="search" className="size-5 relative top-4 left-7" />
            <input type="search" onChange={handleSearchChange} ref={searchRef} placeholder="Search for a Pokemon" className={`w-[100%] ${fonts.RobotoMedium} text-[#416EDF] mt-8 px-9 py-3 rounded-xl shadow-md focus:outline-[#a8b9d6] focus:outline-4`} />
            <button type="button" className={`bg-[#ffd030] p-2 rounded-md ${fonts.RobotoBold} text-[#416EDF] ml-4 absolute right-2 w-[10%] top-9 text-center`} onClick={handleSearchButton}> Search </button>
        </div>
        <div className="flex items-center justify-center mt-20">
          <Image src={NoResults} alt="logo" width={250} height={250} className="self-start" />
          <p className={`text-2xl font-bold text-center ${fonts.RobotoBold}`}>No Results Found</p>
        </div>
        <Pagination sendDataToParent={handleDataFromPaginationChild} activeNumber={pageNumber}/>
      </>
    )
  }

  const showDetailsCard = async (id: number, name: string, image: string, type: string[]) => {
    // openModal();
    setIsModalOpen(true);
    setPokemonDetails({id, name, image, type, colors, typeIcons});
  
    // try {
    //   const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
    //   const data = await response.json();
      
    //   const evolutionChainResponse = await fetch(data.evolution_chain.url);
    //   const evolutionChainData = await evolutionChainResponse.json();
      
    //   const evoArray = getEvo([evolutionChainData.chain]);
    //   setDetailsArray(evoArray);
    //   console.log(evoArray); // This will now show the evolution chain correctly
    // } catch (error) {
    //   console.error('Error fetching Pokémon details:', error);
    // }
  };
    
  // function getEvo(arr: any[]) {
  //   let evoChain: string[] = [];
  //   if (arr[0].evolves_to.length > 0) {
  //     evoChain.push(arr[0].species.name);
  //     evoChain = evoChain.concat(getEvo(arr[0].evolves_to));
  //   } else {
  //     evoChain.push(arr[0].species.name);
  //   }
  //   return evoChain;
  // }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      background: 'transparent',
      border: 'none',
      transform: 'translate(-50%, -50%)',
    },
  };
  
  return (
    <div>

      

      {/* <Filters sendDataToParent={handleDataFromCheckboxChild}/> */}
      <Image src={PokedexLogo} alt="logo" width={200} height={200} className="self-start" />
      {/* <SearchBar /> */}
      <div className="flex items-center justify-center relative right-5 w-[88vw]">
        <Image src={search} alt="search" className="size-5 relative top-4 left-7" />
        <input type="search" onChange={handleSearchChange} ref={searchRef} placeholder="Search for a Pokemon" className={`w-[100%] ${fonts.RobotoMedium} text-[#416EDF] mt-8 px-9 py-3 rounded-xl shadow-md focus:outline-[#a8b9d6] focus:outline-4`} />
        <button className={`bg-[#ffd030] p-2 rounded-md ${fonts.RobotoBold} text-[#416EDF] ml-4 absolute right-2 w-[10%] top-9 text-center`} onClick={handleSearchButton}> Search </button>
      </div>

      <select name="sort" id="sort" className='my-10 ml-4 px-4 py-2 rounded-md shadow-md' onChange={handleSelect}>
        <option value="Lowest Number First" className={`${fonts.RobotoMedium}`}> Lowest Number First </option>
        <option value="Highest Number First" className={`${fonts.RobotoMedium}`}>Highest Number First</option>
        <option value="Alphabetically (A-Z)" className={`${fonts.RobotoMedium}`}>Alphabetically (A-Z)</option>
        <option value="Alphabetically (Z-A)" className={`${fonts.RobotoMedium}`}>Alphabetically (Z-A)</option>
      </select>

      {/* <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <button onClick={closeModal}>close</button>
        <DetailsCard name={pokemonName} />
        <div>I am a modal</div>
        <form>
          <input />
          <button>tab navigation</button>
          <button>stays</button>
          <button>inside</button>
          <button>the modal</button>
        </form>
      </Modal> */}

      {isModalOpen && 
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          style={customStyles}
        >
          {/* <button onClick={() => setIsModalOpen(false)}>Close</button> */}
          <DetailsCard pokemon={pokemonDetails} />
        </Modal>
      }

      

      <div className="flex flex-wrap justify-center gap-10 mt-16">
        {filteredData.map((pokemon, i) => (
          <div key={pokemon.id} className={`hover:cursor-pointer mt-7 w-[19vw] px-12 py-4 rounded-md shadow-md`} style={{ backgroundColor: `rgba(${colors[pokemon.type[0]].split(' ')}, 0.8)`}} onClick={() => showDetailsCard(pokemon.id, pokemon.name, pokemon.image, pokemon.type)}>
            <img src={pokemon.image} alt={pokemon.name} className="relative -top-20 w-28 h-28 mx-auto"/>
            <h1 className={`text-2xl font-bold text-[#f0ffef] text-center ${fonts.RobotoBold}`}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.substring(1)}</h1>
            <p className={`text-lg text-[#f0ffef] text-center ${fonts.RobotoMedium}`}>#{pokemon.paddedId}</p>
            <div key={i} className="flex justify-start gap-6 mt-4">
              {pokemon.type.map((type, i) =>
                <div key={i} className="flex justify-center px-4 py-1 gap-2 mt-4 rounded-full mx-auto" style={{backgroundColor: `rgba(${colors[type].split(' ')}, 1)`}}>
                  <Image src={typeIcons[type]} width={20} height={20} alt={type}/>
                  <p className={`text-md ${fonts.RobotoRegular} relative -left-1`}> {type.charAt(0).toUpperCase() + type.substring(1)} </p>
                </div>
              )}
            </div>    
          </div>
        ))}
      </div>

      <Pagination sendDataToParent={handleDataFromPaginationChild} activeNumber={pageNumber}/>
    </div>

  );
};

export default UI;

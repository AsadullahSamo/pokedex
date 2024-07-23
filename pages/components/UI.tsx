import React, { useEffect, useRef, useState } from 'react';
import loader from '../../styles/Loader.module.css'
import { Pagination } from './Pagination'
import search from '../../public/assets/icons/search.svg'
import Image from 'next/image';
import PokedexLogo from '../../public/assets/icons/Pokedex-logo.svg';
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
import fonts from '../../styles/fonts.module.css';


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
  fire: "238 129 48",
  water: "99 144 240",
  electric: "247 208 44",
  grass: "122 199 76",
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
  const [data, setData] = useState<PokemonData[]>([]);
  const [type, setType] = useState<string[]>([]);
  const [color, setColor] = useState<string[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchRef = useRef<HTMLInputElement>(null);

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

  const handleSearch = () => {
    const search = searchRef.current?.value;
    console.log(search);
    if (search) {
      const filteredData = data.filter(pokemon => pokemon.name.includes(search.toLowerCase()));
      console.log(filteredData);
      setData(filteredData);
    }
  }

  
  const handleDataFromPaginationChild = (pageNumber: number) => {
    console.log(pageNumber);
    setPageNumber(pageNumber);
  }
  
  if (isLoading) {
    return <div className='flex justify-center items-center mt-[15%]'><div className={`${loader.loader} self-center`}></div></div>;
  }
  return (
    <div>
      <Image src={PokedexLogo} alt="logo" width={200} height={200} className="self-start" />
      {/* <SearchBar /> */}
      <div className="flex items-center justify-center relative right-5 w-[88vw]">
        <Image src={search} alt="search" className="size-5 relative top-4 left-7" />
        <input type="search" ref={searchRef} placeholder="Search for a Pokemon" className={`w-[100%] ${fonts.RobotoMedium} text-[#416EDF] mt-8 px-9 py-3 rounded-xl shadow-md focus:outline-[#a8b9d6] focus:outline-4`} />
        <button className={`bg-[#ffd030] p-2 rounded-md ${fonts.RobotoBold} text-[#416EDF] ml-4 absolute right-2 w-[10%] top-9 text-center`} onClick={handleSearch}> Search </button>
      </div>

      <div className="flex flex-wrap justify-center gap-10 mt-16">
        {data.map((pokemon, i) => (
          <div key={pokemon.id} className={`mt-7 w-[19vw] px-12 py-4 rounded-md shadow-md`} style={{ backgroundColor: `rgba(${colors[pokemon.type[0]].split(' ')}, 0.8)`}}>
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

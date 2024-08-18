import React, { useState, useEffect } from 'react'
import ProgressBar from './ProgressBar';
import Modal from 'react-modal'
import Image from 'next/image';
import fonts from '../../styles/fonts.module.css';
Modal.setAppElement('#__next');

export default function DetailsCard({pokemon}: any) {

	const [active , setActive] = useState('about');	
	const [evolutionArray, setEvolutionArray] = useState<{ evolution: string[], levels: string[] }>({ evolution: [], levels: [] });
	const [isOpenModal, setIsOpenModal] = useState(true);
	const [isOpen, setIsOpen] = useState(isOpenModal);
	const [aboutPokemon, setAboutPokemon] = useState({species: '', height: 0, weight: 0, abilities: ''});
	const statsNames = [['Hp', 80], ['Attack', 54], ['Defense', 42], ['Special Attack', -4], ['Special Defense', -16], ['Speed', 57], ['Total avg', 34]];
	const [stats, setStats] = useState<number[]>([]);
		
		function openModal() {
			setIsOpen(true);
			setIsOpenModal(true);
		}
	
		function closeModal() {
			setIsOpen(false);
			setIsOpenModal(false);
		}
    
	useEffect(() => {
		fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`)
		.then(response => response.json())
		.then(data => {
		    fetch(data?.evolution_chain?.url)
		    .then(response => response.json())
		    .then(data => {							
						// console.log(getEvo([data.chain]));
		      const evoArray = getEvo([data.chain]) || [];
		      const evoLevels = getLevels([data.chain]) || [];
					console.log(evoLevels);
					setEvolutionArray({evolution: evoArray, levels: evoLevels});
					console.log(evolutionArray);
					// console.log(detailsArray);
		    })
		})
		// console.log(pokemon.type);

			// async function fetchData() {
			// 	try {
			// 		const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
			// 		const data = await response.json();
					
			// 		const evolutionChainResponse = await fetch(data.evolution_chain.url);
			// 		const evolutionChainData = await evolutionChainResponse.json();
					
			// 		const evoArray = getEvo([evolutionChainData.chain]);
			// 		// setDetailsArray(evoArray);
			// 		console.log(evoArray); // This will now show the evolution chain correctly
			// 	} catch (error) {
			// 		console.error('Error fetching Pokémon details:', error);
			// 	}
			// }
			// fetchData();
	}, [])
	
	useEffect(() => {
		fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
		.then((response) => response.json())
		.then((data) => { 
			let abilities: string = '';
			data.abilities?.forEach((ability: any, index: number) => {
				index === data.abilities.length-1 ? abilities += ability.ability.name.split("-").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ").replace("-"," ") :
    		abilities += ability.ability.name.split("-").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ").replace("-"," ") + ', '
			})
			setAboutPokemon({species: data.species?.name, height: data.height*10, weight: data.weight/10, abilities: abilities})
			const baseStats = data.stats?.map((stat: any) => stat.base_stat) || [];
  		const totalAvg = (baseStats.reduce((a: number, b: number) => a + b, 0) / baseStats.length).toFixed(1)
			setStats([...baseStats, totalAvg]);
			console.log(stats);
		})
	}, [])

	function getEvo(arr: any[]) {
    let evoChain: string[] = [];
    if (arr[0].evolves_to.length > 0) {
      evoChain.push(arr[0].species.name);
      evoChain = evoChain.concat(getEvo(arr[0].evolves_to));
    } else {
      evoChain.push(arr[0].species.name);
    }
    return evoChain;
  }

	function getLevels(arr: any[]) {
		let evoChain: string[] = [];
		if (arr[0].evolves_to.length > 0) {
			if (arr[0].evolution_details.length > 0) {
				evoChain.push(arr[0].evolution_details[0].min_level); // Handle missing min_level
			}
			// Collect levels from subsequent evolutions
			evoChain = evoChain.concat(getLevels(arr[0].evolves_to));
		} else {
			if (arr[0].evolution_details.length > 0) {
				evoChain.push(arr[0].evolution_details[0].min_level || ''); // Handle missing min_level
			}
		}
		return evoChain;
	}
	
		const customStyles = {
			content: {
				top: '50%',
				left: '50%',
				right: 'auto',
				bottom: 'auto',
				marginRight: '-50%',
				transform: 'translate(-50%, -50%)',
			},
		};

  return (
		// <></>
		<>
    <div className="flex flex-wrap justify-center gap-2 w-[600px] py-12 rounded-text-[18px]" style={{ backgroundColor: `rgba(${pokemon.colors[pokemon.type[0]]?.split(' ')}, 0.8)`}}>
			<img src={pokemon.image} alt={pokemon.name} className="w-40 h-40" />

			<div className="flex flex-col mt-9">
				<p className={`text-lg text-[#f0ffef] text-center ${fonts.RobotoMedium}`}>#{pokemon.id.toString().padStart(3, '0')}</p>
				<h1 className={`text-2xl font-bold text-[#f0ffef] text-center ${fonts.RobotoBold}`}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.substring(1)}</h1>
				<div key={pokemon.id} className="flex justify-start gap-6">
					{pokemon.type.map((type: string, i: number) =>
						<div key={i} className="flex justify-center px-4 py-1 gap-2 mt-1 rounded-full mx-auto" style={{backgroundColor: `rgba(${pokemon.colors[type]?.split(' ')}, 1)`}}>
							<Image src={pokemon.typeIcons[type]} width={20} height={20} alt={type}/>
							<p className={`text-md ${fonts.RobotoRegular} relative -left-1`}> {type.charAt(0).toUpperCase() + type.substring(1)} </p>
						</div>
					)}
				</div>
			</div>

		</div>


		<div className="w-[600px] h-96 rounded-xl -mt-5" style={{backgroundColor: 'white'}}>
			<nav className='flex gap-10 px-10 pt-3'>
				<button className={`text-[18px] font-semibold hover:text-black hover:underline hover:decoration-[#2e56ae] hover:decoration-[5px] hover:underline-offset-8 ${active === 'about' ? 'text-black decoration-[#2e56ae] underline decoration-[5px] underline-offset-8' : 'text-[#a2a2a2] no-underline'}`} onClick={() => setActive('about')}> About </button>
				<button className={`text-[18px] font-semibold hover:text-black hover:underline hover:decoration-[#2e56ae] hover:decoration-[5px] hover:underline-offset-8 ${active === 'base-stats' ? 'text-black decoration-[#2e56ae] underline decoration-[5px] underline-offset-8' : 'text-[#a2a2a2] no-underline'}`} onClick={() => setActive('base-stats')}> Base Stats </button>
				<button className={`text-[18px] font-semibold hover:text-black hover:underline hover:decoration-[#2e56ae] hover:decoration-[5px] hover:underline-offset-8 ${active === 'evolution' ? 'text-black decoration-[#2e56ae] underline decoration-[5px] underline-offset-8' : 'text-[#a2a2a2] no-underline'}`} onClick={() => setActive('evolution')}> Evolution </button>
			</nav>

			<div className={`w-[100%] mt-1 py-[1px] bg-[#eaecee]`}></div>

			{ active === 'about' && (

			<div className='w-[100%] h-1 flex gap-10 py-6 px-12'>
				<div className='flex flex-col gap-5 py-2'>
					<p className={`text-[18px] ${fonts.RobotoBold}`}>Species</p>
					<p className={`text-[18px] ${fonts.RobotoRegular}`}>Height</p>
					<p className={`text-[18px] ${fonts.RobotoBold}`}>Weight</p>
					<p className={`text-[18px] ${fonts.RobotoRegular}`}> Abilities </p>
				</div>

				<div className='flex flex-col gap-5 py-2'>
					<p className={`text-[18px] ${fonts.RobotoRegular}`}> {aboutPokemon.species} </p>
					<p className={`text-[18px] ${fonts.RobotoBold}`}> {aboutPokemon.height} cm </p>
					<p className={`text-[18px] ${fonts.RobotoRegular}`}> {aboutPokemon.weight} kg </p>
					<p className={`text-[18px] ${fonts.RobotoBold}`}> {aboutPokemon.abilities} </p>
				</div>
			</div>
			)}
			
			

			{/* <div className='flex py-2'>		
						
			</div> */}

			{/* <div className='flex flex-col gap-28 justify-start'> */}
				{/* <div className='flex gap-10 justify-between mx-10'>
					<img src={'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/004.png'} alt={pokemon.name} className='w-32 h-32'/>
					<img src={'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/004.png'} alt={pokemon.name} className='w-32 h-32'/>
				</div>
				<div className='flex gap-10 justify-between mx-10'>
					<img src={'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/004.png'} alt={pokemon.name} className='w-32 h-32'/>
					<img src={'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/004.png'} alt={pokemon.name} className='w-32 h-32'/>
				</div> */}

				{ active === 'evolution' && (
				  <>
					{evolutionArray.evolution.length === 2 ? (
					  <div className='flex gap-10 justify-between mx-16 mt-10'>
						<img src={`https://img.pokemondb.net/artwork/${evolutionArray.evolution[0]}.jpg`} alt={evolutionArray.evolution[1]} className='w-24 h-24'/>
						<div className='flex flex-col -mt-5'>
						  <p className='text-[90px] font-bold text-[#a2a2a2] -mt-5'> &rarr; </p>
						  <p className={`${fonts.RobotoMedium} text-black -mt-10 mx-5`}> lvl {evolutionArray.levels[0]} </p>
						</div>
						<img src={`https://img.pokemondb.net/artwork/${evolutionArray.evolution[1]}.jpg`} alt={evolutionArray.evolution[2]} className='w-24 h-24'/>
					  </div>
					) : (
					  <div className='flex flex-col gap-16 justify-start mt-10'>
						<div className='flex gap-10 justify-between mx-16'>
						  <img src={`https://img.pokemondb.net/artwork/${evolutionArray.evolution[0]}.jpg`} alt={evolutionArray.evolution[0]} className='w-24 h-24'/>
						  <div className='flex flex-col -mt-5'>
							<p className='text-[90px] font-bold text-[#a2a2a2] -mt-5'> &rarr; </p>
							<p className={`${fonts.RobotoMedium} text-black -mt-10 mx-5`}> lvl {evolutionArray.levels[0]} </p>
						  </div>
						  <img src={`https://img.pokemondb.net/artwork/${evolutionArray.evolution[1]}.jpg`} alt={evolutionArray.evolution[1]} className='w-24 h-24'/>
						</div>
						<div className='flex gap-10 justify-between mx-16'>
						  <img src={`https://img.pokemondb.net/artwork/${evolutionArray.evolution[1]}.jpg`} alt={evolutionArray.evolution[1]} className='w-24 h-24'/>
						  <div className='flex flex-col -mt-5'>
							<p className='text-[90px] font-bold text-[#a2a2a2] -mt-5'> &rarr; </p>
							<p className={`${fonts.RobotoMedium} text-black -mt-10 mx-5`}> lvl {evolutionArray.levels[1]} </p>
						  </div>
						  <img src={`https://img.pokemondb.net/artwork/${evolutionArray.evolution[2]}.jpg`} alt={evolutionArray.evolution[2]} className='w-24 h-24'/>
						</div>
					  </div>
					)}
				  </>
				)}

			{ active === 'base-stats' &&
				<div className='flex flex-col gap-10 justify-start mt-12'>
					{/* <div className='flex gap-10 justify-start'>
						<p className='font-bold text-[#a2a2a2] -mt-5 ml-6'> Hp </p>
						<p className={`${fonts.RobotoMedium} text-black -mt-5 self-center ml-20`}> {stats[0]} </p>
						<ProgressBar width={stats[0]} color={pokemon.colors[pokemon.type[0]]?.split(' ')} />
					</div>

					<div className='flex gap-10 justify-start'>
						<p className='font-bold text-[#a2a2a2] -mt-5 ml-6'> Attack </p>
						<p className={`${fonts.RobotoMedium} text-black -mt-5 self-center ml-[54px]`}> {stats[1]} </p>
						<ProgressBar width={stats[1]} color={pokemon.colors[pokemon.type[0]]?.split(' ')} />
					</div>

					<div className='flex gap-10 justify-start'>
						<p className='font-bold text-[#a2a2a2] -mt-5 ml-6'> Defense </p>
						<p className={`${fonts.RobotoMedium} text-black -mt-5 self-center ml-[42px]`}> {stats[2]} </p>
						<ProgressBar width={stats[2]} color={pokemon.colors[pokemon.type[0]]?.split(' ')} />
					</div>
					
					<div className='flex gap-10 justify-start'>
						<p className='font-bold text-[#a2a2a2] -mt-5 ml-6'> Special Attack </p>
						<p className={`${fonts.RobotoMedium} text-black -mt-5 self-center -ml-1`}> {stats[3]} </p>
						<ProgressBar width={stats[3]} color={pokemon.colors[pokemon.type[0]]?.split(' ')} />
					</div>

					<div className='flex gap-10 justify-start'>
						<p className='font-bold text-[#a2a2a2] -mt-5 ml-6'> Special Defense </p>
						<p className={`${fonts.RobotoMedium} text-black -mt-5 self-center -ml-4`}> {stats[4]} </p>
						<ProgressBar width={stats[4]} color={pokemon.colors[pokemon.type[0]]?.split(' ')} />
					</div>

					<div className='flex gap-10 justify-start'>
						<p className='font-bold text-[#a2a2a2] -mt-5 ml-6'> Speed </p>
						<p className={`${fonts.RobotoMedium} text-black -mt-5 self-center ml-[57px]`}> {stats[5]} </p>
						<ProgressBar width={stats[5]} color={pokemon.colors[pokemon.type[0]]?.split(' ')} />
					</div>

					<div className='flex gap-10 justify-start'>
						<p className='font-bold text-[#a2a2a2] -mt-5 ml-6'> Total avg </p>
						<p className={`${fonts.RobotoMedium} text-black -mt-5 self-center ml-[34px]`}> {(stats.reduce((a, b) => a + b, 0) / stats.length).toFixed(1)} </p>
						<ProgressBar width={stats.reduce((a, b) => a + b, 0) / stats.length} color={pokemon.colors[pokemon.type[0]]?.split(' ')} />
					</div> */}

						{statsNames.map((stat, i) => (
							<div key={i} className='flex gap-10 justify-start'>
								<p className='font-bold text-[#a2a2a2] -mt-5 ml-6'> {stat[0]} </p>
								<p className={`${fonts.RobotoMedium} text-black -mt-5 self-center`} style={{marginLeft: `${stat[1]}px`}}> {stats[i]} </p>
								<ProgressBar width={stats[i]} color={pokemon.colors[pokemon.type[0]]?.split(' ')} />
							</div>
						))}
				</div>
			}

			</div>

		{/* </div> */}
		</>

  )
}

import React from 'react'
import fonts from '../../styles/fonts.module.css';
import Close from '../../public/assets/icons/close.svg'
import Image from 'next/image';
import checkbox from '../../styles/Checkbox.module.css';

export default function Filters({sendDataToParent, sendCloseButtonData, type, color}: {sendDataToParent: any, sendCloseButtonData: any, type: any, color: any}) {

	const typesArray = [['Normal', 'Dragon'], ['Fighting', 'Dark'], ['Flying', 'Fairy'], ['Poison', 'Electric'], ['Ground', 'Rock'], ['Steel', 'Bug'], ['Fire', 'Ghost'], ['Water', 'Psychic'], ['Grass', 'Ice']]
	const checkedFilters = Object.fromEntries(
		typesArray.flat().map(type => [type, false])
	);

	const [closeButton, setCloseButton] = React.useState(false)
	const [checkedFiltersState, setCheckedFiltersState] = React.useState(checkedFilters)

	const handleCheckbox = (value: any, checked: any, index: any) => {
		console.log(checkedFiltersState)
		
		console.log(value, checked, index)
		sendDataToParent(value, checked)
		setCheckedFiltersState({...checkedFiltersState, [value]: checked})
	}

	const handleCloseButton = () => {
		sendCloseButtonData((closeButton: boolean) => !closeButton)
	}

	const handleResetFilters = () => {
		setCheckedFiltersState(Object.fromEntries(typesArray.flat().map(type => [type, false])));
		sendDataToParent('Reset', false)
	}

	const handleApplyFilters = () => {
		setCheckedFiltersState(Object.fromEntries(typesArray.flat().map(type => [type, true])));
		sendDataToParent('All', true)
	}

	
  
  return (
    <div className='w-[25vw] h-[100vh] bg-white fixed right-0 top-0 z-10'>
		<div className='w-[100%] flex justify-between items-center mt-10 mb-5'>
			<p className={`text-2xl ${fonts.RobotoMedium} ml-12`}>Filters</p>
			<Image className={`self-end mr-10 mb-[6px] hover:cursor-pointer`} src={Close} alt='Close' width={15} height={15} onClick={handleCloseButton}/>
		</div>
		<div className={`w-[100%] py-[2px] bg-[#eaecee]`}></div>
		<div className={`w-[100%] h-1 py-6 px-12 ${fonts.RobotoMedium} text-[#919191]`}>Category</div>

		<div className='w-[100%] h-1 py-6 px-12'>

			{typesArray.map((type, index) => {
				return (
					<div className='flex py-2'>
						<label htmlFor='Normal' className={``}>
							<input type='checkbox' className={`mr-2 ${checkbox.checkboxWrapper} checked:bg-red-400`} value={type[0]} onChange={(e) => handleCheckbox(type[0], e.target.checked, index)} checked={checkedFiltersState[type[0]]}/>
							<span className={`${fonts.RobotoMedium} text-[18px] relative bottom-[1px]`}> {type[0]} </span>
						</label>
						{type[1] ? 
							<label htmlFor='Normal' className={`absolute right-0 w-36`}>
								<input type='checkbox' className={`mr-2 ${checkbox.checkboxWrapper} checked:bg-red-400`} value={type[1]} onChange={(e) => handleCheckbox(type[1], e.target.checked, index)} checked={checkedFiltersState[type[1]]}/>
								<span className={`${fonts.RobotoMedium} text-[18px] relative bottom-[1px]`}> {type[1]} </span>
							</label>
						: null}
					</div>
				)
			})
			}

			<div className='flex gap-10 pb-10 absolute bottom-0'>
				<button className={`text-[#5578c3] font-bold px-5 py-2 rounded-lg border-solid border-2 border-[#5578c3] hover:bg-[#5578c3] hover:text-white hover:duration-500`} onClick={handleResetFilters}> Reset filters </button>
				<button className={`text-[#5578c3] font-bold px-5 py-2 text-center rounded-lg border-solid border-2 border-[#5578c3] hover:bg-[#5578c3] hover:text-white hover:duration-500`} onClick={handleApplyFilters}> Apply filters </button>
			</div>

		</div>


		
	</div>
  )

}

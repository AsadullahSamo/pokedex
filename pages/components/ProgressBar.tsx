import React from 'react'

export default function ProgressBar({width, color}: {width: number, color: string}) {
  
  return (
    <div className={`-mt-3 w-[60%] bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700 mr-2 absolute right-5`}>
        <div className={`h-1.5 rounded-full`} style={{width: `${width}%`, backgroundColor: `rgba(${color}, 0.8)`}}></div>
    </div>
  )

}

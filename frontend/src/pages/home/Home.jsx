import React from 'react'
import Slidebar from '../../components/slidebar/Slidebar'
import MessageContainer from '../../components/messages/MessageContainer'
import MobileView from '../../components/slidebar/MobileView'

function Home() {
  return (
    <div className='flex h-full w-full rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
        <MobileView />
        <Slidebar  />
        <MessageContainer /> 
    </div>
  )
}

export default Home
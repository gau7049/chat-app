import React from 'react'
import SearchInput from './SearchInput'
import Conversations from './Conversations'
import LogoutButton from './LogoutButton'

function Slidebar() {
  return (
    <>
    <div className='border-r w-[30%] border-slate-500 p-4 flex flex-col hidden sm:block slidebar'>
        <SearchInput />
        <div className='divider px-1'></div>
        <Conversations />
        <LogoutButton />
    </div>
    </>
  )
}

export default Slidebar
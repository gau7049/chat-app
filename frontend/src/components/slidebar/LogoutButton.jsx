import React from 'react'
import useLogout from '../../hooks/useLogout.js'

function LogoutButton() {
  const {loading, logout} = useLogout()
  return (
    <div className='mt-[1vmax] '>
        {!loading ? (
          <button onClick={logout}>
            Logout
          </button>
        ) : (
          <span className='loading loading-spinner'></span>
        )}
    </div>
  )
}

export default LogoutButton
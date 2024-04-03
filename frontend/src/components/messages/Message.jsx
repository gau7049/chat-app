import React from 'react'

function Message() {
  return (
    <div className='chat chat-end'>
        <div className='chat-image avatar'>
            <div className='w-10 rounded-full'>
                <img alt="Temp" src="https://th.bing.com/th/id/OIP.X6ns_dJj5xq1VSlnxBTlnwHaHa?rs=1&pid=ImgDetMain" />
            </div>
        </div>
        <div className={`chat-bubble text-white bg-blue-500`}>Hi! What is upp?

        </div>
        <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>
        12:42
        </div>

    </div>
  )
}

export default Message
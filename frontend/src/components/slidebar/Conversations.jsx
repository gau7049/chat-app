import React from 'react'
import Conversation from "./Conversation"
import useGetConversations from '../../hooks/useGetConversations';
import { getRandomEmoji } from '../../utils/emojis';

function Conversations() {
  const {loading, conversations} = useGetConversations();
  return (
    <div className='py-2 flex flex-col overflow-auto'>
      { conversations.map((conversation, idx) => {
        return (

          <Conversation
          key={conversation._id}
          conversation={conversation}
          emoji={getRandomEmoji()}
          lastIdx = {idx === conversations.length - 1}
          />
        )
      })
      }
    </div>
  )
}

export default Conversations
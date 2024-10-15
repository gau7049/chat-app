import React, { useEffect } from 'react'
import Conversation from "./Conversation"
import useGetConversations from '../../hooks/useGetConversations';
import { getRandomEmoji } from '../../utils/emojis';
import useConversation from '../../zustand/useConversation';

function Conversations() {
  const {loading, conversations} = useGetConversations();
  const {Updatedconversation, setUpdatedConversation} = useConversation();
  useEffect(() => {
    const changeInList = Updatedconversation && Updatedconversation.length > 0;
    setUpdatedConversation(changeInList ? Updatedconversation : conversations);
  }, [conversations, Updatedconversation])
  return (
    <div className='py-2 flex flex-col chat-container'>
      { loading ? "Loading.." :
       Updatedconversation?.map((conversation, idx) => {
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
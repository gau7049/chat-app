import React, { useEffect } from 'react'
import Conversation from "./Conversation"
import useGetConversations from '../../hooks/useGetConversations';
import { getRandomEmoji } from '../../utils/emojis';
import useConversation from '../../zustand/useConversation';
import useListenMessages from '../../hooks/useListenMessages';
import NotificationBanner from '../notificationBanner/NotificationBanner';

function Conversations() {
  const { loading } = useGetConversations();
  const {Updatedconversation} = useConversation();

  const { bannerMessage, handleBannerClick, setBannerMessage, msg } = useListenMessages();

  return (
    <div className='py-2 flex flex-col chat-container'>
       {bannerMessage && (
        <NotificationBanner
          message={bannerMessage}
          preview={msg.message}
          onClick={handleBannerClick}
          onClose={() => setBannerMessage(null)}
        />
      )}
      { loading ? "Loading...." :
       Updatedconversation?.map((conversation, idx) => {
        return (
          <Conversation
          key={conversation._id}
          conversation={conversation}
          emoji={getRandomEmoji()}
          lastIdx = {idx === Updatedconversation.length - 1}
          />
        )
      })
      }
    </div>
  )
}

export default Conversations
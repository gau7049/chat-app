import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import useSendMessage from '../../hooks/useSendMessage';
import { BsSend } from 'react-icons/bs';
import useConversation from '../../zustand/useConversation';
import { useSocketContext } from '../../context/SocketContext';

function MessageInput() {

  const { selectedConversation, setSelectedConversation, Updatedconversation, setUpdatedConversation } = useConversation();

  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { loading, sendMessage } = useSendMessage();
  const emojiPickerRef = useRef(null); // Reference for emoji picker
  const { setLastSeen } = useSocketContext();

  useEffect(() => {
    setMessage("");
    setLastSeen("")
  }, [selectedConversation])

   // Close the emoji picker when clicking outside of it
   useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false); // Close emoji picker
      }
    };

    // Add event listener to detect clicks outside the emoji picker
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      // Clean up the event listener when the component unmounts
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [emojiPickerRef]);

  const changeUserList = (lastMessage) => {
    const filteredConversations = Updatedconversation.filter(
      (chat) => chat._id !== selectedConversation._id
    );
    // console.log("message1: ", lastMessage)
    setSelectedConversation({
      ...selectedConversation,
      lastMessage: message,
      lastMessageTime: lastMessage.createdAt
    })
    const newConversations = [{
      ...selectedConversation,
      lastMessage: message,
      lastMessageTime: lastMessage.createdAt
    }, ...filteredConversations];
    setUpdatedConversation(newConversations)
    setMessage('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    const lastMessage = await sendMessage(message);
    changeUserList(lastMessage);
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <form className='px-4 my-3' onSubmit={handleSubmit}>
      <div className='w-full relative'>

        {showEmojiPicker && (
          <div className='absolute bottom-12 left-0 z-10'  ref={emojiPickerRef}>
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}

        <input
          type='text'
          className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white ps-10'
          placeholder='Send a message'
          value={message}
          onChange={handleInputChange} // Handle input changes
        />

        <button
          type='button'
          className='absolute inset-y-0 start-0 flex items-center ps-3'
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          😀
        </button>

        <button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
          {loading ? <div className='loading loading-spinner'></div> : <BsSend />}
        </button>
      </div>
    </form>
  );
}

export default MessageInput;

import {create} from 'zustand'

const useConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({selectedConversation}),
    Updatedconversation: null,
    setUpdatedConversation: (Updatedconversation) => set({Updatedconversation}),
    destination: null,
    setDestination: (destination) => set({destination}),
    messages: [],
    setMessages: (messages) => set({messages}),
    activeOnly: null,
    setActiveOnly: (activeOnly) => set({activeOnly}),
    totalActiveUser: null,
    setTotalActiveUser: (totalActiveUser) => set({totalActiveUser}),
}))

export default useConversation;
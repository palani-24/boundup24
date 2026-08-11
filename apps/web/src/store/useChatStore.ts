import { create } from 'zustand';
import { IConversation, IMessage } from '@boundup/shared';

interface ChatState {
  activeConversation: IConversation | null;
  unreadCount: number;
  typingUsers: Map<string, string>; // conversationId -> typing username
  setActiveConversation: (conv: IConversation | null) => void;
  setUnreadCount: (count: number) => void;
  setTyping: (conversationId: string, username: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeConversation: null,
  unreadCount: 0,
  typingUsers: new Map(),

  setActiveConversation: (conv) => set({ activeConversation: conv }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  setTyping: (conversationId, username) => {
    set((state) => {
      const newMap = new Map(state.typingUsers);
      if (username) {
        newMap.set(conversationId, username);
      } else {
        newMap.delete(conversationId);
      }
      return { typingUsers: newMap };
    });
  },
}));

/**
 * Open the chat room with a specific user.
 *
 * Same navigation ChatList does when you tap a conversation row, so every
 * "Chat" button in the app lands on the loaded chat instead of the list.
 * ChatRoom fetches the peer's name and photo itself, so the id is all it needs.
 */
export const openChat = (navigation, userId) => {
  if (!userId) return;
  navigation.navigate("ChatRoom", { userId, isGroup: false });
};

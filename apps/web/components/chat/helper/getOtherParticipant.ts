import type { Conversation, ConversationParticipant } from "@chat/shared-types";

export default function getOtherParticipant(
  conversation: Conversation,
  currentUserId: string
) {
  return conversation.participants.find(
    (participant: ConversationParticipant) =>
      participant._id !==
      currentUserId
  );
}

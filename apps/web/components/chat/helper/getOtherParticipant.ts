import type { Conversation, ConversationParticipant } from "@chat/shared-types";

export default function getOtherParticipant(
  conversation: Conversation,
  currentUserId: string,
): ConversationParticipant {
  const participant =  conversation.participants.find(
    (participant: ConversationParticipant) =>
      participant._id !==
      currentUserId
  );

  if(!participant) {
    throw new Error("Conversation has no other participant")
  }

  return participant;
}

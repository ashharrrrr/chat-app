export default function getOtherParticipant(
  conversation: any,
  currentUserId: string
) {
  console.log("OTHER USER", conversation.participants.find(
    (participant: any) =>
      participant._id !==
      currentUserId))
  return conversation.participants.find(
    (participant: any) =>
      participant._id !==
      currentUserId
  );
}

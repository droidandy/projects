class Messages::UnreadPolicy < ServicePolicy
  allow_all!

  scope do |member|
    Message
      .where(company_id: member.company_id)
      .or(company_id: nil, recipient_id: nil)
      .or(recipient_id: member.id)
      .exclude(message_type: Message::MessageType::PUSH)
  end
end

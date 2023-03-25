require 'rails_helper'

RSpec.describe Messages::UnreadPolicy, type: :policy do
  let(:company) { create(:company) }
  let(:service) { Messages::Unread.new }
  let(:member)  { create(:member, company: company) }
  let(:company_message)  { create(:message, company: company) }
  let(:external_message) { create(:message, :external) }
  let(:personal_message) { create(:message, recipient: member) }
  let(:push_message)     { create(:message, :push, recipient: member) }
  let(:other_company_message) { create(:message) }

  permissions :execute? do
    it { is_expected.to permit(service).for(member) }
  end

  scope do
    preload(:company_message, :other_company_message, :external_message, :personal_message, :push_message)

    it { is_expected.to resolve_to([company_message, external_message, personal_message]).for(member) }
  end
end

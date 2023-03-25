require 'rails_helper'

RSpec.describe Message, type: :model do
  let(:company) { create(:company) }
  let(:member) { create(:member, company: company) }

  describe 'validations' do
    it { is_expected.to validate_presence(:body) }

    describe 'sender validation' do
      let(:external_message) { build(:message) }
      let(:internal_message_with_sender) { build(:message, company: company) }
      let(:internal_message_without_sender) { build(:message, sender: nil, company: company) }
      let(:personal_message) { build(:message, recipient: member) }

      specify { expect(external_message).to be_valid }
      specify { expect(internal_message_with_sender).to be_valid }
      specify { expect(internal_message_without_sender).not_to be_valid }
      specify { expect(personal_message).to be_valid }
    end
  end

  describe 'associations' do
    it { is_expected.to have_many_to_one(:sender) }
    it { is_expected.to have_many_to_one(:company) }
    it { is_expected.to have_many_to_one(:recipient) }
  end

  describe '#data' do
    subject { message.data }

    let(:message) { build(:message, message_type: message_type, body: body) }
    let(:data)    { {foo: 'bar'} }

    context 'when message_type is not push' do
      let(:body)         { data.to_json }
      let(:message_type) { 'external' }

      it { is_expected.to be nil }
    end

    context 'when body is blank' do
      let(:body)         { '' }
      let(:message_type) { 'push' }

      it { is_expected.to be nil }
    end

    context 'when message_type is push and body is presenr' do
      let(:body)         { data.to_json }
      let(:message_type) { 'push' }

      it { is_expected.to eq(data) }
    end
  end

  describe '#message_body' do
    subject { message.message_body }

    let(:message) { build(:message, message_type: message_type, body: body) }

    context 'when message_type is push' do
      let(:message_type) { 'push' }
      let(:body) { {notification: {body: 'foo'}}.to_json }

      it { is_expected.to eq 'foo' }
    end

    context 'when message_type is not push' do
      let(:message_type) { 'external' }
      let(:body) { 'foo' }

      it { is_expected.to eq 'foo' }
    end
  end
end

require 'rails_helper'


RSpec.describe Invites::Show do
  subject { described_class.new(invite) }

  let(:invite) { create(:invite) }

  describe '#as_json' do
    let(:json) do
      {
        id: invite.id,
        created_at: invite.created_at,
        updated_at: invite.updated_at,
        step: invite.step
      }
    end

    it 'returns proper json' do
      expect(subject.as_json).to eq(json)
    end

    context 'when with user' do
      it 'returns proper json with user' do
        expect(subject.as_json(with_user: true)).to eq(json.merge(user: Users::Show.new(invite.user).as_json))
      end
    end

    context 'when invite is expired' do
      let(:invite) { create(:invite, :expired) }

      it 'returns json with expires_at' do
        expect(subject.as_json).to eq(json.merge(expires_at: invite.expires_at))
      end
    end

    context 'when invite is accepted' do
      let(:invite) { create(:invite, :accepted) }

      it 'returns json with accepted_at' do
        expect(subject.as_json).to eq(json.merge(accepted_at: invite.accepted_at))
      end
    end
  end
end

require 'rails_helper'

RSpec.describe Documents::Show do
  subject { described_class.new(document) }

  let(:document) { create(:document, :with_metadata) }

  describe '#as_json' do
    let(:json) do
      {
        id: document.id,
        approval_status: document.approval_status,
        file_url: document.file.full_url,
        expires_at: document.expires_at,
        kind: Documents::Kinds::Show.new(document.kind).as_json,
        content_type: document.content_type,
        file_name: document.file_name,
        metadata: document.metadata.symbolize_keys,
      }
    end

    it 'returns proper json' do
      expect(subject.as_json).to eq(json)
    end

    context 'with user option' do
      let(:user_json) do
        {
          id: document.user.id,
          approval_status: document.user.approval_status
        }
      end

      it 'render user object' do
        expect(subject.as_json(with_user: true)[:user]).to eq(user_json)
      end
    end

    context 'with vehicle option' do
      let(:document) { create :document, :vehicle_bound }
      let(:vehicle_json) do
        {
          id: document.vehicle.id,
          approval_status: document.vehicle.approval_status
        }
      end

      it 'render vehicle object' do
        expect(subject.as_json(with_vehicle: true)[:vehicle]).to eq(vehicle_json)
      end
    end

    context 'with status changes' do
      let!(:change_1) { create :documents_status_change, document: document }
      let!(:change_2) { create :documents_status_change, document: document }

      it 'render last change object' do
        expect(subject.as_json[:last_change]).to be_present
      end
    end

    context 'expiring soon' do
      let(:document) { create(:document, expires_at: 5.days.from_now) }

      it 'has expiration warning flag' do
        expect(subject.as_json[:expiration_warning]).to eq(true)
      end
    end

    context 'expiring not so soon' do
      let(:document) { create(:document, expires_at: 10.days.from_now) }

      it 'has no expiration warning flag' do
        expect(subject.as_json[:expiration_warning]).to be_nil
      end
    end

    context 'with no expiration date set' do
      let(:document) { create(:document, expires_at: 5.days.from_now) }

      it 'has no expiration warning flag' do
        expect(subject.as_json[:expiration_warning]).to eq(true)
      end
    end

    context 'uploaded by agent' do
      let(:agent) { create :user }
      let(:document) { create(:document, agent: agent) }

      it 'render agent' do
        expect(subject.as_json[:agent][:id]).to eq(agent.id)
        expect(subject.as_json[:agent][:name]).to eq(agent.name)
      end
    end
  end
end

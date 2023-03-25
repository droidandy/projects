require 'rails_helper'

RSpec.describe Vehicles::Show do
  subject { described_class.new(vehicle, current_user) }
  let(:current_user) { create :user, :with_driver_role }

  let(:vehicle) { create :vehicle, user: current_user }
  let!(:empty_kinds) { create_list :documents_kind, 2, owner: :vehicle }
  let!(:filled_kinds) { create_list :documents_kind, 3, owner: :vehicle }
  let!(:documents) do
    filled_kinds.each do |kind|
      create :document, user: current_user, vehicle: vehicle, kind: kind
    end
  end

  let(:json) do
    {
      id: vehicle.id,
      approval_status: vehicle.approval_status,
      user_id: vehicle.user_id,
      color: vehicle.color,
      is_current: vehicle.is_current,
      model: vehicle.model,
      plate_number: vehicle.plate_number,
      title: vehicle.title
    }
  end

  describe '#as_json' do
    it 'returns proper json' do
      expect(subject.as_json.except(:documents)).to eq(json)
    end

    it 'contains documents' do
      expect(subject.as_json[:documents][:required].count).to eq(0)
      expect(subject.as_json[:documents][:optional].count).to eq(5)
    end

    it 'should not have parameter to disable documents rendering' do
      expect(subject.as_json(with_documents: false)[:documents]).to be_nil
    end
  end
end

require 'rails_helper'

RSpec.describe Documents::VehicleList do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user, :with_site_admin_role) }

    let(:params) do
      {
        vehicle_id: vehicle.id
      }
    end

    let(:filled_count) { 4 }
    let!(:filled_kinds) { create_list :documents_kind, filled_count, owner: :vehicle }

    let(:empty_count) { 2 }
    let!(:empty_kinds) { create_list :documents_kind, empty_count, owner: :vehicle }

    let(:driver_count) { 1 }
    let!(:driver_kinds) { create_list :documents_kind, driver_count, owner: :driver }

    let(:vehicle) { create :vehicle, user: current_user }

    let!(:documents) do
      filled_kinds.map do |kind|
        create :document, kind: kind, user: current_user, vehicle: vehicle
      end
    end

    let!(:another_vehicle_documents) do
      empty_kinds.map do |kind|
        create :document, kind: kind, user: current_user, vehicle: create(:vehicle)
      end
    end

    let!(:another_user_documents) do
      empty_kinds.map do |kind|
        create :document, kind: kind, user: create(:user), vehicle: create(:vehicle)
      end
    end

    it 'it returns all docs even not yet existing' do
      subject.execute!
      expect(subject.documents.count).to eq(filled_count + empty_count)
      expect(subject.documents.map {|doc| doc[:id]}.compact.count).to eq(filled_count)
    end
  end
end

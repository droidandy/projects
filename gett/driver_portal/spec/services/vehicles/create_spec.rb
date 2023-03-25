require 'rails_helper'

RSpec.describe Vehicles::Create do
  describe '#execute!' do
    let(:cars_body) { json_body('gett/drivers_api/cars') }
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user, :with_driver_role) }

    let(:params) do
      {
        title: 'Title'
      }
    end

    it 'creates vehicle' do
      expect { subject.execute! }.to change { current_user.vehicles.count }.by(1)
      expect(subject).to be_success
    end

    it 'assign valid attributes' do
      subject.execute!
      expect(subject).to be_success
      expect(subject.vehicle.title).to eq('Title')
    end
  end
end

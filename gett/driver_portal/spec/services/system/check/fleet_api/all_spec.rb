require 'rails_helper'

RSpec.describe System::Check::FleetApi::All do
  let(:current_user) { create(:user) }

  subject { described_class.new(current_user) }

  describe '#execute' do
    before(:each) do
      stub_service(System::Check::FleetApi::Drivers, success?: 1)
      subject.execute!
    end

    it 'should return valid results' do
      expect(subject.results).to eq({ drivers: 1 })
    end
  end
end

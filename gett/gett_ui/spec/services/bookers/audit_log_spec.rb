require 'rails_helper'
require 'sequel/plugins/audited'

RSpec.describe Bookers::AuditLog, type: :service do
  let(:booker)  { create :booker }
  let(:service) { Bookers::AuditLog.new(booker: booker) }

  it { is_expected.to be_authorized_by Bookers::ShowPolicy }

  describe "#execute" do
    around do |example|
      Timecop.freeze
      Sequel::Audited.enabled = true
      example.run
      Sequel::Audited.enabled = false
      Timecop.return
    end

    it 'succeeds' do
      expect(service.execute).to be_success
    end

    describe 'home address sanitanization' do
      service_context { {front_office: true, sanitize_home_address: true} }

      let!(:passenger_address) { create(:passenger_address, :home, passenger: booker, address: address_1) }
      let(:address_1)          { create(:address, line: 'Line 1') }
      let(:address_2)          { create(:address, line: 'Line 2') }
      let(:last_change)        { service.execute.result.first }

      before do
        Timecop.travel(1.second.from_now)
        passenger_address.update(address_id: address_2.id)
      end

      it 'sanitizes home address changes' do
        expect(last_change.values_at(:from, :to)).to eq(['Home', 'Home'])
      end
    end
  end
end

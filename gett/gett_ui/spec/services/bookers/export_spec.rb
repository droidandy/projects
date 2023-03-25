require 'rails_helper'

RSpec.describe Bookers::Export, type: :service do
  it { is_expected.to be_authorized_by(Bookers::ExportPolicy) }

  describe '#execute' do
    service_context { { member: admin } }

    let(:admin)     { create(:companyadmin) }
    let!(:booker)   { create(:booker, passenger_pks: [passenger.id], company: admin.company) }
    let(:passenger) { create(:passenger, company: admin.company) }

    subject(:service) { Bookers::Export.new }

    it { is_expected.to use_policy_scope }

    describe 'execution result' do
      it 'returns csv string only with headers and finalized bookings' do
        result = CSV.parse(service.execute.result)

        expect(result.length).to eq(3)

        booker_data = result[2]
        expect(booker_data[0].to_i).to eq(booker.id)
        expect(booker_data[1]).to eq(booker.full_name)
        expect(booker_data[2]).to eq(booker.phone)
        expect(booker_data[4]).to eq(booker.email)
        expect(booker_data[5]).to eq(passenger.full_name)
        expect(booker_data[8]).to eq('Active')
      end
    end
  end
end

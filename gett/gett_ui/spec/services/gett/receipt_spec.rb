require 'rails_helper'

RSpec.describe Gett::Receipt, type: :service do
  let(:booking)       { create(:booking, service_id: '7107442447', pickup_address: create(:address, :baker_street)) }
  let(:response_body) { Rails.root.join('spec/fixtures/gett/receipt_response.json').read }
  let(:response)      { {status: 200, body: response_body} }
  let(:business_id)   { 'TestBusinessId' }

  subject(:service) { described_class.new(booking: booking) }

  service_context { { company: create(:company) } }

  describe '#execute' do
    before do
      expect(Gett::Authenticate).to receive(:new).and_return(double(execute: true))

      stub_request(:get, "http://localhost/business/rides/#{booking.service_id}/receipt?business_id=#{business_id}")
        .to_return(response)

      service.execute
    end

    it { is_expected.to be_success }

    describe '#normalized_response' do
      subject { service.normalized_response }

      context 'when UK booking' do
        expected_response = {
          charges: {
            fare_cost: 5304,
            handling_fee: 1061,
            booking_fee: 150,
            free_waiting_time: 180,
            paid_waiting_time: 5353,
            paid_waiting_time_fee: 1450,
            stops_text: "+1.24 mi",
            stops_fee: 610,
            additional_fee: 1000,
            extra1: 2500,
            extra2: 200,
            extra3: 1000,
            tips: 530,
            sales_tax: 2655,
            black_car_tax: 241
          },
          distance: 14.3606,
          distance_label: "miles",
          duration: "00:19:56"
        }

        it { is_expected.to eq expected_response }
      end

      context 'when not UK booking' do
        let(:pickup_address) { create(:address, country_code: 'IL') }
        let(:booking)        { create(:booking, service_id: '7107442447', pickup_address: pickup_address) }
        let(:business_id)    { 'IL-1234' }

        before do
          allow(service).to receive(:currency).and_return('ILS')
          allow(Currencies::Rate).to receive(:new)
            .with(from: 'ILS', to: 'GBP').and_return(double(execute: double(result: 0.5)))
        end

        expected_response = {
          charges: {
            fare_cost: 2652,
            handling_fee: 531,
            booking_fee: 75,
            free_waiting_time: 180,
            paid_waiting_time: 5353,
            paid_waiting_time_fee: 725,
            stops_text: "+1.24 mi",
            stops_fee: 305,
            additional_fee: 500,
            extra1: 1250,
            extra2: 100,
            extra3: 500,
            tips: 265,
            sales_tax: 1328,
            black_car_tax: 121
          },
          distance: 14.3606,
          distance_label: "miles",
          duration: "00:19:56"
        }

        it { is_expected.to eq expected_response }
      end
    end
  end
end

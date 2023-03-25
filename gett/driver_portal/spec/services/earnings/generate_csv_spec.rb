require 'rails_helper'

RSpec.describe Earnings::GenerateCSV do
  describe '#execute!' do
    let(:gett_id) { 1234 }
    let(:current_user) { create(:user, :with_site_admin_role, gett_id: gett_id) }

    subject { described_class.new(current_user, params) }

    let(:from) { '2017-11-30T08:20:37Z' }
    let(:to) { '2017-12-30T08:20:37Z' }

    let(:params) do
      {
        driver: current_user,
        from: from,
        to: to,
        external_ids: ['external_id_2']
      }
    end

    context 'when earnings retrieved' do
      let(:earnings) do
        [
          {
            external_id: 'external_id_1'
          },
          {
            external_id: 'external_id_2',
            order_id: 'order_id',
            transaction_type: { name: 'transaction_type' },
            issued_at: 'issued_at',
            origin: { full_address: 'origin' },
            destination: { full_address: 'destination' },
            taxi_fare: 'taxi_fare',
            gratuity: 'gratuity',
            extras: 'extras',
            cancellation_fee: 'cancellation_fee',
            vat: 'vat',
            commission: 'commission',
            waiting: 'waiting',
            peak_hour_premium: 'peak_hour_premium',
            total: 'total',
            redundant_field: 'redundant_field'
          }
        ]
      end

      before(:each) { stub_service(Earnings::List, earnings: earnings) }

      it 'runs successfully' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.csv).to be_present
      end

      it 'generates CSV with desired columns' do
        subject.execute!
        expect(CSV.parse(subject.csv, headers: true).first.to_h).to eq(
          'Order ID' => 'order_id',
          'Earning type' => 'transaction_type',
          'Date and time' => 'issued_at',
          'Pickup address' => 'origin',
          'Destination address' => 'destination',
          'Base fare' => 'taxi_fare',
          'Tips' => 'gratuity',
          'Extras' => 'extras',
          'Cancellation fee' => 'cancellation_fee',
          'VAT' => 'vat',
          'Commission' => 'commission',
          'Waiting time cost' => 'waiting',
          'Peak Hour Premium' => 'peak_hour_premium',
          'Total' => 'total',
        )
      end
    end

    context 'when earnings retrieval failed' do
      before(:each) { stub_service(Earnings::List, false, earnings: nil, errors: {a: :b}) }

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.csv).to be_nil
        expect(subject.errors).to eq({a: :b})
      end
    end
  end
end

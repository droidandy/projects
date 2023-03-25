require 'rails_helper'

RSpec.describe Bookings::FetchPaymentTypes, type: :service do
  let(:company) do
    create(:company,
      payment_types: payment_types,
      default_payment_type: default_payment_type
    )
  end
  let(:passenger) { create(:passenger, company: company) }
  let!(:card)     { create(:payment_card, :business, passenger: passenger) }

  let(:service) do
    Bookings::FetchPaymentTypes.new(
      company: company,
      passenger: passenger,
      vehicle_name: 'Standard'
    )
  end

  let(:payment_types) { ['account', 'passenger_payment_card'] }
  let(:default_payment_type) { 'passenger_payment_card' }

  describe 'execution results' do
    it 'fetches array of payment type options' do
      expect(service.execute.result).to eq([
        {payment_method: 'account', value: 'account', label: 'Account', default: false},
        {
          payment_method: 'business_payment_card',
          value: "business_payment_card:#{card.id}",
          label: card.title,
          payment_card_id: card.id,
          default: true
        }
      ])

      expect(service.default_payment_type).to eq("business_payment_card:#{card.id}")
    end
  end

  describe '#default_payment_type' do
    context 'passenger has no payment cards' do
      let(:card) { nil }

      context 'passenger_payment_card payment type' do
        let(:payment_types) { ['passenger_payment_card'] }

        it 'has no default payment type' do
          expect(service.execute).to be_success
          expect(service.default_payment_type).to be_nil
        end
      end

      context 'passenger_payment_card_periodic payment type' do
        let(:payment_types) { ['passenger_payment_card_periodic'] }
        let(:default_payment_type) { 'passenger_payment_card_periodic' }

        it 'has no default payment type' do
          expect(service.execute).to be_success
          expect(service.default_payment_type).to be_nil
        end
      end
    end
  end
end

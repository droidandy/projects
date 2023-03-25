require 'rails_helper'

RSpec.describe Bookings::FetchPaymentCard, type: :service do
  let(:company)      { create(:company, :enterprise) }
  let(:passenger)    { create(:passenger, company: company) }
  let(:booker)       { create(:booker, company: company) }
  let(:admin)        { create(:user, :admin) }
  let(:payment_card) { create(:payment_card, :business, passenger: passenger) }

  let(:service) { Bookings::FetchPaymentCard.new(passenger: passenger, payment_card_id: payment_card.id) }

  service_context { {company: company, user: admin} }

  subject { service.execute.result }

  context 'when can be fetched' do
    it { is_expected.to eq payment_card }
  end

  context 'when company is affiliate' do
    let(:passenger) { create(:admin, company: company) }
    let(:company)   { create(:company, :affiliate) }

    it { is_expected.to be nil }
  end

  context 'when card is personal' do
    let(:payment_card) { create(:payment_card, :personal, passenger: passenger) }

    context 'for backoffice executioner' do
      context 'when passenger allows to use it' do
        let(:passenger) { create(:passenger, company: company, allow_personal_card_usage: true) }

        it { is_expected.to eq payment_card }
      end

      context 'when passenger forbids to use it' do
        let(:passenger) { create(:passenger, company: company, allow_personal_card_usage: false) }

        it { is_expected.to be nil }

        context 'when accessing card information from backoffice' do
          service_context { {company: company, user: admin, back_office: true} }

          it { is_expected.to eq payment_card }
        end
      end
    end

    context 'for company booker executioner' do
      service_context { {company: company, user: booker} }

      context 'and passenger allows to use it' do
        let(:passenger) { create(:passenger, company: company, allow_personal_card_usage: true) }

        it { is_expected.to eq payment_card }
      end

      context 'but passenger forbids to use it' do
        let(:passenger) { create(:passenger, company: company, allow_personal_card_usage: false) }

        it { is_expected.to be nil }
      end
    end

    context 'for passenger executioner' do
      let(:passenger) { create(:passenger, company: company, allow_personal_card_usage: false) }

      service_context { {company: company, user: passenger} }

      it { is_expected.to eq payment_card }
    end
  end

  context 'when card is expired' do
    let(:payment_card) { create(:payment_card, :business, passenger: passenger, expiration_year: Date.current.year - 1) }

    it { is_expected.to be nil }
  end
end

require 'rails_helper'

RSpec.describe Bookings::IndexPolicy, type: :policy do
  let(:company)                   { create(:company) }
  let(:admin)                     { create(:admin, company: company) }
  let(:finance)                   { create(:finance, company: company) }
  let(:travelmanager)             { create(:travelmanager, company: company) }
  let(:booker)                    { create(:booker, company: company, passenger_pks: [passenger.id]) }
  let(:booker2)                   { create(:booker, company: company) }
  let(:passenger)                 { create(:passenger, company: company) }
  let(:payment_card)              { create(:payment_card, passenger: passenger) }
  let(:payment_card2)             { create(:payment_card, passenger: booker) }
  let(:passenger2)                { create(:passenger, company: company) }
  let(:booker_without_booking)    { create(:booker, company: company) }

  let(:booker_booking)            { create(:booking, booker: booker) }
  let(:booker_own_booking)        { create(:booking, booker: booker, passenger: booker) }
  let(:booker_passenger_booking)  { create(:booking, booker: booker2, passenger: booker) }
  let(:booker2_booking)           { create(:booking, :without_passenger, booker: booker2) }
  let(:passenger_booking)         { create(:booking, booker: create(:booker, company: company), passenger: passenger) }
  let(:passenger2_booking)        { create(:booking, booker: create(:booker, company: company), passenger: passenger2) }
  let(:booking_without_passenger) { create(:booking, :without_passenger, booker: booker) }

  let(:payment_card_own_booking)       { create(:booking, :payment_by_personal_card, booker: passenger, passenger: passenger, payment_card: payment_card) }
  let(:passenger_payment_card_booking) { create(:booking, :payment_by_personal_card, booker: booker, passenger: passenger, payment_card: payment_card) }
  let(:payment_card_booker_booking)    { create(:booking, :payment_by_personal_card, booker: booker, passenger: booker, payment_card: payment_card2) }
  let(:payment_card_finance_booking)   { create(:booking, :payment_by_personal_card, booker: finance, passenger: finance, payment_card: payment_card) }
  let(:payment_card_admin_booking)     { create(:booking, :payment_by_personal_card, booker: admin, passenger: admin, payment_card: payment_card) }
  let(:payment_card_tm_booking)        { create(:booking, :payment_by_personal_card, booker: travelmanager, passenger: travelmanager, payment_card: payment_card) }

  let(:service) { Bookings::Index.new }

  permissions :execute? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(finance) }
    it { is_expected.to permit(service).for(travelmanager) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.to permit(service).for(booker2) }
    it { is_expected.to permit(service).for(passenger) }
    it { is_expected.to permit(service).for(booker_without_booking) }
  end

  scope do
    preload(
      :booker_booking,
      :booker_own_booking,
      :booker_passenger_booking,
      :booker2_booking,
      :passenger_booking,
      :passenger2_booking,
      :booking_without_passenger,
      :payment_card_own_booking,
      :passenger_payment_card_booking,
      :payment_card_booker_booking,
      :payment_card_finance_booking,
      :payment_card_admin_booking,
      :payment_card_tm_booking
    )

    it {
      is_expected.to resolve_to([
        booker_booking,
        booker_own_booking,
        booker_passenger_booking,
        booker2_booking,
        passenger_booking,
        passenger2_booking,
        booking_without_passenger,
        payment_card_admin_booking
      ]).for(admin)
    }

    it {
      is_expected.to resolve_to([
        booker_booking,
        booker_own_booking,
        booker_passenger_booking,
        booker2_booking,
        passenger_booking,
        passenger2_booking,
        booking_without_passenger,
        payment_card_finance_booking
      ]).for(finance)
    }

    it {
      is_expected.to resolve_to([
        booker_booking,
        booker_own_booking,
        booker_passenger_booking,
        booker2_booking,
        passenger_booking,
        passenger2_booking,
        booking_without_passenger,
        payment_card_tm_booking
      ]).for(travelmanager)
    }

    it {
      is_expected.to resolve_to([
        booker_booking,
        booker_own_booking,
        booker_passenger_booking,
        passenger_booking,
        booking_without_passenger,
        payment_card_booker_booking
      ]).for(booker)
    }

    it {
      is_expected.to resolve_to([
        booker_passenger_booking,
        booker2_booking
      ]).for(booker2)
    }

    it { is_expected.to resolve_to([passenger_booking, payment_card_own_booking, passenger_payment_card_booking]).for(passenger) }
    it { is_expected.to resolve_to([passenger2_booking]).for(passenger2) }

    context 'passenger allows personal card usage' do
      let(:passenger) { create(:passenger, company: company, allow_personal_card_usage: true, booker_pks: [assigned_booker&.id].compact) }
      let(:assigned_booker) { nil }

      context 'for booker' do
        it {
          is_expected.to resolve_to([
            booker_booking,
            booker_own_booking,
            booker_passenger_booking,
            passenger_booking,
            booking_without_passenger,
            payment_card_own_booking,
            passenger_payment_card_booking,
            payment_card_booker_booking
          ]).for(booker)
        }

        context 'for bbc company' do
          let(:company) { create(:company, :bbc) }

          it {
            is_expected.to resolve_to([
              booker_own_booking,
              booker_passenger_booking,
              passenger_booking,
              booking_without_passenger,
              payment_card_own_booking,
              passenger_payment_card_booking,
              payment_card_booker_booking
            ]).for(booker)
          }
        end
      end

      context 'for admin' do
        it {
          is_expected.to resolve_to([
            booker_booking,
            booker_own_booking,
            booker_passenger_booking,
            booker2_booking,
            passenger_booking,
            passenger2_booking,
            booking_without_passenger,
            payment_card_own_booking,
            passenger_payment_card_booking,
            payment_card_admin_booking
          ]).for(admin)
        }
      end

      context 'for travelmanager' do
        it {
          is_expected.to resolve_to([
            booker_booking,
            booker_own_booking,
            booker_passenger_booking,
            booker2_booking,
            passenger_booking,
            passenger2_booking,
            booking_without_passenger,
            payment_card_own_booking,
            passenger_payment_card_booking,
            payment_card_tm_booking
          ]).for(travelmanager)
        }
      end

      context 'for admin who is booker for passenger' do
        let(:assigned_booker) { admin }

        it {
          is_expected.to resolve_to([
            booker_booking,
            booker_own_booking,
            booker_passenger_booking,
            passenger_booking,
            passenger2_booking,
            booking_without_passenger,
            payment_card_own_booking,
            passenger_payment_card_booking,
            booker2_booking,
            payment_card_admin_booking
          ]).for(admin)
        }
      end

      context 'for finance' do
        it {
          is_expected.to resolve_to([
            booker_booking,
            booker_own_booking,
            booker_passenger_booking,
            booker2_booking,
            passenger_booking,
            passenger2_booking,
            booking_without_passenger,
            payment_card_own_booking,
            passenger_payment_card_booking,
            payment_card_finance_booking
          ]).for(finance)
        }
      end

      context 'for travelmanager' do
        it {
          is_expected.to resolve_to([
            booker_booking,
            booker_own_booking,
            booker_passenger_booking,
            booker2_booking,
            passenger_booking,
            passenger2_booking,
            booking_without_passenger,
            payment_card_own_booking,
            passenger_payment_card_booking,
            payment_card_tm_booking
          ]).for(travelmanager)
        }
      end

      context 'for finance who is booker for passenger' do
        let(:assigned_booker) { finance }

        it {
          is_expected.to resolve_to([
            booker_booking,
            booker_own_booking,
            booker_passenger_booking,
            passenger_booking,
            passenger2_booking,
            booking_without_passenger,
            payment_card_own_booking,
            passenger_payment_card_booking,
            booker2_booking,
            payment_card_finance_booking
          ]).for(finance)
        }
      end

      context 'for travelmanager who is booker for passenger' do
        let(:assigned_booker) { travelmanager }

        it {
          is_expected.to resolve_to([
            booker_booking,
            booker_own_booking,
            booker_passenger_booking,
            passenger_booking,
            passenger2_booking,
            booking_without_passenger,
            payment_card_own_booking,
            passenger_payment_card_booking,
            booker2_booking,
            payment_card_tm_booking
          ]).for(travelmanager)
        }
      end
    end

    context 'passenger does not allow personal card usage' do
      let(:passenger) { create(:passenger, company: company, allow_personal_card_usage: false, booker_pks: [assigned_booker&.id].compact) }
      let(:assigned_booker) { nil }

      context 'for booker' do
        it {
          is_expected.to resolve_to([
            booker_booking,
            booker_own_booking,
            booker_passenger_booking,
            passenger_booking,
            booking_without_passenger,
            payment_card_booker_booking
          ]).for(booker)
        }
        context 'for bbc company' do
          let(:company) { create(:company, :bbc) }

          it {
            is_expected.to resolve_to([
              booker_own_booking,
              booker_passenger_booking,
              passenger_booking,
              booking_without_passenger,
              payment_card_own_booking,
              passenger_payment_card_booking,
              payment_card_booker_booking
            ]).for(booker)
          }
        end
      end

      context 'for admin' do
        it {
          is_expected.to resolve_to([
            booker_booking,
            booker_own_booking,
            booker_passenger_booking,
            booker2_booking,
            passenger_booking,
            passenger2_booking,
            booking_without_passenger,
            payment_card_admin_booking
          ]).for(admin)
        }
      end

      context 'for travelmanager' do
        it {
          is_expected.to resolve_to([
            booker_booking,
            booker_own_booking,
            booker_passenger_booking,
            booker2_booking,
            passenger_booking,
            passenger2_booking,
            booking_without_passenger,
            payment_card_tm_booking
          ]).for(travelmanager)
        }
      end

      context 'for admin who is booker for passenger' do
        let(:assigned_booker) { admin }

        it {
          is_expected.to resolve_to([
            booker_booking,
            booker_own_booking,
            booker_passenger_booking,
            booker2_booking,
            passenger_booking,
            passenger2_booking,
            booking_without_passenger,
            payment_card_admin_booking
          ]).for(admin)
        }
      end

      context 'for finance who is booker for passenger' do
        let(:assigned_booker) { finance }

        it {
          is_expected.to resolve_to([
            booker_booking,
            booker_own_booking,
            booker_passenger_booking,
            booker2_booking,
            passenger_booking,
            passenger2_booking,
            booking_without_passenger,
            payment_card_finance_booking
          ]).for(finance)
        }
      end

      context 'for travelmanager who is booker for passenger' do
        let(:assigned_booker) { travelmanager }

        it {
          is_expected.to resolve_to([
            booker_booking,
            booker_own_booking,
            booker_passenger_booking,
            booker2_booking,
            passenger_booking,
            passenger2_booking,
            booking_without_passenger,
            payment_card_tm_booking
          ]).for(travelmanager)
        }
      end
    end
  end
end

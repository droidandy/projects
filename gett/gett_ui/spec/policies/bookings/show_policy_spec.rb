require 'rails_helper'

RSpec.describe Bookings::ShowPolicy, type: :policy do
  let(:company)         { create(:company) }
  let(:admin)           { create(:admin, company: company) }
  let(:finance)         { create(:finance, company: company) }
  let(:travelmanager)   { create(:travelmanager, company: company) }
  let!(:booker)         { create(:booker, company: company, passenger_pks: [passenger.id]) }
  let(:other_booker)    { create(:booker, company: company) }
  let(:passenger)       { create(:passenger, company: company) }
  let(:other_passenger) { create(:passenger, company: company) }

  let(:service) { Bookings::Show.new(booking: booking.reload) }

  permissions :execute? do
    context 'when booking with passenger related to booker' do
      let!(:booking) { create(:booking, passenger: passenger) }

      it { is_expected.to permit(service).for(admin) }
      it { is_expected.to permit(service).for(finance) }
      it { is_expected.to permit(service).for(travelmanager) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.to permit(service).for(passenger) }

      it { is_expected.not_to permit(service).for(other_booker) }
      it { is_expected.not_to permit(service).for(other_passenger) }
    end

    context 'when booking with passenger not related to booker' do
      let!(:booking) { create(:booking, passenger: other_passenger) }

      it { is_expected.to permit(service).for(admin) }
      it { is_expected.to permit(service).for(travelmanager) }
      it { is_expected.not_to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(other_booker) }
      it { is_expected.to permit(service).for(other_passenger) }

      it { is_expected.not_to permit(service).for(passenger) }
    end

    context 'when booking with custom passenger' do
      let!(:booking) { create(:booking, :without_passenger, booker: booker) }

      it { is_expected.to permit(service).for(admin) }
      it { is_expected.to permit(service).for(travelmanager) }
      it { is_expected.to permit(service).for(booker) }

      it { is_expected.not_to permit(service).for(other_booker) }
      it { is_expected.not_to permit(service).for(passenger) }
      it { is_expected.not_to permit(service).for(other_passenger) }
    end

    context 'when booker is passenger' do
      let!(:booking) { create(:booking, passenger: booker, booker: other_booker) }

      it { is_expected.to permit(service).for(admin) }
      it { is_expected.to permit(service).for(travelmanager) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.to permit(service).for(other_booker) }

      it { is_expected.not_to permit(service).for(passenger) }
      it { is_expected.not_to permit(service).for(other_passenger) }
    end
  end
end

require 'rails_helper'

RSpec.describe Bookings::CancelPolicy, type: :policy do
  let(:company)         { create :company }
  let(:admin)           { create :admin, company: company }
  let(:booker)          { create :booker, company: company }
  let(:passenger)       { create :passenger, company: company, booker_pks: [booker.id] }
  let(:other_booker)    { create :booker, company: company }
  let(:other_passenger) { create :passenger, company: company }

  let(:service) { Bookings::Cancel.new(booking: booking) }

  permissions :execute? do
    context 'when booking has passenger' do
      let(:booking) { create :booking, booker: booker, passenger: passenger }

      it { is_expected.to permit(service).for(admin) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.to permit(service).for(passenger) }
      it { is_expected.not_to permit(service).for(other_booker) }
      it { is_expected.not_to permit(service).for(other_passenger) }
    end

    context 'when booking has no passenger' do
      let(:booking) { create :booking, :without_passenger, booker: booker }

      it { is_expected.to permit(service).for(admin) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(passenger) }
      it { is_expected.not_to permit(service).for(other_booker) }
    end
  end
end

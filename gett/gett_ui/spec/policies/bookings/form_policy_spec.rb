require 'rails_helper'

RSpec.describe Bookings::FormPolicy, type: :policy do
  let(:company)   { create :company }
  let(:admin)     { create :admin, company: company }
  let(:booker)    { create :booker, company: company }
  let(:passenger) { create :passenger, company: company }

  let(:service) { Bookings::Form.new }

  permissions :execute? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.to permit(service).for(passenger) }
  end

  permissions :select_passenger? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  permissions :change_vehicle_count? do
    it { is_expected.to permit(service).for(admin) }
    it { is_expected.to permit(service).for(booker) }
    it { is_expected.not_to permit(service).for(passenger) }
  end

  context 'when modify booking' do
    let(:booking) { create :booking, booker: booker }

    let(:service) { Bookings::Form.new(booking: booking) }

    permissions :select_passenger? do
      it { is_expected.to permit(service).for(admin) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(passenger) }
    end

    permissions :change_vehicle_count? do
      it { is_expected.to permit(service).for(admin) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(passenger) }
    end
  end

  context 'when multiple_booking disabled' do
    let(:company) { create :company, multiple_booking: false }

    permissions :change_vehicle_count? do
      it { is_expected.to permit(service).for(admin) }
      it { is_expected.to permit(service).for(booker) }
      it { is_expected.not_to permit(service).for(passenger) }
    end
  end
end

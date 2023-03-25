require 'rails_helper'

RSpec.describe Bookings::ScheduleValidator, type: :service do
  let(:company)   { create(:company) }
  let(:passenger) { create(:passenger, company: company) }
  let(:vehicle)   { create(:vehicle, :gett) }
  let(:vehicle2)  { create(:vehicle, :gett, value: 'another_value') }

  let(:scheduled_ats) { [DateTime.new(2018, 2, 12, 12), DateTime.new(2018, 2, 13, 12)] } # Monday, Tuesday

  let(:service) do
    Bookings::ScheduleValidator.new(
      company: company,
      scheduled_ats: scheduled_ats,
      vehicle_value: vehicle.value,
      passenger_id: passenger.id
    )
  end

  context 'when no travel rules exist' do
    describe 'execution results' do
      subject { service.execute.result }

      it { is_expected.to eq(available_scheduled_ats: scheduled_ats, unavailable_scheduled_ats: []) }
    end
  end

  context 'when matching travel rule exist' do
    before do
      [create(:travel_rule, company: company, members: [passenger], vehicles: [vehicle2], weekdays: 1)]
      # Tuesdays, allows another vehicle, so this day is not allowed
    end

    subject { service.execute.result }

    describe 'execution results' do
      subject { service.execute.result }

      it { is_expected.to eq(available_scheduled_ats: [scheduled_ats[1]], unavailable_scheduled_ats: [scheduled_ats[0]]) }
    end
  end
end

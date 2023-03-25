require 'rails_helper'

RSpec.describe Bookings::MonthlyStats, type: :service do
  before { Timecop.freeze('2017-05-20'.to_date) }
  after  { Timecop.return }

  let(:pickup_address)      { create :address }
  let(:destination_address) { create :address }
  let(:booker)  { create :booker }
  let(:service) { Bookings::MonthlyStats.new(dataset: Booking.where(booker_id: booker.id), show_daily_spent: true) }

  def create_bookings(amount, *traits, **attrs)
    create_list :booking, amount, :completed, :without_passenger, *traits, attrs.reverse_merge(
      booker: booker, pickup_address: pickup_address, destination_address: destination_address
    )
  end

  describe ':daily_orders' do
    let(:result) { service.execute.result[:daily_orders] }

    before do
      create_bookings 3
      create_bookings 4, created_at: Time.current - 1.month
      create_bookings 3, created_at: Time.current - 2.days
    end

    it 'returns correct count of orders for booker' do
      expect(result.find{ |data| data[:day] == '20' }).to include current: 3, previous: 4
      expect(result.find{ |data| data[:day] == '18' }).to include current: 3, previous: 0
      expect(result.find{ |data| data[:day] == '22' }).to include current: nil, previous: 0
    end
  end

  describe ':daily_spent' do
    let(:result) { service.execute.result[:daily_spent] }

    before do
      create_bookings 3, total_cost: 100
      create_bookings 4, total_cost: 200, created_at: Time.current - 1.month
      create_bookings 3, total_cost: 300, created_at: Time.current - 2.days
    end

    it 'returns correct total amount of orders for booker' do
      expect(result.find{ |data| data[:day] == '20' }).to include current: 3.0, previous: 8.0
      expect(result.find{ |data| data[:day] == '18' }).to include current: 9.0, previous: 0
      expect(result.find{ |data| data[:day] == '22' }).to include current: nil, previous: 0
    end
  end

  describe ':types_data' do
    before do
      create_bookings 3
      create_bookings 2, :scheduled
    end

    subject { service.execute.result[:types_data] }

    it { is_expected.to eq asap: 0.6, scheduled: 0.4, total: 5 }
  end
end

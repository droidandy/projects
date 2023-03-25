require 'features_helper'

feature 'Reports' do
  let(:company)      { create(:company) }
  let(:stats_page)   { Pages::App.statistics }
  let(:current_time) { Time.zone.now.beginning_of_month }
  before { login_to_app_as(company.admin.email) }

  scenario 'Statistics' do
    pass = create(:passenger, company: company)
    pass2 = create(:passenger, :with_payment_cards, company: company)

    Timecop.freeze(current_time.prev_month) do
      create(:booking, :completed, :with_charges, :ot, vehicle_name: 'MPV', passenger: pass)
      create(:booking, :completed, :with_charges, :reincarnated, passenger: pass)
      create(:booking, :completed, :with_charges, :scheduled, :ot, vehicle_name: 'Exec', passenger: pass)
      create(:booking, :completed, :with_charges, :personal_card, :gett, vehicle_name: 'BlackTaxiXL', passenger: pass2)
      create(:booking, :completed, :with_charges, :business_card, :scheduled, :ot, vehicle_name: 'Standard', passenger: pass2)
      create(:booking, :completed, :with_charges, :manual, :cash, passenger: pass)
      create(:booking, :completed, :with_charges, :without_passenger, :cash, :ot, vehicle_name: 'MPV', booker: company.admin)
      create(:booking, :completed, :with_charges, :without_passenger, :gett, vehicle_name: 'BlackTaxiXL', booker: company.admin)
      create(:booking, :completed, :with_charges, international: true, passenger: pass)
      create(:booking, :cancelled, :cash, :ot, vehicle_name: 'MPV', passenger: pass)
      create(:booking, :rejected, :ot, :reincarnated, vehicle_name: 'Standard', passenger: pass2)
    end

    # Current month orders
    Timecop.freeze(current_time) do
      create(:booking, :completed, :with_charges, :ot, vehicle_name: 'Standard', fare_quote: 2500, paid_waiting_time_fee: 500, passenger: pass)
      create(:booking, :completed, :with_charges, :reincarnated, fare_quote: 1500, passenger: pass)
      create(:booking, :completed, :with_charges, :scheduled, :gett, vehicle_name: 'BlackTaxiXL', passenger: pass)
      create(:booking, :completed, :with_charges, :personal_card, :ot, vehicle_name: 'Exec', fare_quote: 2300, passenger: pass2)
      create(:booking, :completed, :with_charges, :ot, vehicle_name: 'Exec', fare_quote: 3500, passenger: pass2)
      create(:booking, :completed, :with_charges, :scheduled, :business_card, :ot, vehicle_name: 'MPV', passenger: pass2)
      create(:booking, :completed, :with_charges, :reincarnated, :cash, :manual, passenger: pass)
      create(:booking, :completed, :with_charges, :without_passenger, :cash, :ot, vehicle_name: 'Standard', booker: company.admin)
      create(:booking, :completed, :with_charges, :scheduled, :without_passenger, fare_quote: 4500, booker: company.admin)
      create(:booking, :completed, :with_charges, :reincarnated, :without_passenger, :manual, booker: company.admin)
      create(:booking, :completed, :with_charges, international: true, paid_waiting_time_fee: 700, passenger: pass)
      create(:booking, :cancelled, :scheduled, :cash, paid_waiting_time_fee: 200, passenger: pass)
      create(:booking, :cancelled, :personal_card, :ot, vehicle_name: 'Standard', passenger: pass2)
      create(:booking, :rejected, :scheduled, :manual, passenger: pass)

      stats_page.load
      BM.sleep 2 # give time for charts to be fully rendered

      stats_page.completed_cancelled_orders_chart.first_month.hover
      expect(stats_page.completed_cancelled_orders_chart.tooltip.text).to include('Cancelled: 1', 'Completed: 8')
      stats_page.completed_cancelled_orders_chart.last_month.hover
      expect(stats_page.completed_cancelled_orders_chart.tooltip.text).to include('Cancelled: 1', 'Completed: 10')

      completed_orders_by_car_types_prev_month    = 'Standard: 2 Black Taxi: 1 Black Taxi XL: 1 Exec: 1 MPV: 2 Special: 1 Gett XL: 0 Gett Express: 0 Economy: 0 Standard XL: 0 Business: 0 Baby Seat: 0 Wheelchair: 0 Chauffeur: 0'
      completed_orders_by_car_types_current_month = 'Standard: 3 Black Taxi: 2 Black Taxi XL: 1 Exec: 1 MPV: 1 Special: 2 Gett XL: 0 Gett Express: 0 Economy: 0 Standard XL: 0 Business: 0 Baby Seat: 0 Wheelchair: 0 Chauffeur: 0'

      stats_page.completed_orders_by_car_type_chart.first_month.hover
      expect(stats_page.completed_orders_by_car_type_chart.tooltip.text).to include(completed_orders_by_car_types_prev_month)
      stats_page.completed_orders_by_car_type_chart.last_month.hover
      expect(stats_page.completed_orders_by_car_type_chart.tooltip.text).to include(completed_orders_by_car_types_current_month)

      stats_page.spend_by_booking_type_chart.first_month.hover
      expect(stats_page.spend_by_booking_type_chart.tooltip.text).to include('Web: 133', 'Phone: 19')
      stats_page.spend_by_booking_type_chart.last_month.hover
      expect(stats_page.spend_by_booking_type_chart.tooltip.text).to include('Web: 181', 'Phone: 53')
      stats_page.daily_spend_vs_prev_month_chart.hover_day(current_time.day)
      expect(stats_page.daily_spend_vs_prev_month_chart.tooltip.text).to include('Previous: 152', 'Current: 234')

      stats_page.completed_rides_by_city_chart.hover
      expect(stats_page.completed_rides_by_city_chart.tooltip.text).to eql('All Cities: 10')

      stats_page.spend_by_city_chart.hover
      expect(stats_page.spend_by_city_chart.tooltip.text).to eql('All Cities: 234')

      stats_page.waiting_time_by_city_chart.hover
      expect(stats_page.waiting_time_by_city_chart.tooltip.text).to eql('All Cities: 12')

      avg_ride_cost = 'Standard: 21 Black Taxi: 30 Black Taxi XL: 19 Exec: 35 MPV: 19 Special: 19 Gett XL: 0 Gett Express: 0 Economy: 0 Standard XL: 0 Business: 0 Baby Seat: 0 Wheelchair: 0 Chauffeur: 0'
      stats_page.avg_ride_cost_per_vehicle_type_by_city_chart.hover
      expect(stats_page.avg_ride_cost_per_vehicle_type_by_city_chart.tooltip.text).to eql(avg_ride_cost)

      expect(stats_page.completed_orders_by_car_type_pie_chart.labels.text).to eql('Standard 30.00% Black Taxi 20.00% Black Taxi XL 10.00% Exec 10.00% MPV 10.00% Special 20.00%')
      expect(stats_page.completed_orders_by_future_asap_pie_chart.labels.text).to eql('ASAP 70.00% Future 30.00%')
    end
  end
end

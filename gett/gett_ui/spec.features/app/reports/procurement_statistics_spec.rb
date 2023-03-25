require 'features_helper'

feature 'Reports' do
  let(:subcompany) { create(:company) }
  let(:company) { create(:company, linked_company_pks: [subcompany.pk]) }
  let(:stats_page) { Pages::App.procurement_statistics }
  let(:current_time) { Time.zone.now.beginning_of_month }
  before { login_to_app_as(company.admin.email) }

  scenario 'Procurement Statistics' do
    pass = create(:passenger, company: company)
    pass2 = create(:passenger, :with_payment_cards, company: company)
    pass3 = create(:passenger, company: subcompany)
    pass4 = create(:passenger, :with_payment_cards, company: subcompany)

    Timecop.freeze(current_time.prev_month) do
      # Main company orders
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

      # Subcompany orders
      create(:booking, :completed, :with_charges, :ot, vehicle_name: 'Standard', passenger: pass3)
      create(:booking, :completed, :with_charges, :reincarnated, passenger: pass3)
      create(:booking, :completed, :with_charges, :scheduled, :ot, vehicle_name: 'Exec', passenger: pass3)
      create(:booking, :completed, :with_charges, :personal_card, :gett, vehicle_name: 'BlackTaxiXL', passenger: pass4)
      create(:booking, :completed, :with_charges, :business_card, :scheduled, :ot, vehicle_name: 'Standard', passenger: pass4)
      create(:booking, :completed, :with_charges, :manual, :cash, passenger: pass3)
      create(:booking, :completed, :with_charges, :without_passenger, :cash, :ot, vehicle_name: 'Exec', booker: subcompany.admin)
      create(:booking, :completed, :with_charges, :without_passenger, :manual, booker: subcompany.admin)
      create(:booking, :completed, :with_charges, international: true, passenger: pass3)
    end

    Timecop.freeze(current_time) do
      # Main Company current month orders
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

      # SubCompany current month orders
      create(:booking, :completed, :with_charges, :reincarnated, fare_quote: 4500, passenger: pass3)
      create(:booking, :completed, :with_charges, :scheduled, :gett, vehicle_name: 'BlackTaxiXL', passenger: pass3)
      create(:booking, :completed, :with_charges, :ot, vehicle_name: 'Exec', fare_quote: 3000, passenger: pass4)
      create(:booking, :completed, :with_charges, :scheduled, :business_card, :ot, vehicle_name: 'MPV', passenger: pass4)
      create(:booking, :completed, :with_charges, :reincarnated, :cash, :manual, passenger: pass3)
      create(:booking, :completed, :with_charges, :without_passenger, :cash, :ot, vehicle_name: 'MPV', booker: subcompany.admin)
      create(:booking, :completed, :with_charges, international: true, paid_waiting_time_fee: 450, passenger: pass3)
      create(:booking, :cancelled, :scheduled, :cash, paid_waiting_time_fee: 400, passenger: pass3)

      stats_page.load
      BM.sleep 2 # give time for charts to be fully rendered

      stats_page.completed_cancelled_orders_chart.first_month.hover
      expect(stats_page.completed_cancelled_orders_chart.tooltip.text).to include('Cancelled: 1', 'Completed: 16')
      stats_page.completed_cancelled_orders_chart.last_month.hover
      expect(stats_page.completed_cancelled_orders_chart.tooltip.text).to include('Cancelled: 2', 'Completed: 17')

      completed_orders_by_car_types_prev_month    = 'Standard: 5 Black Taxi: 2 Black Taxi XL: 1 Exec: 3 MPV: 2 Special: 3 Gett XL: 0 Gett Express: 0 Economy: 0 Standard XL: 0 Business: 0 Baby Seat: 0 Wheelchair: 0 Chauffeur: 0'
      completed_orders_by_car_types_current_month = 'Standard: 4 Black Taxi: 3 Black Taxi XL: 2 Exec: 2 MPV: 3 Special: 3 Gett XL: 0 Gett Express: 0 Economy: 0 Standard XL: 0 Business: 0 Baby Seat: 0 Wheelchair: 0 Chauffeur: 0'
      stats_page.completed_orders_by_car_type_chart.first_month.hover
      expect(stats_page.completed_orders_by_car_type_chart.tooltip.text).to include(completed_orders_by_car_types_prev_month)
      stats_page.completed_orders_by_car_type_chart.last_month.hover
      expect(stats_page.completed_orders_by_car_type_chart.tooltip.text).to include(completed_orders_by_car_types_current_month)

      stats_page.spend_by_booking_type_chart.first_month.hover
      expect(stats_page.spend_by_booking_type_chart.tooltip.text).to include('Web: 266', 'Phone: 38')
      stats_page.spend_by_booking_type_chart.last_month.hover
      expect(stats_page.spend_by_booking_type_chart.tooltip.text).to include('Web: 287', 'Phone: 117')

      stats_page.daily_spend_vs_prev_month_chart.hover_day(current_time.day)
      expect(stats_page.daily_spend_vs_prev_month_chart.tooltip.text).to include('Previous: 304', 'Current: 404')

      stats_page.completed_rides_by_city_chart.hover
      expect(stats_page.completed_rides_by_city_chart.tooltip.text).to eql('All Cities: 17')

      stats_page.spend_by_city_chart.hover
      expect(stats_page.spend_by_city_chart.tooltip.text).to eql('All Cities: 404')

      stats_page.waiting_time_by_city_chart.hover
      expect(stats_page.waiting_time_by_city_chart.tooltip.text).to eql('All Cities: 17')

      avg_ride_cost = 'Standard: 21 Black Taxi: 35 Black Taxi XL: 19 Exec: 33 MPV: 19 Special: 19 Gett XL: 0 Gett Express: 0 Economy: 0 Standard XL: 0 Business: 0 Baby Seat: 0 Wheelchair: 0 Chauffeur: 0'
      stats_page.avg_ride_cost_per_vehicle_type_by_city_chart.hover
      expect(stats_page.avg_ride_cost_per_vehicle_type_by_city_chart.tooltip.text).to eql(avg_ride_cost)

      stats_page.completed_rides_all_companies_chart.hover
      expect(stats_page.completed_rides_all_companies_chart.tooltip.text).to eql('All Companies: 17')

      stats_page.spend_all_companies_chart.hover
      expect(stats_page.spend_all_companies_chart.tooltip.text).to eql('All Companies: 404')

      stats_page.waiting_cost_all_companies_chart.hover
      expect(stats_page.waiting_cost_all_companies_chart.tooltip.text).to eql('All Companies: 17')

      stats_page.avg_ride_cost_per_vehicle_type_all_companies_chart.hover
      expect(stats_page.avg_ride_cost_per_vehicle_type_all_companies_chart.tooltip.text).to eql(avg_ride_cost)

      expect(stats_page.completed_orders_by_car_type_pie_chart.labels.text).to eql('Standard 23.53% Black Taxi 17.65% Black Taxi XL 11.76% Exec 11.76% MPV 17.65% Special 17.65%')
      expect(stats_page.completed_orders_by_future_asap_pie_chart.labels.text).to eql('ASAP 70.59% Future 29.41%')
    end
  end
end

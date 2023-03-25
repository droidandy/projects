require 'features_helper'

feature 'Company Statistics For' do
  let(:companies_page) { Pages::Admin.companies }

  scenario 'Enterprise Company' do
    company = create(:company, payment_types: %w(account passenger_payment_card cash))
    pass = create(:passenger, company: company)
    pass2 = create(:passenger, :with_payment_cards, company: company)

    Timecop.freeze(Time.now.utc.prev_month.beginning_of_month) do
      create(:booking, :completed, :with_charges, :ot, vehicle_name: 'MPV', passenger: pass)
      create(:booking, :completed, :with_charges, passenger: pass)
      create(:booking, :completed, :with_charges, :scheduled, :ot, vehicle_name: 'Exec', passenger: pass)
      create(:booking, :completed, :with_charges, :personal_card, :gett, vehicle_name: 'BlackTaxiXL', passenger: pass2)
      create(:booking, :completed, :with_charges, :business_card, :scheduled, :ot, vehicle_name: 'Standard', passenger: pass2)
      create(:booking, :completed, :with_charges, :manual, :cash, passenger: pass)
      create(:booking, :completed, :with_charges, :without_passenger, :cash, :ot, vehicle_name: 'MPV', booker: company.admin)
      create(:booking, :completed, :with_charges, :without_passenger, :gett, vehicle_name: 'BlackTaxiXL', booker: company.admin)
      create(:booking, :completed, :with_charges, :without_passenger, :gett, vehicle_name: 'Economy', booker: company.admin)
      create(:booking, :completed, :with_charges, :without_passenger, :gett, vehicle_name: 'StandardXL', booker: company.admin)
      create(:booking, :completed, :with_charges, :without_passenger, :gett, vehicle_name: 'Business', booker: company.admin)

      create(:booking, :cancelled, :cash, :ot, vehicle_name: 'MPV', passenger: pass)
      create(:booking, :rejected, :ot, vehicle_name: 'Standard', passenger: pass2)
      create(:booking, :rejected, :ot, vehicle_name: 'Exec', passenger: pass)
    end

    create(:invoice, company: company, amount_cents: Booking.completed.account.all.map{ |b| b.charges&.total_cost }.sum)

    # Current month orders
    Timecop.freeze(Time.now.utc.beginning_of_month) do
      create(:booking, :completed, :with_charges, :ot, vehicle_name: 'Standard', passenger: pass)

      create(:booking, :completed, :with_charges, passenger: pass)
      create(:booking, :completed, :with_charges, :scheduled, :gett, vehicle_name: 'BlackTaxiXL', passenger: pass)
      create(:booking, :completed, :with_charges, :personal_card, :ot, vehicle_name: 'Exec', passenger: pass2)
      create(:booking, :completed, :with_charges, :scheduled, :business_card, :ot, vehicle_name: 'MPV', passenger: pass2)
      create(:booking, :completed, :with_charges, :cash, :manual, passenger: pass)
      create(:booking, :completed, :with_charges, :without_passenger, :cash, :ot, vehicle_name: 'Standard', booker: company.admin)
      create(:booking, :completed, :with_charges, :scheduled, :without_passenger, booker: company.admin)
      create(:booking, :completed, :with_charges, :without_passenger, :manual, booker: company.admin)

      create(:booking, :cancelled, :scheduled, :cash, passenger: pass)
      create(:booking, :cancelled, :personal_card, :ot, vehicle_name: 'Standard', passenger: pass2)
      create(:booking, :rejected, :scheduled, :manual, passenger: pass)
    end

    login_as_super_admin
    companies_page.load
    company_record = companies_page.find_company(company.name)
    company_record.open_details
    details = company_record.details

    expect(details).to have_outstanding_balance(text: '£133')

    details.monthly_orders_chart.first_month.hover
    expect(details.monthly_orders_chart.tooltip.text).to include('Rejected: 2', 'Cancelled: 1', 'Completed: 11')

    details.monthly_orders_chart.last_month.hover
    expect(details.monthly_orders_chart.tooltip.text).to include('Rejected: 1', 'Cancelled: 2', 'Completed: 9')

    # Pending due to https://gett-uk.atlassian.net/browse/OU-3016
    # car_types_prev_month    = 'Standard: 1 Black Taxi: 1 Black Taxi XL: 2 Exec: 1 MPV: 2 Special: 1 Gett XL: 0 Gett Express: 0 Economy: 1 Standard XL: 1 Business: 1 Chauffeur: 0 Baby Seat: 0 Wheelchair: 0'
    # car_types_current_month = 'Standard: 2 Black Taxi: 2 Black Taxi XL: 1 Exec: 1 MPV: 1 Special: 2 Gett XL: 0 Gett Express: 0 Economy: 0 Standard XL: 0 Business: 0 Chauffeur: 0 Baby Seat: 0 Wheelchair: 0'

    # details.completed_orders_by_car_type_chart.first_month.hover
    # expect(details.completed_orders_by_car_type_chart.tooltip.text).to eql(car_types_prev_month)
    #
    # details.completed_orders_by_car_type_chart.last_month.hover
    # expect(details.completed_orders_by_car_type_chart.tooltip.text).to eql(car_types_current_month)

    details.monthly_spend_chart.first_month.hover
    expect(details.monthly_spend_chart.tooltip.text).to include('Spend: 209')

    details.monthly_spend_chart.last_month.hover
    expect(details.monthly_spend_chart.tooltip.text).to include('Spend: 171')

    spend_prev_month    = ['Cash: 2', 'Account: 7', 'Personal Credit: 1', 'Business Credit: 1', 'Company Credit: 0']
    spend_current_month = ['Cash: 2', 'Account: 5', 'Personal Credit: 1', 'Business Credit: 1', 'Company Credit: 0']

    details.completed_orders_by_payment_type_chart.first_month.hover
    expect(details.completed_orders_by_payment_type_chart.tooltip.text).to include(*spend_prev_month)

    details.completed_orders_by_payment_type_chart.last_month.hover
    expect(details.completed_orders_by_payment_type_chart.tooltip.text).to include(*spend_current_month)

    expect(details.order_types_chart.asap.text).to eql('ASAP 6 (66.67%)')
    expect(details.order_types_chart.future.text).to eql('Future 3 (33.33%)')
  end
end

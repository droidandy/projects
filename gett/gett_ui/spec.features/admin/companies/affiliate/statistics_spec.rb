require 'features_helper'

feature 'Company Statistics For' do
  let(:companies_page) { Pages::Admin.companies }

  scenario 'Affiliate Company' do
    company = create(:company, :affiliate)

    # Previous month orders
    Timecop.freeze(Time.now.utc.prev_month.beginning_of_month) do
      create(:booking, :completed, :with_charges, :without_passenger, booker: company.admin)
      create(:booking, :completed, :with_charges, :without_passenger, booker: company.admin)
      create(:booking, :completed, :with_charges, :scheduled, :without_passenger, booker: company.admin)
      create(:booking, :completed, :with_charges, :without_passenger, booker: company.admin)

      create(:booking, :cancelled, :without_passenger, booker: company.admin)
      create(:booking, :rejected, :without_passenger, booker: company.admin)
      create(:booking, :rejected, :without_passenger, booker: company.admin)
    end

    # Current month orders
    Timecop.freeze(Time.now.utc.beginning_of_month) do
      create(:booking, :completed, :with_charges, :without_passenger, booker: company.admin)
      create(:booking, :completed, :with_charges, :without_passenger, booker: company.admin)
      create(:booking, :completed, :with_charges, :scheduled, :without_passenger, booker: company.admin)
      create(:booking, :completed, :with_charges, :scheduled, :without_passenger, booker: company.admin)
      create(:booking, :completed, :with_charges, :without_passenger, booker: company.admin)

      create(:booking, :cancelled, :scheduled, :without_passenger, booker: company.admin)
      create(:booking, :cancelled, :without_passenger, booker: company.admin)
      create(:booking, :rejected, :without_passenger, booker: company.admin)
    end

    login_as_super_admin
    companies_page.load
    company_record = companies_page.find_company(company.name)
    company_record.open_details
    details = company_record.details
    sleep 2 # give time for charts to be fully rendered
    expect(details).to have_outstanding_balance(text: '£0')

    details.monthly_orders_chart.first_month.hover
    expect(details.monthly_orders_chart.tooltip.text).to include('Rejected: 2', 'Cancelled: 1', 'Completed: 4')

    details.monthly_orders_chart.last_month.hover
    expect(details.monthly_orders_chart.tooltip.text).to include('Rejected: 1', 'Cancelled: 2', 'Completed: 5')

    car_types_prev_month    = 'Standard: 0 Black Taxi: 4 Black Taxi XL: 0 Exec: 0 MPV: 0 Special: 0 Gett XL: 0 Gett Express: 0 Economy: 0 Standard XL: 0 Business: 0 Baby Seat: 0 Wheelchair: 0 Chauffeur: 0'
    car_types_current_month = 'Standard: 0 Black Taxi: 5 Black Taxi XL: 0 Exec: 0 MPV: 0 Special: 0 Gett XL: 0 Gett Express: 0 Economy: 0 Standard XL: 0 Business: 0 Baby Seat: 0 Wheelchair: 0 Chauffeur: 0'
    details.completed_orders_by_car_type_chart.first_month.hover
    expect(details.completed_orders_by_car_type_chart.tooltip.text).to include(car_types_prev_month)

    details.completed_orders_by_car_type_chart.last_month.hover
    expect(details.completed_orders_by_car_type_chart.tooltip.text).to include(car_types_current_month)

    details.monthly_spend_chart.first_month.hover
    expect(details.monthly_spend_chart.tooltip.text).to include('Spend: 76')

    details.monthly_spend_chart.last_month.hover
    expect(details.monthly_spend_chart.tooltip.text).to include('Spend: 95')

    spend_prev_month    = ['Cash: 4', 'Account: 0', 'Personal Credit: 0', 'Business Credit: 0', 'Company Credit: 0']
    spend_current_month = ['Cash: 5', 'Account: 0', 'Personal Credit: 0', 'Business Credit: 0', 'Company Credit: 0']

    details.completed_orders_by_payment_type_chart.first_month.hover
    expect(details.completed_orders_by_payment_type_chart.tooltip.text).to include(*spend_prev_month)

    details.completed_orders_by_payment_type_chart.last_month.hover
    expect(details.completed_orders_by_payment_type_chart.tooltip.text).to include(*spend_current_month)

    expect(details.order_types_chart.asap.text).to include('ASAP 3 (60.00%)')
    expect(details.order_types_chart.future.text).to include('Future 2 (40.00%)')
  end
end

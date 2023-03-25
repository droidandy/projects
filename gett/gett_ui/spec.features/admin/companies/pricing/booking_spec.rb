require 'features_helper'

feature 'New Booking' do
  let(:new_booking_page) { Pages::App.new_booking }
  let(:bookings_page)    { Pages::App.bookings }
  let!(:company) { create(:company, :enterprise, multiple_booking: true, booker_notifications: true, default_driver_message: 'Hurry Up!') }
  before do
    create(:pricing_rule, :area, company: company)
    login_as_super_admin
  end

  scenario 'Multiple Booking and Default Driver Message' do
    login_to_app_as(company.admin.email)
    new_booking_page.load
  end
end

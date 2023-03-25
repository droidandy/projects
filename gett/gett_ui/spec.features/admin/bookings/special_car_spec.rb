require 'features_helper'

feature 'Back Office Bookings - Special Car' do
  let(:booking_page) { Pages::Admin.ote_new_booking }
  let!(:company)     { create(:company, :enterprise) }

  ['admin', 'sales', 'customer_care', 'outsourced_customer_care'].each do |role|
    context "for #{role}" do
      let(:user_role) { Role.find_or_create(name: role) }
      let(:user)      { create(:user, user_role: user_role) }

      scenario 'is not available' do
        login_to_admin_as user.email do
          booking_page.load
        end

        booking_page.company_selector.select(company.name)
        booking_page.next_button.click

        booking_page.passenger_name.select(company.admin.full_name)
        booking_page.destination_address.select('48 Rue Ernest Renan, Bordeaux, France')

        booking_page.vehicles.wait_until_available
        expect(booking_page.vehicles.available_cars_list).not_to include('Special')
      end
    end
  end

  context "for superadmin" do
    let(:user_role) { Role.find_or_create(name: 'superadmin') }
    let(:user)      { create(:user, user_role: user_role) }

    scenario 'is not available' do
      login_to_admin_as user.email do
        booking_page.load
      end

      booking_page.company_selector.select(company.name)
      booking_page.next_button.click

      booking_page.passenger_name.select(company.admin.full_name)
      booking_page.destination_address.select('48 Rue Ernest Renan, Bordeaux, France')

      booking_page.vehicles.wait_until_available
      expect(booking_page.vehicles.available_cars_list).to include('Special')
    end
  end
end

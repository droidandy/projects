module Sections
  class App::LeftSideBar < SitePrism::Section
    element :name,            :xpath, '//*[@data-name="sidebarCompanyName"]'
    element :address,         :xpath, '//*[@data-name="sidebarCompanyAddress"]'
    element :new_booking,     :link,  'New Booking'
    element :active_bookings, :link,  'Active Bookings'
    element :passengers,      :link,  'Passengers'
    element :bookers,         :link,  'Bookers'
    element :dashboard,       :link,  'Dashboard'
    element :reports,         :link,  'Reports'
    element :settings,        :link,  'Settings'

    section :reports_menu, :xpath, '//div[./a[normalize-space(.)="Reports"]]' do
      element :bookings,               :link, 'Bookings'
      element :statistics,             :link, 'Statistics'
      element :procurement_statistics, :link, 'Procurement Statistics'
    end

    section :settings_menu, :xpath, '//div[./a[normalize-space(.)="Settings"]]' do
      element :travel_policy,     :link, 'Travel Policy'
      element :user_roles,        :link, 'Roles'
      element :departments,       :link, 'Departments'
      element :reason_for_travel, :link, 'Reason for Travel'
      element :account_details,   :link, 'Account Details'
      element :billing,           :link, 'Billing'
      element :change_password,   :link, 'Change Password'
      element :office_locations,  :link, 'Office Locations'
      element :report_settings,   :link, 'Report Settings'
    end

    element :user_name,     :xpath, '//*[@data-name="currentUserName"]'
    element :logout_button, :xpath, '//*[@data-name="logoutIcon"]'

    def current_user_name
      user_name.text
    end
  end
end

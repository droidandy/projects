module Sections
  class Admin::LeftSideBar < SitePrism::Section
    element :companies, :link, 'Companies'
    element :bookings, :link, 'Bookings'
    element :notifications, :link, 'Notifications'
    element :statistics, :link, 'Statistics'
    element :users, :link, 'Users'
    element :settings, :link, 'Settings'

    section :users_menu, :xpath, '//div[./a[normalize-space(.)="Users"]]' do
      element :gett_users, :link, 'Gett Users'
      element :all_users, :link, 'All Users'
    end

    section :settings_menu, :xpath, '//div[./a[normalize-space(.)="Settings"]]' do
      element :poi, :link, 'POI'
      element :system, :link, 'System'
      element :billing, :link, 'Billing'
    end

    element :ote_new_booking, :link, 'New Booking'

    element :user_name, :xpath, '//*[@data-name="currentUserName"]'
    element :logout_button, :xpath, '//*[@data-name="logoutIcon"]'

    def current_user_name
      user_name.text
    end
  end
end

module Sections
  class Affiliate::SideBar < SitePrism::Section
    element :close_button, '.close-menu-icon'
    element :name, :xpath, '//*[@data-name="sidebarCompanyName"]'
    element :address, :xpath, '//*[@data-name="sidebarCompanyAddress"]'
    element :bookings, :link, 'Bookings'
    element :reports, :link, 'Reports'
    element :bookers, :link, 'Bookers'
    element :account, :link, 'Account'
    element :password, :link, 'Password'
    element :logout_button, :link, 'Logout'
  end
end

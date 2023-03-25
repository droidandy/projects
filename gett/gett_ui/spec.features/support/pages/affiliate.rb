module Pages
  module Affiliate
    def self.bookings
      Pages::Affiliate::Bookings.new
    end

    def self.change_password
      Pages::Affiliate::ChangePassword.new
    end

    def self.bookers
      Pages::Affiliate::Bookers::List.new
    end

    def self.new_booker
      Pages::Affiliate::Bookers::New.new
    end

    def self.edit_booker
      Pages::Affiliate::Bookers::Edit.new
    end

    def self.account_details
      Pages::Affiliate::AccountDetails::List.new
    end

    def self.edit_account_details
      Pages::Affiliate::AccountDetails::Edit.new
    end
  end
end

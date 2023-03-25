module Pages
  module Admin
    def self.companies
      Pages::Admin::Companies::List.new
    end

    def self.new_company
      Pages::Admin::Companies::New.new
    end

    def self.edit_company
      Pages::Admin::Companies::Edit.new
    end

    def self.bookings
      Pages::Admin::Bookings::List.new
    end

    def self.edit_booking
      Pages::Admin::Bookings::Edit.new
    end

    def self.repeat_booking
      Pages::Admin::Bookings::Repeat.new
    end

    def self.statistics
      Pages::Admin::Statistics.new
    end

    def self.gett_users
      Pages::Admin::GettUsers::List.new
    end

    def self.new_gett_user
      Pages::Admin::GettUsers::New.new
    end

    def self.ote_new_booking
      Pages::Admin::OteNewBooking.new
    end

    def self.notifications
      Pages::Admin::Notifications.new
    end

    def self.poi_list
      Pages::Admin::POI::List.new
    end

    def self.system
      Pages::Admin::System.new
    end

    def self.billing
      Pages::Admin::Billing.new
    end

    def self.all_users
      Pages::Admin::AllUsers::List.new
    end

    def self.edit_user
      Pages::Admin::AllUsers::Edit.new
    end
  end
end

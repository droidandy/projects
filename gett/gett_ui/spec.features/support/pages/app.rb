module Pages
  module App
    def self.new_booking
      Pages::App::Bookings::New.new
    end

    def self.bookings
      Pages::App::Bookings::List.new
    end

    def self.edit_booking
      Pages::App::Bookings::Edit.new
    end

    def self.repeat_booking
      Pages::App::Bookings::Repeat.new
    end

    def self.passengers
      Pages::App::Passengers::List.new
    end

    def self.new_passenger
      Pages::App::Passengers::New.new
    end

    def self.edit_passenger
      Pages::App::Passengers::Edit.new
    end

    def self.account_details
      Pages::App::Settings::AccountDetails::List.new
    end

    def self.edit_account_details
      Pages::App::Settings::AccountDetails::Edit.new
    end

    def self.bookings_report
      Pages::App::Reports::Bookings.new
    end

    def self.bookers
      Pages::App::Bookers::List.new
    end

    def self.new_booker
      Pages::App::Bookers::New.new
    end

    def self.edit_booker
      Pages::App::Bookers::Edit.new
    end

    def self.dashboard
      Pages::App::Dashboard.new
    end

    def self.office_locations
      Pages::App::Settings::OfficeLocations::List.new
    end

    def self.statistics
      Pages::App::Reports::Statistics.new
    end

    def self.procurement_statistics
      Pages::App::Reports::ProcurementStatistics.new
    end

    def self.billing
      Pages::App::Settings::Billing::List.new
    end

    def self.travel_policy
      Pages::App::Settings::TravelPolicy::List.new
    end

    def self.change_password
      Pages::App::Settings::ChangePassword::List.new
    end

    def self.reason_for_travel
      Pages::App::Settings::ReasonForTravel::List.new
    end

    def self.departments
      Pages::App::Settings::Departments::List.new
    end

    def self.user_roles
      Pages::App::Settings::UserRoles::List.new
    end

    def self.report_settings
      Pages::App::Settings::ReportSettings::List.new
    end
  end
end

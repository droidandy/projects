module Passengers
  class Export < Passengers::Index
    include ApplicationService::CsvExport
    include HomePrivacy::AddressHelpers

    CSV_HEADERS = {
      id: 'Id',
      full_name: 'Passenger name',
      phone_number: 'Phone number',
      other_number: 'Mobile number',
      email: 'Email',
      bookers: 'Bookers',
      department: 'Department',
      user_role: 'User role',
      work_role: 'Work role',
      home_address: 'Home address',
      work_address: 'Work address',
      active: 'Status',
      payroll: 'Payroll ID',
      cost_centre: 'Cost Centre',
      division: 'Division'
    }.freeze

    def execute!
      to_csv(passengers.map{ |b| passenger_item(b) })
    end

    private def passenger_item(passenger)
      {
        id: passenger.id,
        full_name: passenger.full_name,
        phone_number: passenger.phone,
        other_number: passenger.mobile,
        email: passenger.email,
        bookers: passenger.bookers.map(&:full_name).join(','),
        department: passenger.department&.name,
        user_role: passenger.role&.name,
        work_role: passenger.work_role&.name,
        home_address: safe_address_line(passenger.home_address),
        work_address: passenger.work_address&.line,
        active: passenger.active ? 'Active' : 'Inactive',
        payroll: passenger.payroll,
        cost_centre: passenger.cost_centre,
        division: passenger.division
      }
    end

    private def passengers
      @passengers ||= passengers_dataset
        .eager(:role, :bookers, :work_role, :department, :home_address, :work_address)
        .all
    end

    private def csv_headers
      CSV_HEADERS
    end
  end
end

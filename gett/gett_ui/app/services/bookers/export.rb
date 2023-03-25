module Bookers
  class Export < Bookers::Index
    include ApplicationService::CsvExport

    CSV_HEADERS = {
      id: 'Id',
      full_name: 'Booker name',
      phone_number: 'Phone number',
      other_number: 'Mobile number',
      email: 'Email',
      passengers: 'Passengers',
      department: 'Department',
      work_role: 'Work role',
      active: 'Status'
    }.freeze

    def execute!
      to_csv(bookers.map{ |b| booker_item(b) })
    end

    private def booker_item(booker)
      {
        id: booker.id,
        full_name: booker.full_name,
        phone_number: booker.phone,
        other_number: booker.mobile,
        email: booker.email,
        passengers: booker.passengers.map(&:full_name).join(','),
        department: booker.department&.name,
        work_role: booker.work_role&.name,
        active: booker.active ? 'Active' : 'Inactive'
      }
    end

    private def bookers
      @bookers ||= bookers_dataset
        .eager(:role, :passengers, :work_role, :department)
        .all
    end

    private def csv_headers
      CSV_HEADERS
    end
  end
end

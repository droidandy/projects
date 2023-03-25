module Admin::Vendors
  class Lookup < ApplicationService
    def execute!
      DB[:booking_indexes].distinct(:vendor_name).select_map(:vendor_name)
    end
  end
end

module DocumentDefinitions
  class Base
    def initialize(document)
      @document = document
    end

    def apply_metadata_changes!
      @document.update unique_id: unique_id, started_at: started_at
    end

    protected def update_expiry_time!(time: nil, date: nil)
      @document.update expires_at: (time || expiry_time(date))
    end

    protected def expiry_time(date = nil)
      Date.parse(date || @document.metadata['expiry_date']).end_of_day
    rescue TypeError, ArgumentError
      nil
    end

    protected def driver_attributes
      @driver_attributes ||= attributes(driver_fields)
    end

    protected def driver_fields
      {}
    end

    protected def vehicle_attributes
      @vehicle_attributes ||= attributes(vehicle_fields)
    end

    protected def vehicle_fields
      {}
    end

    protected def attributes(fields)
      fields.each_with_object({}) do |(model_attribute, meta_name), hash|
        hash[model_attribute] = @document.metadata[meta_name] unless @document.metadata[meta_name].nil?
      end
    end

    protected def started_at
      @document.metadata[started_at_field] if started_at_field
    end

    protected def started_at_field; end

    protected def unique_id
      @document.metadata[unique_id_field] if unique_id_field
    end

    protected def unique_id_field; end
  end
end

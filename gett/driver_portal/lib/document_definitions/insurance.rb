require 'document_definitions/base'

module DocumentDefinitions
  class Insurance < Base
    def apply_metadata_changes!
      ActiveRecord::Base.transaction do
        super
        update_expiry_time!(time: @document.metadata['expires_at'])
        @document.vehicle.update vehicle_attributes if vehicle_attributes
      end
    end

    private def vehicle_fields
      {
        plate_number: 'registration'
      }
    end
  end
end

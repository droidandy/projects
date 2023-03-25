require 'document_definitions/base'

module DocumentDefinitions
  class Phvl < Base
    def apply_metadata_changes!
      ActiveRecord::Base.transaction do
        super
        update_expiry_time!
        @document.vehicle.update vehicle_attributes if vehicle_attributes
      end
    end

    private def vehicle_fields
      {
        plate_number: 'registration'
      }
    end

    private def unique_id_field
      'phvl_number'
    end
  end
end

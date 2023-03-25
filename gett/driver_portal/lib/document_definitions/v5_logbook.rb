require 'document_definitions/base'

module DocumentDefinitions
  class V5Logbook < Base
    def apply_metadata_changes!
      ActiveRecord::Base.transaction do
        super
        @document.vehicle.update vehicle_attributes if vehicle_attributes
      end
    end

    private def vehicle_fields
      {
        plate_number: 'registration',
        color: 'color',
        model: 'model'
      }
    end
  end
end

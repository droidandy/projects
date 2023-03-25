require 'document_definitions/base'

module DocumentDefinitions
  class Phdl < Base
    def apply_metadata_changes!
      ActiveRecord::Base.transaction do
        super
        update_expiry_time!
        @document.user.update driver_attributes if driver_attributes
      end
    end

    private def driver_fields
      {
        license_number: 'license_number',
        postcode: 'postcode'
      }
    end

    private def unique_id_field
      'license_number'
    end
  end
end

require 'document_definitions/base'

module DocumentDefinitions
  class Mot < Base
    LIFETIME = 6.months

    def apply_metadata_changes!
      ActiveRecord::Base.transaction do
        super
        update_expiry_time!(date: (issue_date + LIFETIME).to_s) if issue_date
        @document.vehicle.update vehicle_attributes if vehicle_attributes
      end
    end

    private def issue_date
      @issue_date ||= date('issue_date')
    end

    private def date(field_name)
      Date.parse(@document.metadata[field_name])
    rescue TypeError
      nil
    end

    private def vehicle_fields
      {
        plate_number: 'registration',
        color: 'color',
        model: 'model'
      }
    end

    private def unique_id_field
      'issue_date'
    end
  end
end

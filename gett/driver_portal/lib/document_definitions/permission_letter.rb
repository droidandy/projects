require 'document_definitions/base'

module DocumentDefinitions
  class PermissionLetter < Base
    LIFETIME = 90.days

    def apply_metadata_changes!
      ActiveRecord::Base.transaction do
        super
        update_expiry_time!(date: expiry_date)
      end
    end

    private def expiry_date
      if @document.metadata['return_date_stated']
        @document.metadata['expiry_date']
      elsif sign_date
        (sign_date + LIFETIME).to_s
      end
    end

    private def sign_date
      @issue_date ||= date('sign_date')
    end

    private def date(field_name)
      Date.parse(@document.metadata[field_name])
    rescue TypeError
      nil
    end
  end
end

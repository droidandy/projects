require 'document_definitions/base'

module DocumentDefinitions
  class HireAgreement < Base
    LIFETIME = 28.days

    def apply_metadata_changes!
      ActiveRecord::Base.transaction do
        super
        update_expiry_time!(date: expiry_date)
      end
    end

    private def expiry_date
      @document.metadata['return_date_stated'] ? @document.metadata['expiry_date'] : LIFETIME.from_now.to_s
    end
  end
end

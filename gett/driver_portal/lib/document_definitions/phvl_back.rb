require 'document_definitions/base'

module DocumentDefinitions
  class PhvlBack < Base
    def apply_metadata_changes!
      ActiveRecord::Base.transaction do
        super
        update_expiry_time!
      end
    end
  end
end

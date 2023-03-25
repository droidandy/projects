require 'document_definitions/driver_schedule.rb'
require 'document_definitions/dvla.rb'
require 'document_definitions/hire_agreement.rb'
require 'document_definitions/insurance.rb'
require 'document_definitions/mot.rb'
require 'document_definitions/permission_letter.rb'
require 'document_definitions/phdl.rb'
require 'document_definitions/phvl.rb'
require 'document_definitions/v5_logbook.rb'
require 'document_definitions/vehicle_schedule.rb'
require 'document_definitions/phvl_back'

module Documents
  module Metadata
    class Save < ApplicationService
      attr_reader :updated_document

      schema do
        required(:document).filled
        required(:metadata).filled
        optional(:allow_blank).maybe(:bool?)
      end

      def execute!
        raise ActiveRecord::RecordNotFound unless document

        compose(
          Documents::Metadata::Validate.new(
            current_user,
            kind: document.kind,
            metadata: metadata,
            allow_blank: allow_blank
          ),
          :output,
          as: :parsed_metadata
        )
        return unless @parsed_metadata

        super do
          document.update(attributes)
          apply_metadata_changes!
        end
      end

      on_success { @updated_document = document }

      private def attributes
        {
          metadata: @parsed_metadata
        }
      end

      private def apply_metadata_changes!
        document.kind.definition_class ? kind_definition.apply_metadata_changes! : true
      end

      private def kind_definition
        @kind_definition ||= "DocumentDefinitions::#{document.kind.definition_class}".constantize.new(document)
      end
    end
  end
end

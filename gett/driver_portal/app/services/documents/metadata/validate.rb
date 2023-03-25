module Documents
  module Metadata
    class Validate < ApplicationService
      attr_reader :output

      schema do
        required(:kind).filled
        required(:metadata).filled
        optional(:allow_blank).maybe(:bool?)
      end

      def execute!
        if meta_check.success?
          @output = meta_check.output
          success!
        else
          fail!(errors: meta_check.errors)
        end
      end

      private def meta_check
        @meta_check ||= build_schema(kind.fields).call(metadata)
      end

      # pass fields as a param because of dry-validation strange predicate recognition
      private def build_schema(fields)
        local_allow_blank = allow_blank # the following block is executed in a different context
        Dry::Validation.Form do
          fields.map do |field|
            if field.mandatory && !local_allow_blank
              required(field.name.to_sym).filled("#{field.field_type == 'color' ? 'str' : field.field_type}?".to_sym)
            else
              optional(field.name.to_sym).maybe("#{field.field_type == 'color' ? 'str' : field.field_type}?".to_sym)
            end
          end
        end
      end
    end
  end
end

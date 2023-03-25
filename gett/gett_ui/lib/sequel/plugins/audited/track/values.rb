require_relative 'base'

module Track
  class Values < Base
    def save_changes
      return unless Sequel::Audited.enabled?

      columns = changed_columns_values(event)

      return if columns.blank?

      changes = audited_changes(columns)

      return unless changes.any?

      create_version(event, values: changes)
    end

    private def audited_changes(changes)
      columns = changes.keys

      model.audited_values.each_with_object({}) do |column_opts, res|
        complex_column = column_opts.is_a?(Hash)
        key = complex_column ? column_opts.keys.first : column_opts

        next unless key.in?(columns)

        res[key] =
          if complex_column
            customization = column_opts&.values&.first

            [
              changes[key][0]&.public_send(customization),
              changes[key][1]&.public_send(customization)
            ]
          else
            changes[key]
          end
      end
    end
  end
end

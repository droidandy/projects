module Options
  module Values
    private def add_audited_by_values(event)
      columns = columns_that_changed

      return unless columns.present?

      changed = { values: audited_values_changes(columns) }

      if changed[:values].any?
        create_version(event, changed)
      end
    end

    private def audited_values_changes(columns_changes)
      columns = columns_changes.keys
      model.audited_values.reduce({}) do |result, value|
        is_custom_value = value.is_a?(Hash)
        key = is_custom_value ? value.keys.first : value
        customization = value&.values&.first if is_custom_value

        if key.in?(columns)
          result[key] =
            if is_custom_value
              [columns_changes[key][0]&.public_send(customization),
               columns_changes[key][1]&.public_send(customization)]
            else
              columns_changes[key]
            end
        end
        result
      end
    end
  end
end

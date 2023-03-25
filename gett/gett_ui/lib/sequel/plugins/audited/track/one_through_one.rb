require_relative 'base'

module Track
  class OneThroughOne < Base
    # TODO: Add ability to get previous value
    def save_changes
      return unless Sequel::Audited.enabled?

      model.audited_one_through_one.each do |obj|
        association_name = obj.keys.first
        opts = obj[association_name]

        next unless only_match?(opts[:only])

        changes =
          case event
          when Sequel::Audited::CREATE
            [nil, object[opts[:target_key]]]
          when Sequel::Audited::DESTROY
            [object[opts[:target_key]], nil]
          else
            changed_columns_values[opts[:target_key]] if changed_columns_values.present?
          end

        next unless changes

        observed_id = object[opts[:observed_key]]
        observed_model = opts[:observed_model]
        observed_object = observed_model[observed_id]

        old_target_object = opts[:target_model][changes.first]
        new_target_object = opts[:target_model][changes.last]

        name_field = opts[:name] || 'name'

        changed_result = {
          association_name => [
            {
              key: old_target_object&.id,
              name: old_target_object&.public_send(name_field)
            },
            {
              key: new_target_object&.id,
              name: new_target_object&.public_send(name_field)
            }
          ]
        }

        create_version(event, { associations: changed_result }, observed_object)
      end
    end

    private def only_match?(lamb)
      return true if lamb.nil?

      lamb.call(object)
    end
  end
end

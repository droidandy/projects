require_relative 'base'

module Track
  class OneToMany < Base
    def save_changes
      return unless Sequel::Audited.enabled?

      id = object.values[:id]
      observed_obj = nil

      changes =
        model.audited_one_to_many.each_with_object({}) do |audited_assoc, res|
          association_name = audited_assoc.keys.first
          opts = audited_assoc[association_name]

          key_name = opts[:key] || "#{association_name}_id"
          key = object.values[key_name]

          observed_model = opts[:model] || association_name
          observed_obj ||= observed_model[key]
          observed_assoc = opts[:observed_association] || object.class.to_s.underscore.pluralize

          name_field = opts[:name] || 'name'

          audited_objects =
            observed_obj.public_send(observed_assoc).each_with_object({}) do |audited_obj, result|
              result[audited_obj.id] = {
                key: audited_obj.id,
                name: audited_obj.public_send(name_field)
              }
            end

          if event == Sequel::Audited::CREATE
            old_audited_objects = audited_objects.without(id)
            new_audited_objects = audited_objects
          end

          res[observed_assoc] = [
            old_audited_objects.values,
            new_audited_objects.values
          ]
        end

      create_version(Sequel::Audited::CHANGE_MANY, changes, observed_obj) if changes.any?
    end
  end
end

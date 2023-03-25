module Options
  module OneToMany
    private def add_audited_by_one_to_many(event)
      id = self.values[:id]
      observed_obj = nil

      changes = model.audited_one_to_many.each_with_object({}) do |audited_assoc, result|
        assoc = audited_assoc.keys.first
        opts = audited_assoc[assoc]

        key_name = opts[:key] || "#{assoc}_id"
        key = self.values[key_name]
        observed_model = opts[:model] || assoc
        observed_obj ||= observed_model[key]
        observed_assoc = opts[:observed_association] || self.class.to_s.underscore.pluralize

        audited_objects = observed_obj.public_send(observed_assoc).each_with_object({}) do |audited_obj, res|
          res[audited_obj.id] = { key: audited_obj.id, name: audited_obj.public_send(opts[:name]) }
        end

        if event == Sequel::Audited::CREATE #TODO add tracking on deleting
          old_audited_objects = audited_objects.without(id)
          new_audited_objects = audited_objects
        end

        result[observed_assoc] = [old_audited_objects.values, new_audited_objects.values]
      end

      create_version(Sequel::Audited::CHANGE_MANY, changes, observed_obj) if changes.any?
    end
  end
end

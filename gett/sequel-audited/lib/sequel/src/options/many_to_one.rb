module Options
  module ManyToOne
    private def add_audited_by_many_to_one(event)
      columns = columns_that_changed

      return unless columns.present?

      changed = { associations: audited_many_to_one_changes(columns) }

      if changed[:associations].any?
        create_version(event, changed)
      end
    end

    private def audited_many_to_one_changes(vals)
      vals.each_with_object({}) do |(key, changed), result|
        association = model.audited_many_to_one.find do |a|
          a.values.first[:key].to_sym == key
        end

        if association
          assoc = association.keys.first
          opts = association.values.first

          a_name = opts[:relation] || assoc
          a_class_name = opts[:class] || a_name.to_s.camelize.constantize
          a_name_field = opts[:name] || 'name'

          a_pk_old = changed.first
          a_pk_new = changed.last

          result[a_name] = [
            { key: a_pk_old,
              name: a_class_name[a_pk_old]&.public_send(a_name_field) },
            { key: a_pk_new,
              name: a_class_name[a_pk_new]&.public_send(a_name_field) }
          ]
        end
      end
    end
  end
end

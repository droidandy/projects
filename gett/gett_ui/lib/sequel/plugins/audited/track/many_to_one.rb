require_relative 'base'

module Track
  class ManyToOne < Base
    def save_changes
      return unless Sequel::Audited.enabled?

      audited_changes = audited_changes(event)
      audited_changes.present? && create_version(event,
        associations: audited_changes
      )
    end

    private def audited_changes(event)
      changes = changed_columns_values(event) || {}
      changes.each_with_object({}) do |(column, change), res|
        association =
          model.audited_many_to_one.find do |a|
            a.values.first[:key].to_sym == column
          end

        next unless association

        assoc = association.keys.first
        opts = association.values.first

        a_name = opts[:relation] || assoc
        a_class_name = opts[:class] || a_name.to_s.camelize.constantize
        a_name_field = opts[:name] || :name

        a_pk_old = change.first
        a_pk_new = change.last

        res[a_name] = [
          {
            key: a_pk_old,
            name: a_class_name[a_pk_old]&.public_send(a_name_field)
          },
          {
            key: a_pk_new,
            name: a_class_name[a_pk_new]&.public_send(a_name_field)
          }
        ]
      end
    end
  end
end

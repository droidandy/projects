module Track
  class ManyToMany < Base
    attr_reader :association_pks

    def initialize(object, event)
      super
      @association_pks = object.instance_variable_get(:@_association_pks)
    end

    def get_changes # rubocop:disable Naming/AccessorMethodName
      return unless Sequel::Audited.enabled?
      return if association_pks.blank?

      audited_changed_associations =
        model.audited_many_to_many.select do |opt|
          opt.keys.first.in?(association_pks.keys)
        end

      changes = audited_changes(audited_changed_associations)

      # cache changes and create version after save
      return changes if object.new?

      create_version(Sequel::Audited::CHANGE_MANY, changes) if changes.present?
    end

    def save_changes(changes)
      return unless Sequel::Audited.enabled?

      # Audited by many_to_many tracks from before_save callback
      # So we need to save it to the object after create
      create_version(Sequel::Audited::CREATE, changes) if changes.present?
    end

    private def audited_changes(audited_changed_associations)
      audited_changed_associations.each_with_object({}) do |changed_assoc, res|
        association_key = changed_assoc.keys.first
        opts = changed_assoc[association_key]

        new_pks = association_pks[association_key]
        old_pks = object.public_send(association_key).pluck(:id)

        next if new_pks.sort == old_pks.sort

        association_class = opts[:class] || association_key.to_s.singularize.camelize.constantize
        association_name_field = opts[:name] || 'name'

        preloaded_objects =
          association_class.where(id: (new_pks | old_pks)).each_with_object({}) do |ac, obj|
            obj[ac.id] = {
              key: ac.id,
              name: ac.public_send(association_name_field)
            }
          end

        res[association_key] = [
          old_pks.map { |pk| preloaded_objects[pk] },
          new_pks.map { |pk| preloaded_objects[pk] }
        ]
      end
    end
  end
end

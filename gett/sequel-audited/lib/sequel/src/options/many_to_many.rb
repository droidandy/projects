module Options
  module ManyToMany
    private def add_audited_by_many_to_many
      assoc_changed = @_association_pks&.keys

      if assoc_changed&.any?
        audited_assoc_changed = model.audited_many_to_many.select{ |opt| opt.keys.first.in? assoc_changed }
        changes = audited_many_to_many_changes(audited_assoc_changed)

        if changes.any?
          if id.present?
            create_version(Sequel::Audited::CHANGE_MANY, changes)
          else
            @changes = changes
          end
        end
      end
    end

    private def save_audited_by_many_to_many
      # Audited by many_to_many tracks from before_save callback
      # So we need to save it to the object after create
      if @changes && @changes.any?
        create_version(Sequel::Audited::CREATE, @changes)
      end
    end

    private def audited_many_to_many_changes(audited_assoc_changed)
      audited_assoc_changed.each_with_object({}) do |changed_assoc, res|
        assoc = changed_assoc.keys.first
        opts = changed_assoc[assoc]

        new_pks = @_association_pks[assoc]
        old_pks = self.public_send(assoc).pluck(:id)

        next if  new_pks - old_pks == old_pks - new_pks

        assoc_class = opts[:class] || assoc.to_s.singularize.camelize.constantize
        assoc_name_field = opts[:name] || 'name'

        preloaded_objects = assoc_class.where(id: (new_pks + old_pks)).each_with_object({}) do |ac, obj|
          obj[ac.id] = { key: ac.id, name: ac.public_send(assoc_name_field) }
        end

        res[assoc] = [
          old_pks.map { |pk| preloaded_objects[pk] },
          new_pks.map { |pk| preloaded_objects[pk] }
        ]
      end
    end
  end
end

module ApplicationService::ChangesFetcher
  def changes(versions)
    (versions.presence || []).flat_map do |version|
      case version[:event]
      when 'change_many'
        processed_change_many(version)
      when 'update'
        processed_values(version).to_a + processed_associations(version).to_a
      when 'created_manually'
        processed_manual_event(version)
      else
        processed_associations(version).to_a
      end
    end
  end

  private def changes_from(*versions)
    sort_changes(versions.flat_map{ |v| changes(v) })
  end

  private def sort_changes(changes)
    changes.sort_by{ |c| [c[:datetime], c[:field]] }.reverse
  end

  private def processed_change_many(version)
    version.changed.keys.map do |key|
      old, new = version.changed[key]

      create_result(version, key, value_of_many(old), value_of_many(new))
    end
  end

  private def processed_values(version)
    version.changed['values']&.keys&.map do |key|
      old, new = version.changed['values'][key]

      if old.is_a?(Array) # If column type is PgArray
        old = old.join(', ')
        new = new.join(', ')
      end

      create_result(version, key, old, new)
    end
  end

  private def processed_associations(version)
    version.changed['associations']&.keys&.map do |key|
      old, new = version.changed['associations'][key]

      create_result(version, key, old['name'], new['name'])
    end
  end

  private def processed_manual_event(version)
    key, message = version.changed.first

    create_result(version, key, nil, message)
  end

  private def value_of_many(arry)
    arry.map{ |c| c['name'] }.uniq.join(', ')
  end

  private def create_result(version, key, from, to)
    from, to = transform_values(key, from, to)

    {
      id: "#{version.id}.#{key}",
      field: key.split('_').map(&:capitalize).join(' '),
      author: version_author(version),
      datetime: version.created_at.strftime("%F %T"),
      from: from,
      to: to
    }
  end

  private def version_author(version)
    user = (version.username.blank? || version.username == 'system') ? 'System' : version.username

    original_user = version.original_user_id ? " (#{version.original_username})" : ''
    user + original_user
  end

  private def transform_values(key, from, to)
    [from, to].map{ |value| transform_value(key, value) }
  end

  private def transform_value(_key, value)
    return value.to_s.titleize if [true, false].include?(value)

    value
  end
end

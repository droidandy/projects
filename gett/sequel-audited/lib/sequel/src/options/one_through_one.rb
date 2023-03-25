module Options
  module OneThroughOne
    # TODO Add ability to get previous value
    private def add_audited_by_one_through_one(event)
      model.audited_one_through_one.each do |obj|
        assoc = obj.keys.first
        opts  = obj[assoc]

        next if guard_audited_by_one_through_one?(opts[:guard])

        changed_value =
          if event == Sequel::Audited::DESTROY
            [nil, nil]
          else
            columns_that_changed[opts[:target_key]] if columns_that_changed.present?
          end

        next unless changed_value

        if changed_value.present?
          observed_id = self[opts[:observed_key]]
          observed_object = opts[:observed_model][observed_id]

          old_target_object = opts[:target_model][changed_value.is_a?(Array) ? changed_value[0] : nil]
          new_target_object = opts[:target_model][changed_value.is_a?(Array) ? changed_value[1] : changed_value]

          changed_result = {}.tap do |res|
            res[assoc] = [{ key: old_target_object&.id, name: old_target_object&.public_send(opts[:name]) },
                          { key: new_target_object&.id, name: new_target_object&.public_send(opts[:name]) }]
          end

          create_version(event, { associations: changed_result }, observed_object)
        end
      end
    end

    private def guard_audited_by_one_through_one?(guard)
      # TODO make possible to cutomize guard option
      guard && self[guard.keys.first] != guard.values.first
    end
  end
end

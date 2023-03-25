module Track
  class Base
    attr_reader :event, :object, :model

    delegate :create_version, to: :object

    def initialize(object, event)
      @object = object
      @model = object.model
      @event = event
    end

    private def changed_columns_values(event = nil)
      if event.in?([Sequel::Audited::CREATE, Sequel::Audited::DESTROY])
        object.values.each_with_object({}) do |(key, val), res|
          next if val.nil?

          val = object.column_changes[key].present? ? object.column_changes[key][1] : val

          res[key] = (event == Sequel::Audited::CREATE) ? [nil, val] : [val, nil]
        end
      else
        object.column_changes.empty? ? object.previous_changes : object.column_changes
      end
    end
  end
end

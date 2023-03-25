class ActiveOrderSerializer < ActiveModel::Serializer
  def attributes(*args)
    object.attributes.symbolize_keys.merge(events)
  end

  def events
    { events: Order::TimeLineEvents.new(object).execute! }
  end
end

class CompletedOrderSerializer < ActiveModel::Serializer

  # path_poins cutted for performance reason
  def attributes(*args)
    object.attributes.symbolize_keys.except(:path_points).merge(events)
  end

  def events
    { events: Order::TimeLineEvents.new(object).execute! }
  end
end

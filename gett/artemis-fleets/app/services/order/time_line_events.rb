class Order
  class TimeLineEvents
    def initialize(order)
      @order = order
    end

    attr_reader :order

    TIMESTAMP_MAPPING = {
      order_received: :order_received,
      arrived:        :arrived_at,
      in_progress:    :passanger_on_board,
      completed:      :order_ended_at,
      cancelled:      :order_cancelled_at,
      rejected:       :order_rejected_at
    }.freeze

    private_constant :TIMESTAMP_MAPPING

    def execute!
      events = []

      TIMESTAMP_MAPPING.keys.each do |status|
        time = event_time(status) || next

        events << {
          status: status,
          time: time,
          interval: events.empty? ? 0 : (time - events.last[:time]).round,
          distance: event_distance(status)
        }
      end

      events.map{ |e| [e[:status], e.except(:status)] }.to_h
    end

    private def event_time(status)
      time_attr = TIMESTAMP_MAPPING.fetch(status)
      order.public_send(time_attr)
    end

    private def event_distance(status)
      case status
      when :arrived then order.waiting_time_minutes&.round(3)
      end
    end
  end
end

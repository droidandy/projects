module Bookings
  class Events < ApplicationService
    include ActionView::Helpers::DateHelper

    attributes :booking

    EVENTS = [
      {status: 'creating',       timestamp: :created_at},
      {status: 'order_received', timestamp: :booked_at},
      {status: 'locating',       timestamp: :started_locating_at, except: ->(b) { b.ot? || b.get_e? }},
      {status: 'on_the_way',     timestamp: :allocated_at,        except: proc(&:get_e?)},
      {status: 'arrived',        timestamp: :arrived_at,          except: proc(&:get_e?), is_animated: true},
      {status: 'in_progress',    timestamp: :started_at},
      {status: 'completed',      timestamp: :ended_at,         final: true, is_animated: true},
      {status: 'cancelled',      timestamp: :cancelled_at,     final: true, is_interrupted: true},
      {status: 'rejected',       timestamp: :rejected_at,      final: true, is_interrupted: true},
      {status: 'customer_care',  timestamp: :customer_care_at, final: true}
    ].freeze

    def execute!
      available_events.map.with_index do |event, i|
        distance = event_distance(event)
        interval = event_interval(event, prev_time: available_events[i - 1][:occured_at]) if i > 0

        {
          status: event[:status],
          is_first: i == 0,
          is_edge: i == 0 || i == available_events.length - 1,
          is_active: !event[:final] && event[:status] == booking.status,
          is_previous_active: i > 0 && available_events[i - 1][:status] == booking.status,
          is_animated: !!event[:is_animated],
          is_interrupted: !!event[:is_interrupted],
          interval_and_distance: [interval, distance].compact.join(', '),
          timestamp: event[:occured_at],
          # TODO: check where and how `time` is used and if we need such format
          time: event[:occured_at]&.in_time_zone(booking.timezone)&.strftime('%d/%m/%Y %H:%M'),
          cancelled_by: (event[:status] == 'cancelled').presence && cancelled_by_name
        }
      end
    end

    private def available_events
      return @available_events if defined?(@available_events)

      # take all events applicable for current booking based on it's service type, then
      # remove all "unhappened" events between first and last "happened" events, and
      # then add next "unhappened" event in the list, unless last "happened" event is final
      events =
        EVENTS
          .select{ |e| !e.key?(:except) || !e[:except].call(booking) }
          .map{ |event| event.merge(occured_at: booking.public_send(event[:timestamp])) }

      last_occured_at_index = events.rindex{ |e| e[:occured_at].present? }

      @available_events =
        events.select.with_index do |e, i|
          e[:occured_at].present? ||
            (!events[last_occured_at_index][:final] && i == last_occured_at_index + 1)
        end
    end

    private def cancelled_by_name
      return if booking.cancelled_by_id.blank?

      booking.cancelled_through_back_office? ? 'Customer Care' : booking.cancelled_by.full_name
    end

    private def event_distance(event)
      distance =
        case event[:status]
        when 'arrived' then booking.driver&.pickup_distance_mi&.round(3)
        when 'completed' then booking.travel_distance&.round(3)
        end

      "#{distance} mi" if distance.present?
    end

    private def event_interval(event, prev_time:)
      return if event[:occured_at].blank?

      seconds = ((event[:occured_at] - prev_time) * 1.day).round

      # intra-minute precision without extra craft
      distance_string = distance_of_time_in_words(seconds, 0, include_seconds: true)
      distance_string.gsub(/(less than|about|over)/, '').strip
    end
  end
end

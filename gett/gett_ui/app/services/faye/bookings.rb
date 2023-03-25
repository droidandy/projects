module Faye
  # Small helper class for a syntatic sugar of a kind `Faye.bookings.notify_update(booking)`
  class Bookings
    def notify_create(booking)
      notify(booking, action: 'created')
    end

    def notify_update(booking, opts = {})
      notify(booking, opts.merge(action: 'updated'))
    end

    private def notify(booking, opts = {})
      company_id = booking.company.id

      Faye.notify("bookings", opts.merge(booking_id: booking.id))
      Faye.notify("bookings-#{company_id}", opts.merge(booking_id: booking.id))
      Faye.notify(booking, opts.merge(booking_opts(booking)))
    end

    private def booking_opts(booking)
      {
        status: booking.status,
        service_id: booking.service_id,
        order_id: booking.order_id
      }.tap do |opts|
        if booking.driver.present?
          opts[:driver] = { lat: booking.driver.lat, lng: booking.driver.lng, bearing: booking.driver.bearing }
          opts[:driver_path] = driver_path(booking)
        end
      end
    end

    private def driver_path(booking)
      points = booking.driver.path_points || []

      if booking.on_the_way?
        points.select!(&:on_the_way?)
      else
        points.select!(&:in_progress?)
      end

      points.map do |point|
        {
          lat: point.lat,
          lng: point.lng,
          bearing: point.bearing
        }
      end
    end
  end
end

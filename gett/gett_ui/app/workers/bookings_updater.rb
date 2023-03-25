class BookingsUpdater < ApplicationWorker
  sidekiq_options queue: :default, retry: false

  # determines offset from scheduled_at, starting from which bookings will
  # be periodically updated
  UPDATE_TIME_OFFSET = 5.hours

  # service types, which orders are updated by periodically sending requests
  # to collect possible updates.
  SCHEDULED_SERVICE_TYPES = %w'ot gett splyt'.freeze

  def self.updater_for(booking)
    case booking.service_type
    when 'ot' then BookingUpdaters::OT
    when 'gett' then BookingUpdaters::Gett
    when 'splyt' then BookingUpdaters::Splyt
    end
  end

  def perform
    bookings = Booking.fully_created.not_final
      .provided_by(SCHEDULED_SERVICE_TYPES)
      .where{ scheduled_at < Time.current + UPDATE_TIME_OFFSET }
      .eager(:vehicle)
      .all
    scheduled_ids = in_queue_or_scheduled_booking_ids_map

    bookings.each do |b|
      # issue updating mechanism unless update is already scheduled, or booking
      # cannot be updated due to updater restrictions
      unless scheduled_ids[b.id] || Bookings.updater_for(b).nil?
        self.class.updater_for(b).perform_async(b.id)
      end
    end
  end

  private def in_queue_or_scheduled_booking_ids_map
    prefix      = (Rails.env.development? || Rails.env.test?) ? '' : 'gett_'
    gett_queue  = Sidekiq::Queue.new("#{prefix}gett")
    ot_queue    = Sidekiq::Queue.new("#{prefix}ot")
    splyt_queue = Sidekiq::Queue.new("#{prefix}splyt")
    scheduled   = Sidekiq::ScheduledSet.new

    [gett_queue, ot_queue, splyt_queue, scheduled].each_with_object({}) do |queue, map|
      queue.each do |job|
        map[job.args[0]] = true if job.klass =~ /BookingUpdaters::(?:OT|Gett|Splyt)/
      end
    end
  end
end

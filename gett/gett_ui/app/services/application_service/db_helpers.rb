using Sequel::CoreRefinements
using HomePrivacy::SequelRefinements

module ApplicationService::DbHelpers
  def booking_references_dataset
    DB[:booker_references]
      .select(
        :booking_id,
        :booking_reference_name.as(:name),
        :value,
        Sequel.join([:booker_references[:booking_reference_name], ': ', :booker_references[:value]]).as(:name_value)
      )
      .from_self
      .select do
        [
          booking_id,
          array_agg(name_value).as(:name_values),
          hstore(array_agg(name), array_agg(value)).as(:refs_hstore)
        ]
      end
      .group(:booking_id)
  end

  def booking_stop_points_dataset
    DB[:booking_addresses].where(address_type: 'stop')
      .join(:addresses, id: :booking_addresses[:address_id])
      .select(
        :booking_id,
        :addresses[:line].sanitize_using(:booking_addresses[:passenger_address_type]).as(:address)
      )
      .from_self
      .select{ [booking_id, array_agg(address).as(:addresses)] }
      .group(:booking_id)
  end

  private def booking_order_id
    Sequel.case(
      {{:vehicles[:service_type] => Bookings::Providers::SPLYT.to_s} => :concat.sql_function('SP', :bookings[:id])},
      :bookings[:service_id]
    )
  end

  private def format_time(value, timezone: Settings.time_zone)
    Sequel.function(:to_char,
      Sequel.function(:timezone,
        # if `timezone` is a Sequel's column identifier, in DB it may potentially have a
        # value of NULL. that's why `COALESCE` is used, even considering that `timezone`
        # key argument has a default value.
        Sequel.function(:coalesce, timezone, Settings.time_zone),
        Sequel.function(:timezone, 'UTC', value)
      ),
      'DD/MM/YYYY HH24:MI'
    )
  end

  private def format_cents(value)
    Sequel.function(:to_char, value.cast(:float) / 100, 'FM99990.00')
  end

  private def seconds_to_time_text(seconds)
    Sequel.join([hours_text(seconds), ':', minutes_text(seconds), ':', seconds_text(seconds)])
  end

  private def padded_value(value)
    Sequel.function(:lpad, value.cast(:text), 2, '0')
  end

  private def hours_text(seconds)
    padded_value(seconds.cast(:integer) / 3600)
  end

  private def minutes_text(seconds)
    padded_value(Sequel.function(:mod, seconds.cast(:integer), 3600) / 60)
  end

  private def seconds_text(seconds)
    padded_value(Sequel.function(:mod, seconds.cast(:integer), 60))
  end

  private def seconds_to_minutes(seconds)
    seconds.cast(:integer) / 60
  end
end

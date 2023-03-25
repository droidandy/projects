module Splyt
  class Estimate < Base
    http_method :get

    attributes :provider_id, :region_id, :car_type, :booking_type, :pickup_address, :dropoff_address, :departure_date

    normalize_response do
      map from('/estimated/pickup_eta'),        to('eta')
      map from('/estimated/price_range/lower'), to('lower_price')
      map from('/estimate_id'),                 to('estimate_id')
    end

    private def url
      super("/v2/providers/#{provider_id}/regions/#{region_id}/estimate")
    end

    private def params
      {
        car_type:          car_type,
        booking_type:      booking_type,
        currency_code:     Bookings::DEFAULT_CURRENCY,
        pickup_latitude:   pickup_address[:lat].to_f.round(7),
        pickup_longitude:  pickup_address[:lng].to_f.round(7),
        dropoff_latitude:  dropoff_address[:lat].to_f.round(7),
        dropoff_longitude: dropoff_address[:lng].to_f.round(7)
      }.tap do |params|
        params[:departure_date] = departure_date if departure_date.present?
      end
    end
  end
end

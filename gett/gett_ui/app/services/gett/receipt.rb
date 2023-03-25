module Gett
  class Receipt < Base
    include ApplicationService::NormalizedResponse
    include ApplicationService::CurrencyHelpers

    http_method :get
    attributes :booking

    def normalized_response
      return if response.blank?

      result = {
        duration: response.data['duration'],
        distance: response.data['distance'],
        distance_label: response.data['distance_label'],
        charges: {}
      }

      response.data['charges']&.each_with_object({}) do |charge|
        amount = (convert_currency(amount: charge['amount'], from: currency) * 100).to_i
        case charge['type']
        when 'base_fare'
          result[:charges][:fare_cost] = amount
        when 'commission', 'additional_fee', 'tax', 'extra'
          result[:charges][charge['name'].parameterize.underscore.to_sym] = amount
        when 'free_waiting_time'
          result[:charges][:free_waiting_time] = time_text_to_seconds(charge['description'])
        when 'paid_waiting_time'
          result[:charges][:paid_waiting_time] = time_text_to_seconds(charge['description'])
          result[:charges][:paid_waiting_time_fee] = amount
        when 'stops'
          result[:charges][:stops_text] = charge['description']
          result[:charges][:stops_fee] = amount
        when 'tip'
          result[:charges][:tips] = amount
        end
      end
      result
    end

    private def currency
      response.data['currency_code']
    end

    private def time_text_to_seconds(time_text)
      waiting_time_arr = time_text.split(':').map(&:to_i)
      waiting_time_arr[0] * 3600 + waiting_time_arr[1] * 60 + waiting_time_arr[2]
    end

    private def url
      super("/business/rides/#{booking.service_id}/receipt?business_id=#{business_id}")
    end
  end
end

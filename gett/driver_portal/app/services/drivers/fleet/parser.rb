module Drivers
  module Fleet
    class Parser
      attr_reader :data

      def initialize(data)
        @data = data
      end

      def parse
        {
          account_number:    data['account_number'],
          address:           data['postal_address'],
          badge_number:      data['driver_license_id'],
          city:              data['city'],
          email:             data['email'],
          gett_id:           data['id'],
          is_frozen:         data['is_frozen'],
          month_acceptance:  acceptance('this_month'),
          name:              data['name'],
          phone:             data['phone'].to_s,
          postcode:          data['zip'],
          rating:            data['computed_rating'],
          remote_avatar_url: data['picture_url'],
          sort_code:         data['sort_code'],
          vehicle_colour:    data['color'] || data['color_en'],
          today_acceptance:  acceptance('today'),
          total_acceptance:  acceptance('all_time'),
          week_acceptance:   acceptance('this_week')
        }
      end

      private def acceptance(type)
        accepted = data.dig('statistics', 'acceptance_rate', type, 'accepted').to_i
        total = data.dig('statistics', 'acceptance_rate', type, 'total').to_i
        if total.zero?
          nil
        elsif accepted.zero?
          0
        else
          (accepted.to_f / total.to_f * 100).to_i
        end
      end
    end
  end
end

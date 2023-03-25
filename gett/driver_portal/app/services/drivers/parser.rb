module Drivers
  class Parser
    attr_reader :data

    def initialize(data)
      @data = data
    end

    def parse
      {
        account_number:    data['account_number'],
        address:           data['address'],
        badge_number:      data.dig('badge', 'number'),
        badge_type:        data.dig('badge', 'type'),
        city:              data['city'],
        email:             data['email'],
        gett_id:           data['id'],
        is_frozen:         data['is_frozen'] || false,
        name:              data['name'],
        phone:             data['phone'],
        postcode:          data['postcode'],
        remote_avatar_url: data['photo_url'],
        sort_code:         data['sort_code']
      }
    end
  end
end

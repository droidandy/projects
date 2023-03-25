module OneTransport
  class ProfileLookup < Base
    attributes :ot_username, :ot_client_number

    normalize_response do
      map from('/profile/general/person_id'), to('/person_ID')
      map from('/profile/general/username'), to('/username')
      map from('/profile/general/passenger_type/name'), to('/passenger_type/name'), default: ''
      map from('/profile/general/passenger_type/type'), to('/passenger_type/type'), default: 'None'
      map from('/profile/general/title'), to('/title'), default: ''
      map from('/profile/general/first_name'), to('/first_name')
      map from('/profile/general/last_name'), to('/last_name')
      map from('/profile/general/mobile_phone'), to('/mobile_phone'), default: ''
      map from('/profile/general/work_phone'), to('/work_phone'), default: ''
      map from('/profile/general/email'), to('/email'), default: ''
      map from('/profile/general/client_number'), to('/client_number')
      map from('/profile/general/stuff_number'), to('/stuff_number'), default: ''
      map from('/profile/general/role'), to('/role'), default: ''
    end

    def options
      {
        username: ot_username || company.ot_username,
        client_number: ot_client_number || company.ot_client_number
      }
    end
  end
end

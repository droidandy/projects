FactoryGirl.define do
  factory :address do
    line { Faker::Address.street_address }
    lat { Faker::Address.latitude.to_f.round(7) }
    lng { Faker::Address.longitude.to_f.round(7) }
    country_code { Faker::Address.country_code }
    city { Faker::Address.city }
    street_name { Faker::Address.street_name }

    trait :new_york do
      line '817 5th Ave, New York, NY 10065'
      lat 40.7665657
      lng -73.973213
      postal_code '10065'
      country_code 'US'
      city 'New York City'
      region 'New York'
      timezone 'EST'
      street_number '817'
      street_name '5th Ave'
    end

    trait :new_york_1 do
      line '834 5th Ave, New York, NY 10065'
      lat 40.7676656
      lng -73.9724121
      postal_code '10065'
      country_code 'US'
      city 'New York City'
      region 'New York'
      timezone 'New York'
      street_number '834'
      street_name '5th Ave'
    end

    trait :baker_street do
      line '221B Baker St, Marylebone, London NW1 6XE, UK'
      lat 51.5237102
      lng -0.1584593
      postal_code 'NW1 6XE'
      country_code 'GB'
      city 'London'
      region 'England'
      timezone 'Europe/London'
      street_number '221B'
      street_name 'Baker St'
    end

    trait :mercedes_glasgow do
      line 'Mercedes-Benz of Glasgow, 135 Milton St, Glasgow G4 0DH, UK'
      lat 55.8688471
      lng -4.251075999999999
      postal_code 'G4 0DH'
      country_code 'GB'
      city 'Glasgow'
      region 'Scotland'
      street_number '135'
      street_name 'Milton St'
      point_of_interest 'Mercedes-Benz of Glasgow'
    end

    trait :red_square do
      line 'Red Square, Krasnaya ploshad, Moskva, Russia, 109012'
      lat 55.7526443
      lng 37.62370930000001
      postal_code '109012'
      country_code 'RU'
      city 'Moskva'
      region nil
      street_number nil
      street_name 'Krasnaya ploshad'
      point_of_interest 'Tsentralnyy administrativnyy okrug'
    end

    trait :mgu do
      line 'Voznesenskiy Pereulok, 22, Moskva, Russia, 125009'
      lat 55.760605
      lng 37.607673
      postal_code '125009'
      country_code 'RU'
      city 'Moskva'
      region nil
      street_number '22'
      street_name 'Voznesenskiy Pereulok'
      point_of_interest 'Tsentralnyy administrativnyy okrug'
    end

    trait :shalom_hotel do
      line 'HaYarkon St 216, Tel Aviv-Yafo, Israel'
      lat 32.08929390000001
      lng 34.77237300000001
      postal_code nil
      country_code 'IL'
      city 'Tel Aviv-Yafo'
      region 'Tel Aviv District'
      street_number '216'
      street_name 'HaYarkon Street'
      point_of_interest 'Tel Aviv-Yafo'
    end

    trait :haifa_airport do
      line 'Haifa, Israel'
      lat 32.811675
      lng 35.039119
      postal_code nil
      country_code 'IL'
      city 'Haifa'
      region 'Haifa District'
      street_number nil
      street_name nil
      point_of_interest 'Israel'
    end
  end
end

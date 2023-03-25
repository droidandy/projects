Seeds.seed_once(Role, :name, Role::ROLES){ |name| { name: name } }

# Gett and OneTransport Vehicles
Seeds.seed_once(Vehicle, :value, [
  # Enterprise vehicles in London
  { name: 'Courier',       value: 'cfd8290c-d267-4bfb-8961-ea7ae39cf5a9', service_type: 'gett', earliest_available_in: 30, active: false },
  { name: 'BlackTaxiXL',   value: '00407fdc-4385-4a22-9035-9d2d3e0a031a', service_type: 'gett', earliest_available_in: 30 },
  { name: 'BlackTaxi',     value: '5178cd83-20bf-4991-b559-c1128dfae662', service_type: 'gett', earliest_available_in: 30 },
  # VIA provider
  { name: 'Standard',      value: 'f4e9b813-0a2a-491d-b15a-590a5e7432ed', service_type: 'gett', earliest_available_in: 30 },
  # Gett stub for VIA provider with manual status changing
  { name: 'Standard',      value: 'ee5fd157-c16d-4fe8-838a-a6ca6fa08956', service_type: 'gett', earliest_available_in: 30 },
  { name: 'Standard',      value: 'Saloon_Standard',                      service_type: 'ot',   earliest_available_in: 60, pre_eta: 30 },
  { name: 'MPV',           value: 'MPV_Standard',                         service_type: 'ot',   earliest_available_in: 60, pre_eta: 30 },
  { name: 'Exec',          value: 'Saloon_Corporate',                     service_type: 'ot',   earliest_available_in: 60, pre_eta: 30 },
  { name: 'OTBlackTaxi',   value: 'Taxi_Standard',                        service_type: 'ot',   earliest_available_in: 15, pre_eta: 15 },
  { name: 'OTBlackTaxiXL', value: 'MPV_Standard_Black',                   service_type: 'ot',   earliest_available_in: 15, pre_eta: 15 },
  { name: 'Special',       value: 'Special',                              service_type: 'manual',earliest_available_in: 30, pre_eta: 25 },
  { name: 'Porsche',       value: '36510f6d-7f91-460b-ad6f-fa8dfe60dd92', service_type: 'gett', earliest_available_in: 15,  pre_eta: 15, active: false },
  # Enterprise vehicles outside of London
  { name: 'BlackTaxiXL',   value: 'abb0f1c1-1a54-423f-9921-4e3507cc0ff6', service_type: 'gett', earliest_available_in: 30 },
  { name: 'BlackTaxi',     value: 'e54d4f68-9a13-487f-b036-741e526d9165', service_type: 'gett', earliest_available_in: 30 },
  # Gett vehicles in Israel
  { name: 'GettXL',        value: '7e66944e-e68a-466f-aa99-5cfec1c8229a', service_type: 'gett', earliest_available_in: 360 },
  { name: 'GettExpress',   value: '6441a768-f145-4aac-af90-b53dad3ec854', service_type: 'gett', earliest_available_in: 30 },
  # Gett vehicles in Russia
  # Moscow
  { name: 'Economy',       value: '0b2fe6c5-1158-4fbc-b0ba-5152cfc0622b', service_type: 'gett', earliest_available_in: 30 },
  { name: 'Standard',      value: '1b0fdd40-0f51-4dcd-953b-eae1b795c93d', service_type: 'gett', earliest_available_in: 30 },
  { name: 'StandardXL',    value: 'e7be65d1-4b5c-4ba0-850b-336e47ff2b69', service_type: 'gett', earliest_available_in: 30 },
  { name: 'Business',      value: '7e4f8a57-2ec8-4d42-b485-31873da0c88d', service_type: 'gett', earliest_available_in: 30 },
  { name: 'Exec',          value: '6aa9417b-53b3-49ed-8eb7-6b153525b309', service_type: 'gett', earliest_available_in: 30 },
  # St. Petersburg
  { name: 'Economy',       value: '3e311570-6887-458d-ab2c-7d12e5ab5a6b', service_type: 'gett', earliest_available_in: 30 },
  { name: 'Standard',      value: '06fbbcbd-460a-4d1e-8dfd-885c08f6de03', service_type: 'gett', earliest_available_in: 30 },
  { name: 'Standard',      value: 'ca674146-0d66-455e-aeaf-89d7da124393', service_type: 'gett', earliest_available_in: 30 },
  { name: 'Standard',      value: '30f1b521-e218-4750-a58f-aa0b7b5e2d9d', service_type: 'gett', earliest_available_in: 30 },
  { name: 'StandardXL',    value: '91ef26d3-c863-4b17-a529-a36d55d3d177', service_type: 'gett', earliest_available_in: 30 },
  { name: 'Business',      value: 'a4e59c5e-cfe8-47dd-83b0-b0ec4cb49888', service_type: 'gett', earliest_available_in: 30 },
  { name: 'Exec',          value: '6aa9417b-53b3-49ed-8eb7-6b153525b309', service_type: 'gett', earliest_available_in: 30 },
  # Kazan
  { name: 'Business',      value: '2bdd3cbd-c527-4e09-bd9e-1f3dc84fc31f', service_type: 'gett', earliest_available_in: 30 },
  { name: 'Economy',       value: 'c67d9b08-1bc3-4c43-8197-4f3adeb846af', service_type: 'gett', earliest_available_in: 30 },
  # Sochi
  { name: 'Exec',          value: '6aa9417b-53b3-49ed-8eb7-6b153525b309', service_type: 'gett', earliest_available_in: 30 },
  { name: 'Economy',       value: '43024bfc-5e64-4133-a053-c8119935427d', service_type: 'gett', earliest_available_in: 30 },
  { name: 'Business',      value: '07ad10f3-12d1-4987-a161-27a5e2b57bea', service_type: 'gett', earliest_available_in: 30 },
  { name: 'Exec',          value: 'd3a821cc-cde2-4148-bad3-d9721356c96a', service_type: 'gett', earliest_available_in: 30 },
  # Nizhny novgorod
  { name: 'Standard',      value: '5f2d6b18-9c3b-419f-9156-9ca3899fbc59', service_type: 'gett', earliest_available_in: 30 },
  { name: 'Business',      value: 'c6e87976-9483-4380-bdf7-e039c5477888', service_type: 'gett', earliest_available_in: 30 },
  # Samara
  { name: 'Standard',      value: 'a0aa8660-c091-40cb-a436-7bec0f7a7b1d', service_type: 'gett', earliest_available_in: 30 },
  # Rostov on don
  { name: 'Standard',      value: '01a35556-7c68-4dc3-a0bc-b882b6d9789a', service_type: 'gett', earliest_available_in: 30 },
  { name: 'Economy',       value: 'eb1ded94-cf8c-42e1-b869-fc3ddcfe0077', service_type: 'gett', earliest_available_in: 30 },
  # Ekaterinburg
  { name: 'Business',      value: '6a299243-890e-46cb-ad1f-56b60d9585f2', service_type: 'gett', earliest_available_in: 30 },
  { name: 'Business',      value: '682088f8-be11-4050-842e-59e9c0f7aa98', service_type: 'gett', earliest_available_in: 30 },
  { name: 'Economy',       value: '7d0cd74f-aa31-43e3-b3d6-0630cfa5ef1f', service_type: 'gett', earliest_available_in: 30 },
  # Volgograd
  { name: 'Economy',       value: '56129e57-74b4-4e46-8575-e5f9f7011e60', service_type: 'gett', earliest_available_in: 30 },
  { name: 'Economy',       value: '5f5af229-5977-4403-8a43-45f82c0f7229', service_type: 'gett', earliest_available_in: 30 },
  # Saransk
  { name: 'Business',      value: '679d7d27-8359-40f0-98a9-9646880f6980', service_type: 'gett', earliest_available_in: 30 },
  # Affiliate vehicles
  { name: 'BlackTaxi',     value: '319a1f5c-68ce-45e4-93ea-d7703cc0e55b', service_type: 'gett', earliest_available_in: 30 },

  { name: 'Standard',      value: 'Taxi Sedan',                           service_type: 'get_e', earliest_available_in: 30, pre_eta: 30 },
  { name: 'Standard',      value: 'Comfort Sedan',                        service_type: 'get_e', earliest_available_in: 30, pre_eta: 30 },
  { name: 'Exec',          value: 'Executive Sedan',                      service_type: 'get_e', earliest_available_in: 30, pre_eta: 30 },
  { name: 'Exec',          value: 'Business Sedan',                       service_type: 'get_e', earliest_available_in: 30, pre_eta: 30 },
  { name: 'MPV',           value: 'Taxi Van',                             service_type: 'get_e', earliest_available_in: 30, pre_eta: 30 },
  { name: 'MPV',           value: 'Comfort Van',                          service_type: 'get_e', earliest_available_in: 30, pre_eta: 30 },
  { name: 'MPV',           value: 'Business Van',                         service_type: 'get_e', earliest_available_in: 30, pre_eta: 30 },
  { name: 'MPV',           value: 'Executive Van',                        service_type: 'get_e', earliest_available_in: 30, pre_eta: 30 },
  { name: 'MPV',           value: 'Taxi Minibus',                         service_type: 'get_e', earliest_available_in: 30, pre_eta: 30 },
  { name: 'MPV',           value: 'Comfort Minibus',                      service_type: 'get_e', earliest_available_in: 30, pre_eta: 30 },
  { name: 'MPV',           value: 'Business Minibus',                     service_type: 'get_e', earliest_available_in: 30, pre_eta: 30 },
  { name: 'MPV',           value: 'Executive Minibus',                    service_type: 'get_e', earliest_available_in: 30, pre_eta: 30 },
  { name: 'MPV',           value: 'Taxi SUV',                             service_type: 'get_e', earliest_available_in: 30, pre_eta: 30 },
  { name: 'MPV',           value: 'Comfort SUV',                          service_type: 'get_e', earliest_available_in: 30, pre_eta: 30 },
  { name: 'MPV',           value: 'Business SUV',                         service_type: 'get_e', earliest_available_in: 30, pre_eta: 30 },
  { name: 'MPV',           value: 'Executive SUV',                        service_type: 'get_e', earliest_available_in: 30, pre_eta: 30 },

  { name: 'Chauffeur',     value: 'LS03',                                 service_type: 'carey', earliest_available_in: 120 },
  { name: 'Chauffeur',     value: 'ES03',                                 service_type: 'carey', earliest_available_in: 120 },
  { name: 'Chauffeur',     value: 'SU04',                                 service_type: 'carey', earliest_available_in: 120 },

  { name: 'Standard',      value: 'standard',                             service_type: 'splyt', earliest_available_in: 60 },
  { name: 'MPV',           value: 'van',                                  service_type: 'splyt', earliest_available_in: 60 },
  { name: 'Exec',          value: 'exec',                                 service_type: 'splyt', earliest_available_in: 60 },
  { name: 'Standard',      value: 'electric',                             service_type: 'splyt', earliest_available_in: 60 },
  { name: 'BabySeat',      value: 'baby',                                 service_type: 'splyt', earliest_available_in: 60 },
  { name: 'Standard',      value: 'eco',                                  service_type: 'splyt', earliest_available_in: 60 },
  { name: 'Wheelchair',    value: 'access',                               service_type: 'splyt', earliest_available_in: 60 }
])

unless Rails.env.production?
  Seeds.seed_once(Vehicle, :value, [
    # VIA provider (has different product_id on sandbox)
    { name: 'Standard',    value: '2f42d1fd-7efb-45bb-83c7-4a42bd37dde8', service_type: 'gett', earliest_available_in: 30 },
  ])
end

unless Rails.env.test?
  Seeds.seed_once(Ddi, :type, [
    {type: 'standard', phone: '+443451550802'},
    {type: 'key', phone: '+443451550803'},
    {type: 'mega', phone: '+443451550804'}
  ])

  Seeds.seed(PredefinedAddress, :line, [
    { line: 'London Gatwick Airport South Terminal Arrivals',                         postal_code: 'RH6 0NN',  lat: 51.156300, lng: -0.161157, country_code: 'GB', city: 'London' },
    { line: 'London Gatwick Airport South Terminal Departures',                       postal_code: 'RH6 0NN',  lat: 51.156300, lng: -0.161157, country_code: 'GB', city: 'London' },
    { line: 'London Gatwick Airport North Terminal Arrivals',                         postal_code: 'RH6 0NP',  lat: 51.160499, lng: -0.177869, country_code: 'GB', city: 'London' },
    { line: 'London Gatwick Airport North Terminal Departures',                       postal_code: 'RH6 0NP',  lat: 51.160499, lng: -0.177869, country_code: 'GB', city: 'London' },
    { line: 'London Heathrow Airport Terminal 1 Arrivals',                            postal_code: 'TW6 1BJ',  lat: 51.472529, lng: -0.450487, country_code: 'GB', city: 'London', additional_terms: 'one lhr' },
    { line: 'London Heathrow Airport Terminal 1 Departures',                          postal_code: 'TW6 1BJ',  lat: 51.472529, lng: -0.450487, country_code: 'GB', city: 'London', additional_terms: 'one lhr' },
    { line: 'London Heathrow Airport Terminal 2 Arrivals',                            postal_code: 'TW6 1RR',  lat: 51.469656, lng: -0.449628, country_code: 'GB', city: 'London', additional_terms: 'two lhr' },
    { line: 'London Heathrow Airport Terminal 2 Departures',                          postal_code: 'TW6 1RR',  lat: 51.469656, lng: -0.449628, country_code: 'GB', city: 'London', additional_terms: 'two lhr' },
    { line: 'London Heathrow Airport Terminal 3 Arrivals',                            postal_code: 'TW6 3PN',  lat: 51.470739, lng: -0.457767, country_code: 'GB', city: 'London', additional_terms: 'three lhr' },
    { line: 'London Heathrow Airport Terminal 3 Departures',                          postal_code: 'TW6 3PN',  lat: 51.470739, lng: -0.457767, country_code: 'GB', city: 'London', additional_terms: 'three lhr' },
    { line: 'London Heathrow Airport Terminal 4 Arrivals',                            postal_code: 'TW6 3FB',  lat: 51.460011, lng: -0.446501, country_code: 'GB', city: 'London', additional_terms: 'four lhr' },
    { line: 'London Heathrow Airport Terminal 4 Departures',                          postal_code: 'TW6 3FB',  lat: 51.460011, lng: -0.446501, country_code: 'GB', city: 'London', additional_terms: 'four lhr' },
    { line: 'London Heathrow Airport Terminal 5 Arrivals',                            postal_code: 'TW6 2GA',  lat: 51.471633, lng: -0.487991, country_code: 'GB', city: 'London', additional_terms: 'five lhr' },
    { line: 'London Heathrow Airport Terminal 5 Departures',                          postal_code: 'TW6 2GA',  lat: 51.471633, lng: -0.487991, country_code: 'GB', city: 'London', additional_terms: 'five lhr' },
    { line: 'Luton Airport Arrivals',                                                 postal_code: 'LU2 9LR',  lat: 51.879463, lng: -0.376390, country_code: 'GB', city: 'London', additional_terms: 'london' },
    { line: 'Luton Airport Departures',                                               postal_code: 'LU2 9LR',  lat: 51.879463, lng: -0.376390, country_code: 'GB', city: 'London', additional_terms: 'london' },
    { line: 'Stanstead Airport Arrivals',                                             postal_code: 'CM24 1RW', lat: 51.890035, lng: 0.261908,  country_code: 'GB', city: 'London', additional_terms: 'london' },
    { line: 'Stanstead Airport Departures',                                           postal_code: 'CM24 1RW', lat: 51.890035, lng: 0.261908,  country_code: 'GB', city: 'London', additional_terms: 'london' },
    { line: 'London City Airport Arrivals',                                           postal_code: 'E16 2PX',  lat: 51.504709, lng: 0.049513,  country_code: 'GB', city: 'London' },
    { line: 'London City Airport Departures',                                         postal_code: 'E16 2PX',  lat: 51.504709, lng: 0.049513,  country_code: 'GB', city: 'London' },
    { line: 'Credit Suisse, 17 Columbus Courtyard, Canary Wharf, London E14 4HE, UK', postal_code: 'E14 4HE',  lat: 51.505989, lng: -0.024879, country_code: 'GB', city: 'London' }
  ])

  Seeds.load('shared/vehicle_vendors.rb')

  Seeds.copy(:airports, 'shared/airports.pgcopy') if Airport.none?
end

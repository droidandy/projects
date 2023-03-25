module TravelRules
  class VehicleAvailability::LocationServicesSelector < ApplicationService
    attributes :location

    GETT_RU_SUPPORTED_CITIES = [
      'Adler',
      'Bolshoy Sochi',
      'Kazan',
      'Nizhnij Novgorod',
      'Rostov',
      'Samara',
      'Sankt-Peterburg',
      'Saransk',
      'Sochi',
      'Volgograd',
      'Yekaterinburg',
      'Moskva',
      'Vnukovo',       # Vnukovo airport
      'Ryazanovo',     # Ostaf'yevo airport
      'Shchyolkovo',   # Chkalovskiy airport
      'Khimki',        # Sheremet'evo airport
      'Moscow Oblast', # Domodeovo airport (DME)
      'Domodedovo',    # Domodedovo terminal
      'Zhukovskiy'     # Zhukovskiy airport
    ].freeze

    GETT_RU_SUPPORTED_REGIONS = [
      'Moscow',
      'Saint Petersburg'
    ].freeze

    def execute!
      case location[:country_code]
      when 'IL'
        ::Bookings::Providers::IL
      when 'RU'
        ru_providers
      when *Bookings::DOMESTIC_ORDER_COUNTRY_CODES
        ::Bookings::Providers::GB
      else
        ::Bookings::Providers::INTERNATIONAL
      end
    end

    private def ru_providers
      if location[:region].in?(GETT_RU_SUPPORTED_REGIONS) || location[:city].in?(GETT_RU_SUPPORTED_CITIES)
        [::Bookings::Providers::GETT]
      else
        # use international providers for different regions and cities
        ::Bookings::Providers::INTERNATIONAL
      end
    end
  end
end

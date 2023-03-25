module Addresses
  class Index < ApplicationService
    attributes :string, :countries_filter

    def execute!
      predefined = predefined_service.execute.result
      list, status = lookup_service.execute.result.values_at(:list, :status)

      { list: predefined + list, status: status }
    end

    private def predefined_service
      @predefined_service ||= Addresses::PredefinedList.new(string: string)
    end

    private def lookup_service
      @lookup_service ||=
        if looks_like_postcode?(string)
          Pcaw::List.new(string: string)
        else
          GoogleApi::AddressesList.new(string: string, countries_filter: countries_filter)
        end
    end

    private def looks_like_postcode?(param)
      /^\s*[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][A-Z]{2}\s*$/i =~ param
    end
  end
end

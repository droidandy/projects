module Locations
  class Index < ApplicationService
    include ApplicationService::Context

    delegate :company, to: :context

    def execute!
      company.locations_dataset.eager(:address).all.map do |location|
        Locations::Show.new(location: location).execute.result
      end
    end
  end
end

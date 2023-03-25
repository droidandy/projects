module Admin::PredefinedAddresses
  class PostalCodeValidator < ApplicationService
    include ApplicationService::ModelMethods

    attributes :postal_code

    def execute!
      Postcodes::IO.new.lookup(postal_code).present?
    end
  end
end

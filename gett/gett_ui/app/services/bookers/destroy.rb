module Bookers
  class Destroy < ApplicationService
    include ApplicationService::Context
    include ApplicationService::ModelMethods
    include ApplicationService::Policy

    attributes :booker
    delegate :errors, to: :booker

    def execute!
      destroy_model(booker)
    end
  end
end

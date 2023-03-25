module Vehicles
  class Index < ApplicationPresenter
    attr_reader :vehicles

    def initialize(vehicles, current_user)
      @vehicles = vehicles
      @current_user = current_user
    end

    def as_json(with_documents: true)
      {
        vehicles: vehicles.map do |vehicle|
          ::Vehicles::Show.new(vehicle, @current_user).as_json(with_documents: with_documents)
        end
      }
    end
  end
end

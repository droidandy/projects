module Passengers
  class ToggleBooker < ApplicationService
    attributes :passenger, :booker

    def execute!
      if passenger.passenger_of?(booker)
        passenger.remove_booker(booker.id)
      else
        passenger.add_booker(booker.id)
      end
    end

    def show_result
      Show.new(passenger: passenger).execute.result
    end
  end
end

module Bookers
  class TogglePassenger < ApplicationService
    attributes :booker, :passenger

    def execute!
      if booker.booker_of?(passenger)
        booker.remove_passenger(passenger.id)
      else
        booker.add_passenger(passenger.id)
      end
    end

    def show_result
      Bookers::AsJson.new(booker: booker, as: :row_item).execute.result
    end
  end
end

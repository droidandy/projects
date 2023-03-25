module Sections
  class CarTypesCheckboxList < SitePrism::Section
    section :black_taxi, Sections::Checkbox, :checkbox, 'BlackTaxi'
    section :black_taxi_xl, Sections::Checkbox, :checkbox, 'BlackTaxiXL'
    section :executive, Sections::Checkbox, :checkbox, 'Exec'
    section :people_carrier, Sections::Checkbox, :checkbox, 'MPV'
    section :standard, Sections::Checkbox, :checkbox, 'Standard'
    section :porsche, Sections::Checkbox, :checkbox, 'Porsche'

    def populate(types = [])
      Array(types).each do |type|
        if respond_to?(:"has_#{type}?") && send(:"has_#{type}?")
          send(type).check
        else
          raise "Invalid car type #{type} specified"
        end
      end
    end
  end
end

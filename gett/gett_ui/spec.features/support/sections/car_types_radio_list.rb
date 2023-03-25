module Sections
  class CarTypesRadioList < SitePrism::Section
    section :black_taxi, Checkbox, :ant_radio_button, 'BlackTaxi'
    section :black_taxi_xl, Checkbox, :ant_radio_button, 'BlackTaxiXL'
    section :executive, Checkbox, :ant_radio_button, 'Exec'
    section :people_carrier, Checkbox, :ant_radio_button, 'MPV'
    section :standard, Checkbox, :ant_radio_button, 'Standard'
    section :porsche, Checkbox, :ant_radio_button, 'Porsche'
  end
end

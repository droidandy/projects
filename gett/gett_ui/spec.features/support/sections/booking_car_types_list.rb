module Sections
  class BookingCarTypesList < Spinnable
    include ::Pages::Mixings::Spinnable::Loader

    section :special, Checkbox, :xpath, './/*[@role="tab"][.//*[text()="Special"]]'
    section :black_taxi, Checkbox, :xpath, './/*[@role="tab"][.//*[text()="Black Taxi"]]'
    section :black_taxi_xl, Checkbox, :xpath, './/*[@role="tab"][.//*[text()="Black Taxi XL"]]'
    section :executive, Checkbox, :xpath, './/*[@role="tab"][.//*[text()="Executive"]]'
    section :people_carrier, Checkbox, :xpath, './/*[@role="tab"][.//*[text()="People Carrier"]]'
    section :standard, Checkbox, :xpath, './/*[@role="tab"][.//*[text()="Standard"]]'
    section :active_car, Checkbox, :xpath, './/*[@role="tab" and @aria-selected="true"]/div'

    section :description, :text_node, 'vehicleDescription' do
      element :journey_cost, :text_node, 'journeyCost'
      element :booking_fee, :text_node, 'bookingFee'
      element :p11_tax_liability, :text_node, 'p11Tax'
      element :total_cost, :text_node, 'totalCost'
      element :total_cost_to_bbc, :text_node, 'totalCostBBC'
      element :salary_charge, :text_node, 'salaryCharge'
      element :price, :text_node, 'price'
      element :trader_price, :text_node, 'traderPrice'
    end

    def selected_car
      active_car[:'data-name']
    end

    def available_cars_list
      all(:xpath, './/*[@role="tab"]/div[@data-disabled="false"]').map{ |e| e[:'data-name'] }
    end

    def cars_loaded?
      BM.sleep 0.5
      wait_until_true(timeout: 15) { loaded? }
    end

    def wait_until_available
      cars_loaded?
      wait_until_active_car_visible(wait: 10)
    end
  end
end

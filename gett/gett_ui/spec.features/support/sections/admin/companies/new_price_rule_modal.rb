module Sections
  module Admin::Companies
    class NewPriceRuleModal < Sections::Modal
      section :rule_name, Sections::Input, :field, 'name'

      section :min_time, Sections::HourMinutePicker, '[data-name="minTime"]'
      section :max_time, Sections::HourMinutePicker, '[data-name="maxTime"]'

      element :asap,     'label', text: 'ASAP'
      element :future,   'label', text: 'Future'
      element :both,     'label', text: 'Both'

      section :car_types, Sections::CarTypesCheckboxList, '[data-name="vehicleTypes"]'

      element :point_to_point, 'label', text: 'Point to point'
      element :area,           'label', text: 'Area'

      section :pickup_address, Sections::Autocomplete, :combobox, 'pickupAddress'
      section :destination_address, Sections::Autocomplete, :combobox, 'destinationAddress'

      element :fixed_price, 'label', text: 'Fixed price'
      element :meter_price, 'label', text: 'Internal meter price'

      section :base_fare,      Sections::Input, :field, 'baseFare'
      section :initial_cost,   Sections::Input, :field, 'initialCost'
      section :after_distance, Sections::Input, :field, 'afterDistance'
      section :after_cost,     Sections::Input, :field, 'afterCost'
      section :map, Sections::GoogleMap, 'iframe'

      def populate(params = {})
        data = {
          rule_name: "New rule #{rand(100)}",
          car_types: [:black_taxi_xl],
          point_to_point: true,
          min_time: Time.new(1, 1, 1, 0, 0),
          max_time: Time.new(1, 1, 1, 23, 59),
          asap: true,
          future: true,
          pickup_address: '221b Baker Street, London, UK',
          destination_address: '167 Fleet Street, London, UK',
          fixed_price: false,
          base_fare: 10,
          initial_cost: 5,
          after_distance: 1,
          after_cost: 2
        }.merge(params)

        rule_name.set data[:rule_name]

        min_time.set data[:min_time].hour, data[:min_time].min
        max_time.set data[:max_time].hour, data[:max_time].min

        if !(data[:asap] ^ data[:future])
          both.click
        elsif data[:future]
          future.click
        else
          asap.click
        end

        car_types.populate(data[:car_types])

        if data[:point_to_point]
          point_to_point.click
          data[:pickup_address] = pickup_address.set data[:pickup_address]
          data[:destination_address] = destination_address.set data[:destination_address]
        else
          area.click
          wait_until_true { map.loaded? }
          BM.sleep 5
          map.draw_poligon
        end

        if data[:fixed_price]
          if data[:point_to_point]
            fixed_price.click
            base_fare.set data[:base_fare]
          else
            raise "Fixed price is not allowed for area"
          end
        else
          meter_price.click if data[:point_to_point]
          initial_cost.set data[:initial_cost]
          after_distance.set data[:after_distance]
          after_cost.set data[:after_cost]
        end
        data
      end
    end
  end
end

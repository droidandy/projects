module Sections
  module Admin
    module Bookings
      class OrderHistoryModal < ::Sections::Modal
        sections :records, '.ant-table-row' do
          element :field, 'td:nth-child(1)'
          element :author, 'td:nth-child(2)'
          element :from, 'td:nth-child(3)'
          element :to, 'td:nth-child(4)'
          element :time, 'td:nth-child(5)'
        end

        def select_by_type(type)
          records.select { |r| r.field.text =~ /#{type}/i }
        end
      end
    end
  end
end

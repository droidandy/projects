module Sections
  class HourMinutePicker < Base
    section :hour, Sections::Combobox, 'div:nth-child(1) > .ant-select-selection[role="combobox"]'
    section :min,  Sections::Combobox, 'div:nth-child(3) > .ant-select-selection[role="combobox"]'

    def set(set_hour, set_min)
      hour.select format('%02i', set_hour)
      min.select format('%02i', set_min)
    end
  end
end

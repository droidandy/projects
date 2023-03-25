module Sections
  class TimePicker < SitePrism::Section
    section :hours, Combobox, :xpath, './descendant::div[@role="combobox"][position()=1]'
    section :minutes, Combobox, :xpath, './descendant::div[@role="combobox"][position()=2]'

    def disabled?
      hours.disabled? && minutes.disabled?
    end
  end
end

module Sections
  class SpendChart < Base
    def_delegators :root_element, :hover
    element :tooltip, '.recharts-tooltip-wrapper'
  end
end

module Sections
  class Base < SitePrism::Section
    include WaitUntilTrueHelper

    def loaded?
      parent&.loaded? && super
    end
  end
end

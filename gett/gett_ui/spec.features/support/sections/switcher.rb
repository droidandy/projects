module Sections
  class Switcher < Spinnable
    element :switch, :xpath, '.'

    def_delegators :switch, :click, :disabled?, :[]

    def check
      switch.click unless checked?
    end

    def uncheck
      switch.click if checked?
    end

    def checked?
      case switch.tag_name
      when 'label', 'button', 'div', 'span'
        switch[:class].include?('checked') || switch[:class].include?('active')
      else
        switch.checked?
      end
    end
    alias selected? checked?
  end
end

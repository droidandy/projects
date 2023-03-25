module Sections
  class Phone < Combobox
    include ::Pages::Mixings::Spinnable::Loader

    def_delegators :input, :clear, :value

    def select(value, **)
      root_element.click if root_element[:'aria-expanded'] == 'false'

      wait_until_true do
        input.clear
        input.set(value)
        input.value.gsub(/\D/, '') == value.gsub(/\D/, '')
      end
    end
    alias set select

    def stripped_value
      input.value.delete('^+0-9')
    end
  end
end

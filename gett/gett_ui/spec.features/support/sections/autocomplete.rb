module Sections
  class Autocomplete < Combobox
    include ::Pages::Mixings::Spinnable::Loader

    element :selected_value, '.ant-select-selection-selected-value'

    def select(value, **options)
      autocomplete = options.fetch(:autocomplete, true)
      root_element.click if root_element[:'aria-expanded'] == 'false'

      wait_until_true do
        input.set(value)
        input.value == value
      end

      if autocomplete
        wait_until_true { loaded? }
        wait_until_true(timeout: 15) { find(:xpath, '//li[@role="option"]', text: /#{value}/i, visible: true, match: :first) }
        options(text: /#{value}/i, visible: true).first.click
        wait_until_true { loaded? }
      end
      if autocomplete && has_selected_value?(wait: 0)
        selected_value.text
      elsif has_input?(wait: 0)
        input.value
      else
        value
      end
    end
    alias set select
  end
end

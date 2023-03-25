module Sections
  class Multiselect < Combobox
    class SelectionChoice < Base
      element :name, '.ant-select-selection__choice__content'
      element :remove_btn, '.ant-select-selection__choice__remove'

      def remove
        remove_btn.click
      end

      def_delegators :name, :text
    end

    sections :selected, SelectionChoice, '.ant-select-selection__rendered .ant-select-selection__choice'

    def select(value, *)
      super
      wait_until_true { options.empty? }
    end

    def selected_options
      selected.map(&:text)
    end

    def remove(value)
      selected.find { |o| o.text == value }&.remove
    end
    alias unselect remove
  end
end

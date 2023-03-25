module Sections
  class Checkbox < Switcher
    element :switch, :xpath, './parent::span | .'

    element :error, :xpath, './ancestor::div/div[contains(@class, "error")]'

    def error_message
      error.text
    end
  end
end

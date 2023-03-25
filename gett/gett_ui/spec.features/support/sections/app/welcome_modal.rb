module Sections
  class App::WelcomeModal < SitePrism::Section
    element :next_button, :button, 'Next'
    element :previous_button, :button, 'Previous'
    element :finish_button, :button, 'Finish'

    def close
      next_button.click
      finish_button.click
    end
  end
end

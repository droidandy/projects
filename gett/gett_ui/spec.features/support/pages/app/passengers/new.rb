module Pages
  module App::Passengers
    class New < Pages::App::Passengers::Form
      set_url('/passengers/new')

      def submit
        save_button.click
      end
    end
  end
end

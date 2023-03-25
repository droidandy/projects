module Pages
  module Affiliate::Bookers
    class List < Pages::Affiliate::Base
      set_url('/affiliate/bookers')
      sections :bookers, Sections::App::Bookers::Booker, '.ant-table-row-level-0'
      section :search_field, Sections::Input, :field, 'searchBooker'
      element :new_booker_button, :button, text: 'Create new booker/admin'

      def all_names
        bookers.map(&:name)
      end

      def get_booker_by_name(name)
        bookers.find{ |b| b.name == name }
      end

      def get_booker_by_email(email)
        bookers.find{ |b| b.email == email }
      end
    end
  end
end

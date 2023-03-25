module Pages
  module App::Bookers
    class List < Pages::App::Base
      set_url('/bookers')

      sections :bookers, Sections::App::Bookers::Booker, '.ant-table-row-level-0'
      section :search_field, Sections::Input, :field, 'searchBooker'
      element :new_booker_button, :button, text: 'Create new booker/admin'
      element :export_button, :button, 'Export'

      def all_names
        bookers.map(&:name)
      end

      def get_booker_by_name(name)
        wait_until_true { bookers.present? }
        bookers.find{ |b| b.name == name }
      end

      def get_booker_by_email(email)
        wait_until_true { bookers.present? }
        bookers.find{ |b| b.email == email }
      end
    end
  end
end

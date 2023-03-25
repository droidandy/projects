module Pages
  module Admin::GettUsers
    class New < Pages::Admin::GettUsers::Form
      set_url('/admin/users/admins/new')

      def submit
        save_button.click
      end
    end
  end
end

module Pages
  module Admin::GettUsers
    class List < Pages::Admin::Base
      set_url('/admin/users/admins')
      element :new_user_button, :button, 'Create New User'
      sections :users, Sections::Admin::GettUsers::User, '.ant-table-row-level-0'

      def get_user_by_email(email)
        wait_for { users.find { |b| b.email == email } }
      end
    end
  end
end

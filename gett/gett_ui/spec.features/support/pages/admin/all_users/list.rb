module Pages
  module Admin::AllUsers
    class List < Pages::Admin::Base
      set_url('/admin/users/members')
      section :search_field, Sections::Input, :field, 'searchMember'
      sections :users, Sections::Admin::AllUsers::User, '.ant-table-row-level-0'

      def get_user_by_email(email)
        wait_until_true { users.present? }
        users.find{ |b| b.email == email }
      end

      section :set_password_modal, '.ant-modal-content' do
        section :password, Sections::Input, :field, 'password'
        section :confirm_password, Sections::Input, :field, 'passwordConfirmation'
        element :save_button, :button, 'Save'

        def new_password(pwd)
          password.set(pwd)
          confirm_password.set(pwd)
          save_button.click
        end
      end

      section :comments_modal, '.ant-modal-content' do
        section :message_field, Sections::Input, :field, 'commentMessage'
        element :add_comment_button, :button, 'Add Comment'

        sections :comments, :text_node, 'comment' do
          element :author, :text_node, 'commentAuthor'
          element :message, :text_node, 'commentText'
        end

        def add_comment(text)
          message_field.set(text)
          add_comment_button.click
        end
      end
    end
  end
end

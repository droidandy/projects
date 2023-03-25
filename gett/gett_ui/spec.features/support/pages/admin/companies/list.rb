module Pages
  module Admin::Companies
    class List < Pages::Admin::Base
      set_url('/admin/companies')
      sections :companies, Sections::Admin::Companies::Company, '.ant-table-row-level-0'

      section :search_field, Sections::Input, :field, 'searchCompany'
      element :new_company_button, :button, 'New Company'

      section :delete_modal, Sections::DeleteModal, '.ant-modal-content'
      section :customer_care_password_modal, Sections::Admin::Companies::CustomerCarePassword, '.ant-modal-content'

      def all_names
        companies.map(&:name)
      end

      def find_company(name)
        wait_until_true { companies.present? }
        companies.find{ |c| c.name == name }
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

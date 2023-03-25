module Admin
  module CompanyComments
    class Create < Comments::Create
      attributes :company, :params
      delegate :admin, to: :context

      def comment
        @comment ||= CompanyComment.new(company: company, author: admin)
      end
    end
  end
end

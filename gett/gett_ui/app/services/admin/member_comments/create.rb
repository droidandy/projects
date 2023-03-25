module Admin
  module MemberComments
    class Create < Comments::Create
      attributes :member, :params
      delegate :admin, to: :context

      def comment
        @comment ||= MemberComment.new(member: member, author: admin)
      end
    end
  end
end

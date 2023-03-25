module Admin
  module MemberComments
    class Index < Comments::Index
      attributes :member
      delegate :comments_dataset, to: :member
    end
  end
end

module Admin
  module CompanyComments
    class Index < Comments::Index
      attributes :company
      delegate :comments_dataset, to: :company
    end
  end
end

module Admin
  module BookingComments
    class Index < Comments::Index
      attributes :booking
      delegate :comments_dataset, to: :booking
    end
  end
end

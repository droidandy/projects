module Admin
  module BookingComments
    class Create < Comments::Create
      attributes :booking, :params
      delegate :admin, to: :context

      def comment
        @comment ||= BookingComment.new(booking: booking, author: admin)
      end
    end
  end
end

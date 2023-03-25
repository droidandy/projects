module Mobile::V1
  module Messages
    class Recent < ::Messages::Index
      def notifications_dataset
        newer_than = member.created_at

        super.where{ created_at >= newer_than }
      end
    end
  end
end

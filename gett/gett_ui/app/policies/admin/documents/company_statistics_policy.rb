module Admin
  module Documents
    class CompanyStatisticsPolicy < ServicePolicy
      def execute?
        %w(superadmin admin).include?(user.user_role_name)
      end
    end
  end
end

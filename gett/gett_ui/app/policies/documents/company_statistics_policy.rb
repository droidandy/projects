module Documents
  class CompanyStatisticsPolicy < ServicePolicy
    def execute?
      user.executive?
    end
  end
end

class CompanySettings::UpdatePolicy < ServicePolicy
  def execute?
    member.executive?
  end
end

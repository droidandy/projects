class Passengers::ManualImportPolicy < ServicePolicy
  delegate :company, to: :member

  def execute?
    !company.bbc? && member.executive?
  end
end

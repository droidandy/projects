class Bookers::ExportPolicy < ServicePolicy
  scope do |member|
    member.company.bookers_dataset
  end

  def execute?
    member.company.enterprise? && member.executive?
  end
end

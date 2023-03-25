class Departments::IndexPolicy < ServicePolicy
  scope { |member| member.company.departments_dataset }

  def execute?
    member.executive?
  end
end

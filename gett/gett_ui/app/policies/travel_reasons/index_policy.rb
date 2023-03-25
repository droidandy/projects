class TravelReasons::IndexPolicy < ServicePolicy
  scope { |member| member.company.travel_reasons_dataset }

  def execute?
    member.executive?
  end
end

class Admin::Members::Form < Shared::Passengers::Form
  attributes :member

  alias passenger member

  def execute!
    super.merge(passengers: passengers_data)
  end

  private def bookers_data
    company.bookers_dataset.active.by_name
      .as_json(only: [:id, :first_name, :last_name])
  end

  private def passengers_data
    company.passengers_dataset.active.by_name
      .as_json(only: [:id, :first_name, :last_name])
  end

  private def company
    member.company
  end

  private def show_service
    Admin::Members::Show
  end
end

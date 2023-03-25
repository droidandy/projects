module Passengers
  class Form < Shared::Passengers::Form
    delegate :company, to: :context

    def bookers_data
      policy_scope(:bookers).by_name
        .as_json(only: [:id, :first_name, :last_name, :assigned_to_all_passengers])
    end

    def show_service
      Passengers::Show
    end
  end
end

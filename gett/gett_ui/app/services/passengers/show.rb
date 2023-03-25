module Passengers
  class Show < Shared::Passengers::Show
    def current_user
      context.member
    end

    private def passenger_data
      super.deep_merge(
        'is_passenger_for_current_member' => passenger.passenger_of?(current_user),
        'can' => { be_expanded: policy.be_expanded? }
      )
    end
  end
end

class Admin::Members::Show < Shared::Passengers::Show
  def self.policy_class
    Admin::Policy
  end

  def current_user
    context.admin
  end

  private def passenger_data
    super.deep_merge('can' => { be_expanded: true })
  end
end

class Admin::BookingMessages::CreatePolicy < ServicePolicy
  def execute?
    user.back_office?
  end
end

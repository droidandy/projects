class Bookings::Repeat < Bookings::Form
  def self.policy_class
    Bookings::FormPolicy
  end
end

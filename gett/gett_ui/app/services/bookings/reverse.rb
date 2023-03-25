class Bookings::Reverse < Bookings::Form
  def self.policy_class
    Bookings::FormPolicy
  end
end

class Request < ApplicationRecord
  validates :request_class, presence: true
  validates :fleet_id, presence: true
  validates :performed_at, presence: true

  def self.expired?(request_class, fleet_id, ttl)
    request = find_request(request_class, fleet_id)
    request.blank? || request.performed_at < ttl.ago
  end

  def self.log(request_class, fleet_id)
    request = find_request(request_class, fleet_id)
    if request
      request.touch(:performed_at)
    else
      create!(
        request_class: request_class,
        fleet_id: fleet_id,
        performed_at: Time.current
      )
    end
  end

  def self.find_request(request_class, fleet_id)
    find_by(request_class: request_class, fleet_id: fleet_id)
  end
end

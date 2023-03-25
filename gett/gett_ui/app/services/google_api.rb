module GoogleApi
  module_function

  def find_distance(from, to)
    service = FindDistance.new(origin: from, destination: to).execute

    Hashie::Mash.new(service.success? ? service.result : {success: false})
  end

  def fetch_direction(from:, to:, waypoints:)
    service = Directions.new(origin: from, destination: to, waypoints: waypoints).execute

    Hashie::Mash.new(service.success? ? service.result : {success: false})
  end
end

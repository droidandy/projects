class Waypoint < Array
  def self.build(lat:, lng:, bearing:, status:)
    new([lat, lng, bearing, status == 'on_the_way'])
  end

  def lat
    self[0]
  end

  def lng
    self[1]
  end

  def bearing
    self[2]
  end

  def on_the_way?
    self[3]
  end

  def in_progress?
    !on_the_way?
  end

  def coordinates
    [lat, lng]
  end
end

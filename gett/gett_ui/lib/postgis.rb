module Postgis
  SRID = 4326
  COORDINATE_SYSTEM = "SRID=#{SRID}".freeze

  module_function

  def point_to_sql(point)
    lat, lng = point&.values_at(:lat, :lng)
    return if lat.blank? || lng.blank?

    "#{COORDINATE_SYSTEM};POINT(#{lng} #{lat})"
  end

  def polygon_to_sql(points)
    return if points.blank?

    points = [*points, points.first]
    sql_points = points.map do |point|
      [point.fetch(:lng), point.fetch(:lat)].join(' ')
    end.join(', ')
    "#{COORDINATE_SYSTEM};POLYGON((#{sql_points}))"
  end

  def sql_to_polygon(sql)
    return if sql.blank?

    points = sql.sub('POLYGON((', '').sub('))', '').split(',')[0...-1]
    points.map do |point|
      lng, lat = point.split(' ')
      {lat: lat.to_f, lng: lng.to_f}
    end
  end

  def geo_to_point(geo_point)
    return if geo_point.blank?

    latlng = JSON.parse(geo_point)['coordinates']
    { lat: latlng[0], lng: latlng[1] }
  end
end

class SplitDriverLocationIntoLatitudeAndLongitude < ActiveRecord::Migration[5.1]
  def change
    %i(future_orders active_orders completed_orders).each do |table|
      change_table table do |t|
        t.remove :driver_location
        t.float :driver_latitude
        t.float :driver_longitude
      end
    end
  end
end

class AddVehicleIdToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_reference :documents, :vehicle
  end
end

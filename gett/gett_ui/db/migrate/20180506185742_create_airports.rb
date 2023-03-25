Sequel.migration do
  change do
    create_table :airports do
      primary_key :id
      String :name
      String :iata
      Float :lat, index: true
      Float :lng, index: true
    end
  end
end

Sequel.migration do
  up do
    run('create extension if not exists postgis')
  end

  down do
    run('drop extension postgis')
  end
end

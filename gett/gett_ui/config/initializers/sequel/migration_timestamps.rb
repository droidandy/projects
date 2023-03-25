Sequel::Postgres::CreateTableGenerator.class_eval do
  def timestamps
    DateTime :created_at, null: false
    DateTime :updated_at, null: false
  end
end

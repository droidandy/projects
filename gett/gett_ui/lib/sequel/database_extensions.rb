module Sequel
  module DatabaseExtensions
    def add_index(table_name, columns, opts = Sequel::OPTS)
      return if opts[:if_not_exists] && index_exists?(table_name, columns)

      super
    end

    def index_exists?(table_name, columns)
      indexes(table_name).values.any?{ |desc| desc[:columns] == Array(columns) }
    end
  end
end

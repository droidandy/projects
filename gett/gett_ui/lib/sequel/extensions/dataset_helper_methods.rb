Sequel::Database.register_extension(:dataset_helper_methods) do |db|
  db.extend_datasets do
    def any?
      return all.any?(&Proc.new) if block_given?

      !empty?
    end
  end
end

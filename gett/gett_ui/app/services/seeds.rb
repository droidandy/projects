module Seeds
  module_function

  def seed(model, *keys, values_list, once: false, &block)
    service = Seeds::Seeder.new(
      model: model,
      keys: keys,
      values_list: values_list,
      transform: block,
      once: once
    )
    service.execute
  end

  def seed_once(*args, &block)
    seed(*args, once: true, &block)
  end

  def copy(table_name, filename, format: :binary)
    Rails.root.join('db/seeds', filename).open do |fh|
      DB.copy_into(table_name, data: fh, format: format)
    end
  end

  def load(path)
    seeds_path = Rails.root.join('db/seeds', path).to_s

    Kernel.load(seeds_path) if File.exist?(seeds_path)
  end
end

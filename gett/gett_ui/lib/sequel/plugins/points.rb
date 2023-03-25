module Sequel::Plugins::Points
  def self.configure(model, opts = {})
    model.instance_eval do
      [opts.fetch(:columns, [])].flatten.each do |column|
        define_method(column) do
          super()[1..-2].split(',').map(&:to_f)
        end

        define_method("#{column}=") do |arry|
          super("(#{arry[0]},#{arry[1]})")
        end
      end
    end
  end
end

module Sequel
  module DatasetModuleExtensions
    def scope(name, &block)
      define_method(name, &block)
    end
  end
end

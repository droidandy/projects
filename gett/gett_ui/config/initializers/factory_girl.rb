if defined? FactoryGirl
  module FactoryGirl
    def self.use_feature_factories
      @use_feature_factories = true
      yield
    ensure
      @use_feature_factories = nil
    end

    def self.use_feature_factories?
      !!@use_feature_factories
    end

    module UseFeatureFactories
      def find(name)
        featured_name = :"feature_#{name}"
        factory_name = (FactoryGirl.use_feature_factories? && registered?(featured_name)) ? featured_name : name
        super(factory_name)
      end
    end

    module FeatureFactoryDSL
      def feature_factory(name, *args, &block)
        factory(:"feature_#{name}", *args, &block)
      end
    end

    Registry.send(:prepend, UseFeatureFactories)
    Syntax::Default::DSL.send(:include, FeatureFactoryDSL)
  end
end

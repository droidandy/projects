module Sequel
  module Plugins::Config
    module ClassMethods
      def config
        @config ||= Hashie::Mash.new

        block_given? ? yield(@config) : @config
      end
    end

    module InstanceMethods
      def config
        self.class.config
      end
    end
  end
end

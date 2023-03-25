module Pages
  module Mixings
    module Spinnable
      module Spinner
        def self.included(mod)
          mod.module_eval do
            element :spinner, :xpath, "//*[contains(@class, 'ant-spin-spinning')]"
          end
        end
      end
      module Loader
        def self.included(mod)
          mod.module_eval do
            include Spinner
            load_validation do
              [has_no_spinner?, 'still loading...']
            end
          end
        end
      end
    end
  end
end

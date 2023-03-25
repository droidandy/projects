class GettBase < ActiveRecord::Base
  self.abstract_class = true
  establish_connection :gett_base
end

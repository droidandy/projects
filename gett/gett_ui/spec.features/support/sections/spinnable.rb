module Sections
  class Spinnable < Base
    element :spinner, :xpath, "//*[contains(@class, 'ant-spin-spinning')]"
  end
end

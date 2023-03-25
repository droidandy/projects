module Sections
  class PieChart < SitePrism::Section
    element :labels, :xpath, './/*[@class="recharts-layer recharts-pie-labels"]'
  end
end

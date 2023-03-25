module Sections
  class MonthlyChart < Base
    elements :bars, :xpath, '(.//*[@class="recharts-layer" and count(.//*[@class="recharts-rectangle"])>1])[1]//*[@class="recharts-rectangle"]'
    element :tooltip, '.recharts-tooltip-wrapper'
    elements :days, :xpath, '(.//*[@class="recharts-layer" and count(.//*[@class="recharts-rectangle"])>0])[1]//*[@class="recharts-rectangle"]'

    def hover_day(day_number)
      wait_for { days[day_number - 1] }.hover
    end

    def first_month
      bars.first
    end

    def last_month
      bars.last
    end
  end
end

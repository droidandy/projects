module Sections
  class Calendar < Spinnable
    element :input, 'input'
    section :calendar_popup, :xpath, '//*[contains(@class, "ant-calendar-panel")]' do
      element :date, 'input'
      element :month_year, '.ant-calendar-my-select'
      elements :dates, '.ant-calendar-date'
      element :selected, '.ant-calendar-date[aria-selected="true"]'

      def set(set_date = Date.current)
        date.set set_date.strftime('%d/%m/%Y')
        selected.click
      end
    end

    def set(date = Date.current)
      input.click
      wait_until_true { has_calendar_popup? }
      calendar_popup.set(date)
      wait_until_true { has_no_calendar_popup? }
    end

    def_delegators :input, :value
  end
end

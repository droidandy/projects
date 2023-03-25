module Sections
  class Pagination < SitePrism::Section
    element :prev_page, '.ant-pagination-prev'
    element :next_page, '.ant-pagination-next'
    element :next_pages, '.ant-pagination-jump-next'
    element :first_page, :xpath, './/li[2]'
    element :last_page, :xpath, './/li[last()-1]'

    def select_page(num)
      find(:xpath, ".//li[@title='#{num}']").click
    end
  end
end

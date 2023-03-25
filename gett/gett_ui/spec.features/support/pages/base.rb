module Pages
  class Base < SitePrism::Page
    include HeadersHelper
    include WaitUntilTrueHelper

    load_validation do
      [displayed?, "Failed to wait for page to be displayed"]
    end

    def load(expansion_or_html = {}, &block)
      super(expansion_or_html, &block).tap do
        wait_until_true { loaded? }
      end
    end

    def reload
      visit current_url
    end
  end
end

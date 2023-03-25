module Reviews
  class Stats < ApplicationPresenter
    attr_reader :driver

    def initialize(driver)
      @driver = driver
    end

    def as_json
      convert_to_json(driver, only: [:gett_phone]) do |json|
        json[:compliance_verified] = compliance_verified
      end
    end

    private def compliance_verified
      driver.approved_approval_status? && driver.vehicles.visible.approved_approval_status.any?
    end
  end
end

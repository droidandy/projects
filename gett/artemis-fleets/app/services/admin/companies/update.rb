module Admin
  module Companies
    class Update
      def initialize(company, params)
        @company = company
        @params = params
      end

      attr_reader :success, :errors

      def execute!
        Company.transaction do
          update_company
          update_admin
          update_address
          update_legal_address
        end
        @success = true
      rescue ActiveRecord::RecordInvalid => e
        @success = false
        @errors = e.record.errors
      end

      private def update_company
        @company.update!(@params.slice(
          :name, :logo, :vat_number, :cost_centre, :legal_name, :fleet_id,
          :salesman_id
        ))
      end

      private def update_admin
        return if @params[:admin].blank?
        @company.admin.update!(@params[:admin])
      end

      private def update_address
        return if @params[:address].blank?
        address = @company.address || Address.new
        address.update!(@params[:address])
        @company.update!(address: address)
      end

      private def update_legal_address
        return if @params[:legal_address].blank?
        legal_address = @company.legal_address || Address.new
        legal_address.update!(@params[:legal_address])
        @company.update!(legal_address: legal_address)
      end
    end
  end
end

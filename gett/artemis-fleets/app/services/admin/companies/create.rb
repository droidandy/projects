module Admin
  module Companies
    class Create
      def initialize(params)
        @params = params
      end

      attr_reader :success, :errors

      def execute!
        Company.transaction do
          create_company
          create_admin
          create_address
          create_legal_address
        end
        @success = true
      rescue ActiveRecord::RecordInvalid => e
        @success = false
        @errors = e.record.errors
      end

      private def create_company
        @company = Company.create!(@params.slice(
          :name, :logo, :vat_number, :cost_centre, :legal_name, :fleet_id,
          :salesman_id
        ))
      end

      private def create_admin
        admin = @company.members.new
        admin.update!(@params[:admin])
      end

      private def create_address
        return if @params[:address].blank?
        address = Address.create!(@params[:address])
        @company.update!(address: address)
      end

      private def create_legal_address
        return if @params[:legal_address].blank?
        legal_address = Address.create!(@params[:legal_address])
        @company.update!(legal_address: legal_address)
      end
    end
  end
end

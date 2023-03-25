module PaymentsOS
  class GetTokenInfo < ApplicationService
    attributes :token

    def execute!
      return unless create_payment_method_service.execute.success?

      last_4, exp_date = create_payment_method_service.data
        .values_at('last_4_digits', 'expiration_date')

      # According to PaymentsOS docs, possible expiration date formats are:
      # mm-yyyy, mm-yy, mm.yyyy, mm.yy, mm/yy, mm/yyyy, mm yyyy, mm yy
      exp_month, exp_year = exp_date.split(%r([\.\ \/-])).map(&:to_i)
      exp_year += 2000 if exp_year < 100

      {
        last_4: last_4,
        expiration_month: exp_month,
        expiration_year: exp_year
      }
    end

    private def create_customer_service
      @create_customer_service ||= PaymentsOS::CreateCustomer.new
    end

    private def create_payment_method_service
      @create_payment_method_service ||= PaymentsOS::CreatePaymentMethod.new(
        customer_id: create_customer_service.execute.result,
        token: token
      )
    end
  end
end

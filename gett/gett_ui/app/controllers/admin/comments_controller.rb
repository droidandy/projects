class Admin::CommentsController < Admin::BaseController
  RESOUCE_MAPPING = {
    company_id: Company,
    booking_id: Booking,
    member_id: Member
  }.freeze

  def index
    service = resource_namespace::Index.new(resource_name => resource)

    render json: service.execute.result
  end

  def create
    service = resource_namespace::Create.new(resource_name => resource, params: comment_params)

    if service.execute.success?
      render json: {comment: service.show_result}
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def resource
    RESOUCE_MAPPING.reduce(nil) do |obj, (key, klass)|
      obj || (klass.with_pk!(params[key]) if params.key?(key))
    end
  end

  private def resource_name
    resource.class.name.underscore.to_sym
  end

  private def resource_namespace
    "Admin::#{resource.class.name}Comments".constantize
  end

  private def comment_params
    params.require(:comment).permit(:text)
  end
end

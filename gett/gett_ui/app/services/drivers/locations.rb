class Drivers::Locations < ApplicationService
  attributes :params

  def execute!
    return [] if params.blank? || params[:lat].blank? || params[:lng].blank?

    Gett::DriversList.new(params).execute.result
  end
end

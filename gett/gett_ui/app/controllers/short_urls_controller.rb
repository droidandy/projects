class ShortUrlsController < AuthenticatedController
  def show
    render json: ShortUrls::Show.new(token: params[:id]).execute.result
  end
end

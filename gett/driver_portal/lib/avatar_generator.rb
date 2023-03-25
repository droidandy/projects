class AvatarGenerator
  BACKGROUND_COLORS = %w[
    #f6b530
    #282c37
    #74818f
    #d2dadc
    #4373d7
    #d55555
    #ff0000
    #81b73e
    #c78fff
    #72d555
    #3eaabe
    #8865a8
    #aeaeae
    #55d5b8
    #708a18
    #573787
  ].freeze
  FONT_COLOR = '#ffffff'.freeze
  SIZE = 200

  def initialize(user)
    @user = user
  end

  def generate
    file = Tempfile.new(['avatar', '.jpg'])
    image = Avatarly.generate_avatar(
      @user.name,
      font_color: FONT_COLOR,
      background_color: background_color,
      size: SIZE
    )
    File.open(file, 'wb') { |f| f.write image }
    file.rewind
    yield(file)
  ensure
    file.close
  end

  private def background_color
    index = @user.id % BACKGROUND_COLORS.count
    BACKGROUND_COLORS[index]
  end
end

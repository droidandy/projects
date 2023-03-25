# this monkey-patch changes behaviour of `I18n.transliterate`
# for undefined (not present in /Users/ori/Work/sphere/gett_ui/config/locales/transliterate.en.yml) symbols
# it will returns original symbol if `:replacement` not present
# (instead of DEFAULT_REPLACEMENT_CHAR in original)
#
# original: https://github.com/svenfuchs/i18n/blob/6b60a5b523de4015842d43dff8255c360ff51dec/lib/i18n/backend/transliterator.rb#L78-L83
class I18n::Backend::Transliterator::HashTransliterator
  def transliterate(string, replacement = nil)
    string.gsub(/[^\x00-\x7f]/u) do |char|
      approximations[char] || replacement || char
    end
  end
end

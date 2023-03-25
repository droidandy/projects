module CustomJunitFormatter
  def xml_dump_failed(example)
    xml_dump_example(example) do
      output << %{<failure}
      output << %{ message="#{escape(failure_message_for(example))}"}
      output << %{ type="#{escape(failure_type_for(example))}"}
      output << %{>}
      output << escape(failure_for(example))
      if (screenshot = example.example.metadata[:screenshot]) && screenshot[:image]
        output << %{\n Screenshot: }
        output << escape("https://#{ENV['CIRCLE_BUILD_NUM']}-85817446-gh.circle-artifacts.com/#{ENV['CIRCLE_NODE_INDEX']}#{screenshot[:image]}")
      end
      output << %{</failure>}
    end
  end
end

RSpecJUnitFormatter.prepend(CustomJunitFormatter)

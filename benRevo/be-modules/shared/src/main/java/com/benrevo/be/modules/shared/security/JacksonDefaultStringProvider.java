package com.benrevo.be.modules.shared.security;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import java.io.IOException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document.OutputSettings;
import org.jsoup.safety.Whitelist;
import org.springframework.boot.jackson.JsonComponent;


/**
 * Created by elliott on 10/10/17 at 6:46 PM.
 */
@JsonComponent
public class JacksonDefaultStringProvider {

    public static class Serializer extends JsonSerializer<String> {

        @Override
        public void serialize(String value, JsonGenerator gen, SerializerProvider serializers)
            throws IOException {
            gen.writeString(Jsoup.clean(value, "", Whitelist.basicWithImages(),
                new OutputSettings().prettyPrint(false)
            ).replace("&amp;", "&"));
        }
    }

    public static class Deserializer extends JsonDeserializer<String> {

        @Override
        public String deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            return p.getValueAsString();
        }
    }
}

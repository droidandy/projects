package com.benrevo.common.logging;

/**
 * Created by awelemdyorakwue on 5/22/17.
 */

import com.splunk.logging.HttpEventCollectorMiddleware.HttpSenderMiddleware;
import com.splunk.logging.HttpEventCollectorResendMiddleware;
import org.apache.logging.log4j.core.Filter;
import org.apache.logging.log4j.core.Layout;
import org.apache.logging.log4j.core.LogEvent;
import org.apache.logging.log4j.core.appender.AbstractAppender;
import org.apache.logging.log4j.core.config.plugins.Plugin;
import org.apache.logging.log4j.core.config.plugins.PluginAttribute;
import org.apache.logging.log4j.core.config.plugins.PluginElement;
import org.apache.logging.log4j.core.config.plugins.PluginFactory;
import org.apache.logging.log4j.core.layout.PatternLayout;

import java.io.Serializable;
import java.nio.charset.Charset;
import java.util.Dictionary;
import java.util.Hashtable;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Plugin(
    name = "CustomHttp",
    category = "Core",
    elementType = "appender",
    printObject = true
)
public final class CustomHttpEventCollectorLog4jAppender extends AbstractAppender {

    private CustomHttpEventCollectorSender sender = null;

    private CustomHttpEventCollectorLog4jAppender(
        String name,
        String url,
        String token,
        String source,
        String appCarrier,
        String sourcetype,
        String index,
        Filter filter,
        Layout<? extends Serializable> layout,
        boolean ignoreExceptions,
        long batchInterval,
        long batchCount,
        long batchSize,
        long retriesOnError,
        String sendMode,
        String middleware,
        String disableCertificateValidation
    ) {
        super(name, filter, layout, ignoreExceptions);

        Dictionary<String, String> metadata = new Hashtable<>();
        metadata.put("index", index != null ? index : "");
        metadata.put("source", source != null ? source : "");
        metadata.put("sourcetype", sourcetype != null ? sourcetype : "");
        metadata.put("app_carrier", isNotBlank(appCarrier) ? appCarrier : "");

        this.sender = new CustomHttpEventCollectorSender(
            url,
            token,
            batchInterval,
            batchCount,
            batchSize,
            sendMode,
            metadata
        );

        if(middleware != null && !middleware.isEmpty()) {
            try {
                this.sender.addMiddleware((HttpSenderMiddleware) Class.forName(middleware)
                                                                      .newInstance());
            } catch(Exception ignored) {
            }
        }

        if(retriesOnError > 0L) {
            this.sender.addMiddleware(new HttpEventCollectorResendMiddleware(retriesOnError));
        }

        if(disableCertificateValidation != null &&
           disableCertificateValidation.equalsIgnoreCase("true")) {
            this.sender.disableCertificateValidation();
        }
    }

    @PluginFactory
    public static CustomHttpEventCollectorLog4jAppender createAppender(
        @PluginAttribute("url") String url,
        @PluginAttribute("token") String token,
        @PluginAttribute("name") String name,
        @PluginAttribute("source") String source,
        @PluginAttribute("app_carrier") String appCarrier,
        @PluginAttribute("sourcetype") String sourcetype,
        @PluginAttribute("index") String index,
        @PluginAttribute("ignoreExceptions") String ignore,
        @PluginAttribute("batch_size_bytes") String batchSize,
        @PluginAttribute("batch_size_count") String batchCount,
        @PluginAttribute("batch_interval") String batchInterval,
        @PluginAttribute("retries_on_error") String retriesOnError,
        @PluginAttribute("send_mode") String sendMode,
        @PluginAttribute("middleware") String middleware,
        @PluginAttribute("disableCertificateValidation") String disableCertificateValidation,
        @PluginElement("Layout") Layout<? extends Serializable> layout,
        @PluginElement("Filter") Filter filter
    ) {
        if(name == null) {
            LOGGER.error("No name provided for CustomHttpEventCollectorLog4jAppender");
            return null;
        } else if(url == null) {
            LOGGER.error("No Splunk URL provided for CustomHttpEventCollectorLog4jAppender");
            return null;
        } else if(token == null) {
            LOGGER.error("No token provided for CustomHttpEventCollectorLog4jAppender");
            return null;
        } else {
            if(layout == null) {
                layout = PatternLayout.newBuilder()
                                      .withPattern("%m")
                                      .withCharset(Charset.forName("UTF-8"))
                                      .build();
            }

            return new CustomHttpEventCollectorLog4jAppender(
                name,
                url,
                token,
                source,
                appCarrier,
                sourcetype,
                index,
                filter,
                layout,
                true,
                (long) parseInt(batchInterval, 10000),
                (long) parseInt(batchCount, 10),
                (long) parseInt(batchSize, 10240),
                (long) parseInt(retriesOnError, 0),
                sendMode,
                middleware,
                disableCertificateValidation
            );
        }
    }

    public void append(LogEvent event) {
        this.sender.send(event);
    }

    public void stop() {
        this.sender.flush();
        super.stop();
    }
}

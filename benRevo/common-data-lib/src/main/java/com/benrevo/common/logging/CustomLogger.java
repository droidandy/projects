package com.benrevo.common.logging;

import com.benrevo.common.exception.BaseException;

import java.util.stream.Collectors;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.message.Message;
import org.apache.logging.log4j.message.MessageFactory;
import org.apache.logging.log4j.message.SimpleMessage;
import org.apache.logging.log4j.spi.AbstractLogger;
import org.apache.logging.log4j.spi.ExtendedLoggerWrapper;

import static java.lang.String.format;
import static java.util.Arrays.stream;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.apache.logging.log4j.Level.*;
import static org.apache.logging.log4j.LogManager.getLogger;

/**
 * Created by elliott on 6/23/17.
 */
public class CustomLogger extends ExtendedLoggerWrapper {

    private static final String KV_FORMAT = "%s=%s";
    private static final String MSG_FORMAT = "%s%s";

    private final ExtendedLoggerWrapper logger;

    private CustomLogger(final Logger logger) {
        super((AbstractLogger) logger, logger.getName(), logger.getMessageFactory());
        this.logger = this;
    }

    /**
     * Returns a custom Logger with the name of the calling class.
     *
     * @return The custom Logger for the calling class.
     */
    public static CustomLogger create() {
        return new CustomLogger(getLogger());
    }

    /**
     * Returns a custom Logger using the fully qualified name of the Class as
     * the Logger name.
     *
     * @param loggerName The Class whose name should be used as the Logger name.
     *            If null it will default to the calling class.
     * @return The custom Logger.
     */
    public static CustomLogger create(final Class<?> loggerName) {
        return new CustomLogger(getLogger(loggerName));
    }

    /**
     * Returns a custom Logger using the fully qualified class name of the value
     * as the Logger name.
     *
     * @param value The value whose class name should be used as the Logger
     *            name. If null the name of the calling class will be used as
     *            the logger name.
     * @return The custom Logger.
     */
    public static CustomLogger create(final Object value) {
        return new CustomLogger(getLogger(value));
    }

    /**
     * Returns a custom Logger using the fully qualified class name of the value
     * as the Logger name.
     *
     * @param value The value whose class name should be used as the Logger
     *            name. If null the name of the calling class will be used as
     *            the logger name.
     * @param messageFactory The message factory is used only when creating a
     *            logger, subsequent use does not change the logger but will log
     *            a warning if mismatched.
     * @return The custom Logger.
     */
    public static CustomLogger create(final Object value, final MessageFactory messageFactory) {
        return new CustomLogger(getLogger(value, messageFactory));
    }

    /**
     * Returns a custom Logger with the specified name.
     *
     * @param name The logger name. If null the name of the calling class will
     *            be used.
     * @return The custom Logger.
     */
    public static CustomLogger create(final String name) {
        return new CustomLogger(getLogger(name));
    }

    /**
     * Returns a custom Logger with the specified name.
     *
     * @param name The logger name. If null the name of the calling class will
     *            be used.
     * @param messageFactory The message factory is used only when creating a
     *            logger, subsequent use does not change the logger but will log
     *            a warning if mismatched.
     * @return The custom Logger.
     */
    public static CustomLogger create(final String name, final MessageFactory messageFactory) {
        return new CustomLogger(getLogger(name, messageFactory));
    }

    void logInternal(String n, Level l, String m, Throwable t, Pair<String, Object>... f) {
        String rm = m;

        if(f != null) {
            String fStr = stream(f)
                .map(p -> format(KV_FORMAT, p.getKey(), p.getValue()))
                .collect(Collectors.joining(", "));

            rm = format(MSG_FORMAT, m, isNotBlank(fStr) ? "; " + fStr : "");
        }

        String fqcn = isNotBlank(n) ? n : logger.getName();

        if(t != null && t instanceof BaseException) {
            t = ((BaseException) t).withFields(f);
        }

        logger.logMessage(fqcn, l, null, new SimpleMessage(rm), t);
    }

    public <T extends Message> void infoLog(T message) {
        logger.logMessage(logger.getName(), INFO, null, message, null);
    }

    public <T extends Message> void infoLog(String fqcn, T message) {
        logger.logMessage(fqcn, INFO, null, message, null);
    }

    public void infoLog(String m, Pair<String, Object>... f) {
        logInternal(null, INFO, m, null, f);
    }

    public void infoLog(String fqcn, String m, Pair<String, Object>... f) {
        logInternal(fqcn, INFO, m, null, f);
    }

    public void warnLog(String m, Pair<String, Object>... f) {
        logInternal(null, WARN, m, null, f);
    }

    public void warnLog(String fqcn, String m, Pair<String, Object>... f) {
        logInternal(fqcn, WARN, m, null, f);
    }

    public void warnLog(String m, Throwable t, Pair<String, Object>... f) {
        logInternal(null, WARN, m, t, f);
    }

    public void warnLog(String fqcn, String m, Throwable t, Pair<String, Object>... f) {
        logInternal(fqcn, WARN, m, t, f);
    }

    public void errorLog(String m, Pair<String, Object>... f) {
        logInternal(null, ERROR, m, null, f);
    }

    public void errorLog(String fqcn, String m, Pair<String, Object>... f) {
        logInternal(fqcn, ERROR, m, null, f);
    }

    public void errorLog(String m, Throwable t, Pair<String, Object>... f) {
        logInternal(null, ERROR, m, t, f);
    }

    public void errorLog(String fqcn, String m, Throwable t, Pair<String, Object>... f) {
        logInternal(fqcn, ERROR, m, t, f);
    }
}

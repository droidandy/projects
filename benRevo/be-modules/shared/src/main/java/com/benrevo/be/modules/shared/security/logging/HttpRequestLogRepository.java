package com.benrevo.be.modules.shared.security.logging;

import static java.time.ZonedDateTime.now;
import static java.time.format.DateTimeFormatter.ofPattern;
import static java.util.Objects.isNull;

import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.logging.http.HttpRequestLogMessage;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.trace.Trace;
import org.springframework.boot.actuate.trace.TraceRepository;
import org.springframework.stereotype.Component;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

/**
 * Allows us to log HTTP requests in Splunk/Log4j2.
 *
 * This can be disabled by setting the TRACE_LOGGING system property to false.
 */
@Component
public class HttpRequestLogRepository implements TraceRepository {

  @Value("${http.logging.enabled}")
  private boolean enabled;

  @Autowired
  private CustomLogger LOGGER;

  @Override
  public List<Trace> findAll() {
    throw new NotImplementedException();
  }

  @Override
  public void add(Map<String, Object> traceInfo) {
    if (enabled && traceInfo != null) {
      traceInfo.putIfAbsent(
          "timestamp",
          ofPattern("EEE, d MMM yyyy, h:mm:ss a z").format(now())
      );

      traceInfo.computeIfPresent(
          "timeTaken",
          (k, v) -> !isNull(v) ? Long.valueOf((String) v) : null
      );

      LOGGER.infoLog(new HttpRequestLogMessage(traceInfo));
    }
  }
}

package com.benrevo.be.modules.shared.util;

import com.google.common.base.Splitter;
import org.springframework.http.HttpMethod;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

import static java.util.Arrays.stream;
import static org.apache.commons.lang3.StringUtils.*;

/**
 * Created by elliott on 7/11/17.
 */
public class ServletUtil {

    public static String getRequestURI(ServletRequest r) {
        return ((HttpServletRequest) r).getRequestURI();
    }

    public static List<String> getPathTokens(ServletRequest r) {
        final String url = ((HttpServletRequest) r).getRequestURI();

        return isNotBlank(url) ? Splitter.on("/").omitEmptyStrings().splitToList(url) : null;
    }

    public static boolean pathPrefixMatches(ServletRequest r, String ... matches) {
        List<String> t = getPathTokens(r);

        return (t != null && t.size() > 0) && equalsAnyIgnoreCase(t.get(0), matches);
    }

    public static boolean methodMatches(ServletRequest r, HttpMethod ... matches) {
        HttpMethod m = HttpMethod.resolve(((HttpServletRequest) r).getMethod());

        return m != null && equalsAnyIgnoreCase(m.name(), stream(matches).map(Enum::name).toArray(String[]::new));
    }
}

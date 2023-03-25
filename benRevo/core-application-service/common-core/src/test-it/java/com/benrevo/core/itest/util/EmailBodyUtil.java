package com.benrevo.core.itest.util;

import java.io.IOException;
import javax.mail.MessagingException;
import org.apache.commons.io.IOUtils;
import org.subethamail.wiser.Wiser;


/**
 * The type Email body util.
 */
public class EmailBodyUtil {

    /**
     * Gets body email.
     *
     * @param wiser
     *     the wiser
     *
     * @return the body email
     *
     * @throws IOException
     *     the io exception
     * @throws MessagingException
     *     the messaging exception
     */
    public static String getBodyEmail(Wiser wiser) throws IOException, MessagingException {
        return IOUtils.toString(
            wiser.getMessages().get(0).getMimeMessage().getInputStream(), "UTF-8");
    }

    /**
     * Gets subject email.
     *
     * @param wiser
     *     the wiser
     *
     * @return the subject email
     *
     * @throws IOException
     *     the io exception
     * @throws MessagingException
     *     the messaging exception
     */
    public static String getSubjectEmail(Wiser wiser) throws IOException, MessagingException {
        return wiser.getMessages().get(0).getMimeMessage().getSubject();
    }
}

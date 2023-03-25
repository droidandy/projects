package com.benrevo.be.modules.shared.util;

import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import java.io.*;

/**
 * Command line utility to establish a SSL connection to a host and port, writes a byte and
 * print the response. Used for testing SSL certs.
 *
 * javac SSLPoke.java
 * java -cp . SSLPoke "host" "port"
 */
public class SSLPoke {
    public static void main(String[] args) {
        if (args.length != 2) {
            System.out.println("Usage: "+SSLPoke.class.getName()+" <host> <port>");
            System.exit(1);
        }
        try {
            SSLSocketFactory sslsocketfactory = (SSLSocketFactory) SSLSocketFactory.getDefault();
            SSLSocket sslsocket = (SSLSocket) sslsocketfactory.createSocket(args[0], Integer.parseInt(args[1]));

            InputStream in = sslsocket.getInputStream();
            OutputStream out = sslsocket.getOutputStream();

            out.write(1);

            while (in.available() > 0) {
                System.out.print(in.read());
            }
            System.out.println("Successfully connected");

        } catch (Exception exception) {
            exception.printStackTrace();
        }
    }
}

package com.benrevo.be.modules.shared.service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.*;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.exception.BaseException;

import org.apache.pdfbox.io.IOUtils;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;

import static com.benrevo.common.enums.CarrierType.fromString;
import static java.lang.String.format;
import static java.util.UUID.randomUUID;
import static org.apache.commons.io.IOUtils.closeQuietly;
import static org.apache.commons.lang3.StringUtils.defaultString;
import static org.apache.commons.lang3.StringUtils.deleteWhitespace;
import static org.apache.commons.lang3.StringUtils.split;
import static org.apache.pdfbox.io.IOUtils.toByteArray;

@Component
public class S3FileManager implements InitializingBean {

    private static final String PATH_FORMAT = "%s/%s_%s";

    @Value("${aws.s3.access.key}")
    private String accessKey;

    @Value("${aws.s3.secret.key}")
    private String secretKey;

    @Value("${aws.s3.bucket}")
    private String bucket;

    @Value("${aws.s3.bucket.path}")
    private String bucketPath;

    @Value("${aws.s3.rfp.folder}")
    private String rfpFolder;
    
    @Value("${aws.s3.quote.folder}")
    private String quoteFolder;

    @Value("${app.carrier}")
    private String[] appCarrier;

    @Value("${aws.s3.document.folder}")
    private String documentFolder;

    @Value("${app.region}")
    private String region;

    public final String uploadRfp(String fileName, InputStream inputStream, String contentType, long size) throws IOException {
        return upload(fileName, inputStream, contentType, size, rfpFolder);
    }

    public final String uploadRfp(String fileName, InputStream inputStream, String contentType,
        long size, CarrierType carrier) throws IOException {
        return upload(fileName, inputStream, contentType, size, carrier, rfpFolder);
    }
    
    public final String uploadQuote(String fileName, InputStream inputStream, String contentType, long size) throws IOException {
        return upload(fileName, inputStream, contentType, size, quoteFolder);
    }

    public final String uploadQuote(String fileName, InputStream inputStream, String contentType,
        long size, CarrierType carrier) throws IOException {
        return upload(fileName, inputStream, contentType, size, carrier, quoteFolder);
    }

    public String uploadCommonFile(String fileName, InputStream inputStream, String contentType,
        long size, CarrierType carrier) throws IOException {
        return upload(fileName, inputStream, contentType, size, carrier, documentFolder);
    }

    protected String upload(String fileName, InputStream inputStream, String contentType,
        long size, CarrierType carrier, String folder) throws IOException {
        AmazonS3 awsClient = AmazonS3ClientBuilder
            .standard()
            .withRegion(region)
            .withCredentials(
                new AWSStaticCredentialsProvider(
                    new BasicAWSCredentials(accessKey, secretKey)
                )
            ).build();

        try {
            String b = format(bucket, carrier.abbreviation);

            ObjectMetadata metaData = new ObjectMetadata();
            metaData.setContentType(contentType);
            metaData.setContentLength(size);
            metaData.setContentDisposition(fileName);

            String key = format(
                PATH_FORMAT,
                folder,
                randomUUID().toString(),
                deleteWhitespace(fileName)
            );

            awsClient.putObject(b, key, inputStream, metaData);
            awsClient.setObjectAcl(b, key, CannedAccessControlList.PublicRead);

            return key;
        } catch (AmazonS3Exception e) {
            throw new BaseException("There was an issue with your request. Please try again.",
                e.getStatusCode(), e);
        } finally {
            closeQuietly(inputStream);
            awsClient.shutdown();
        }
    }

    protected String upload(String fileName, InputStream inputStream, String contentType, long size, String folder) throws IOException {
        AmazonS3 awsClient = AmazonS3ClientBuilder
            .standard()
            .withCredentials(
                new AWSStaticCredentialsProvider(
                    new BasicAWSCredentials(accessKey, secretKey)
                )
            ).build();

        try {
            ObjectMetadata metaData = new ObjectMetadata();
            metaData.setContentType(contentType);
            metaData.setContentLength(size);
            metaData.setContentDisposition(fileName);
            
            String key = format(
                PATH_FORMAT,
                defaultString(folder, "test"),
                randomUUID().toString(),
                deleteWhitespace(fileName)
            );

            awsClient.putObject(bucket, key, inputStream, metaData);
            awsClient.setObjectAcl(bucket, key, CannedAccessControlList.PublicRead);

            return key;
        } catch(AmazonS3Exception e) {
            throw new BaseException("There was an issue with your request. Please try again.", e.getStatusCode(), e);
        } finally {
            closeQuietly(inputStream);
            awsClient.shutdown();
        }
    }

    public FileDto download(String key) throws IOException {
        AmazonS3 awsClient = AmazonS3ClientBuilder
            .standard()
            .withCredentials(
                new AWSStaticCredentialsProvider(
                    new BasicAWSCredentials(accessKey, secretKey)
                )
            ).build();
        
        FileDto result = new FileDto();
        try {
            S3Object object = awsClient.getObject(bucket, key);

            result.setType(object.getObjectMetadata().getContentType());
            result.setSize(object.getObjectMetadata().getContentLength());
            result.setName(object.getObjectMetadata().getContentDisposition());
            result.setContent(toByteArray(object.getObjectContent()));
            
            closeQuietly(object);

            return result;
        } catch(AmazonS3Exception e) {
            throw new BaseException("There was an issue with your request. Please try again.", e.getStatusCode(), e);
        } finally {
            awsClient.shutdown();
        }
    }

    public FileDto download(String key, String carrierName) throws IOException {
        AmazonS3 awsClient = AmazonS3ClientBuilder
            .standard()
            .withRegion(region)
            .withCredentials(
                new AWSStaticCredentialsProvider(
                    new BasicAWSCredentials(accessKey, secretKey)
                )
            ).build();
        FileDto result = new FileDto();
        try {
            CarrierType carrier = fromString(carrierName);
            String b = format(bucket, carrier.abbreviation);

            S3Object object = awsClient.getObject(new GetObjectRequest(b, key));

            result.setType(object.getObjectMetadata().getContentType());
            result.setSize(object.getObjectMetadata().getContentLength());
            result.setContent(IOUtils.toByteArray(object.getObjectContent()));

            closeQuietly(object);

            return result;
        } catch (AmazonS3Exception e) {
            throw new BaseException("There was an issue with your request. Please try again.",
                e.getStatusCode(), e);
        } finally {
            awsClient.shutdown();
        }
    }

    public String getNameFromKey(String key) {
        return split(key, "_", 2)[1];
    }

    /**
     * For unit-test cleanup.
     */
    public void delete(String key) {
        AmazonS3 awsClient = AmazonS3ClientBuilder
            .standard()
            .withCredentials(
                new AWSStaticCredentialsProvider(
                    new BasicAWSCredentials(accessKey, secretKey)
                )
            ).build();

        try {
            awsClient.deleteObject(bucket, key);
        } catch(AmazonS3Exception e) {
            throw new BaseException("There was an issue with your request. Please try again.", e.getStatusCode(), e);
        } finally {
            awsClient.shutdown();
        }
    }

    public void delete(String key, CarrierType carrier) {
        AmazonS3 awsClient = AmazonS3ClientBuilder
            .standard()
            .withRegion(region)
            .withCredentials(
                new AWSStaticCredentialsProvider(
                    new BasicAWSCredentials(accessKey, secretKey)
                )
            ).build();

        try {
            awsClient.deleteObject(format(bucket, carrier.abbreviation), key);
        } catch (AmazonS3Exception e) {
            throw new BaseException("There was an issue with your request. Please try again.",
                e.getStatusCode(), e);
        } finally {
            awsClient.shutdown();
        }
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        CarrierType carrier = fromString(appCarrier[0]);

        bucket = format(bucket, carrier.abbreviation);
        bucketPath = format(bucketPath, carrier.abbreviation, "");
    }
}

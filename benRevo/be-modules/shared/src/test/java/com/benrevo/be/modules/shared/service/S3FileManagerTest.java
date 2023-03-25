package com.benrevo.be.modules.shared.service;

import static java.nio.file.Files.deleteIfExists;
import static java.nio.file.Files.probeContentType;
import static org.junit.Assert.assertEquals;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.FileDto;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

//TODO create base test class: AbstractServiceTest
public class S3FileManagerTest extends AbstractControllerTest  {

    @Autowired
    S3FileManager s3FileManager;

	@Override
	public void init() throws Exception {
		
	}

    @Test
    @Ignore // needs to be fixed with region provided for the sdk
    public void testUploadDownloadS3() throws IOException {
        String filename = "test.txt";
        String contents = "This is my test file for " + (new Date());
        FileOutputStream out = new FileOutputStream(filename);
        out.write(contents.getBytes());
        out.close();

        File f = new File(filename);

        String fn = f.getName();
        FileInputStream is = new FileInputStream(f);
        String ct = probeContentType(f.toPath());
        long l = f.length();

        String key = s3FileManager.uploadQuote(fn, is, ct, l);

        FileDto download = s3FileManager.download(key);

        assertEquals(contents, new String(download.getContent()));

        s3FileManager.delete(key);
        deleteIfExists(f.toPath());
    }
}

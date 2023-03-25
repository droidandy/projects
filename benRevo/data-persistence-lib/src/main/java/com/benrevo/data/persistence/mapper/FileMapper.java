package com.benrevo.data.persistence.mapper;

import com.benrevo.common.dto.FileDto;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.ClientFileUpload;

import java.util.List;

public class FileMapper {

    static {

        ObjectMapperUtils
            .createTypeMap(ClientFileUpload.class, FileDto.class)
            .addMappings(mapper -> mapper.skip(FileDto::setName))
            .addMappings(mapper -> mapper.skip(FileDto::setContent));
        
        ObjectMapperUtils
            .createTypeMap(FileDto.class, ClientFileUpload.class);
    }

    
    public static FileDto fileToDto(ClientFileUpload fileUpload) {
        return ObjectMapperUtils.map(fileUpload, FileDto.class);
    }

    public static ClientFileUpload dtoToFile(FileDto dto) {
        return ObjectMapperUtils.map(dto, ClientFileUpload.class);
    }

    public static List<FileDto> filesToDtos(List<ClientFileUpload> fileUploads) {
        return ObjectMapperUtils.mapAll(fileUploads, FileDto.class);
   }

    public static List<ClientFileUpload> dtosToFiles(List<FileDto> dtos) {
        return ObjectMapperUtils.mapAll(dtos, ClientFileUpload.class);
    }

}

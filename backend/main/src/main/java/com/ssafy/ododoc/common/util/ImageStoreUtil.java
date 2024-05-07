package com.ssafy.ododoc.common.util;

import com.ssafy.ododoc.directory.exception.NotAllowedImageException;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ImageStoreUtil {

    private final List<String> allowedExtensionList = List.of("image/jpg", "image/jpeg", "image/png", "image/gif");

    public void checkImageExtension(String fileName, String extension) {
        if(fileName.lastIndexOf(".") == -1 && !allowedExtensionList.contains(extension.toLowerCase())) {
            throw new NotAllowedImageException("지원하지 않는 형식의 파일입니다.");
        }
    }
}

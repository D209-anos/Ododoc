package com.ssafy.ododoc.file.service;

import com.ssafy.ododoc.common.util.S3Util;
import com.ssafy.ododoc.file.dto.response.ImageResponse;
import com.ssafy.ododoc.directory.entity.Directory;
import com.ssafy.ododoc.directory.exception.CannotUploadImageException;
import com.ssafy.ododoc.directory.exception.DirectoryAccessDeniedException;
import com.ssafy.ododoc.directory.exception.DirectoryAlreadyDeletedException;
import com.ssafy.ododoc.directory.exception.DirectoryNotFoundException;
import com.ssafy.ododoc.directory.repository.DirectoryRepository;
import com.ssafy.ododoc.directory.type.DirectoryType;
import com.ssafy.ododoc.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class FileService {

    private final DirectoryRepository directoryRepository;
    private final S3Util s3Util;

    public ImageResponse uploadImage(Long directoryId, MultipartFile image, Member member) {
        Directory directory = directoryRepository.findById(directoryId)
                .orElseThrow(() -> new DirectoryNotFoundException("해당하는 폴더/파일을 찾을 수 없습니다."));

        if(!directory.getMember().equals(member)) {
            throw new DirectoryAccessDeniedException("접근 권한이 없습니다.");
        }

        if(directory.getTrashbinTime() != null || directory.getDeletedTime() != null) {
            throw new DirectoryAlreadyDeletedException("이미 삭제된 폴더/파일입니다.");
        }

        if(directory.getType().equals(DirectoryType.FOLDER)) {
            throw new CannotUploadImageException("폴더에는 이미지를 업로드 할 수 없습니다.");
        }

        return ImageResponse.builder()
                .id(directory.getId())
                .imageUrl(s3Util.uploadImage(image))
                .build();
    }
}

package com.ssafy.ododoc.directory.dto.validator;

import com.ssafy.ododoc.directory.dto.annotation.CheckFile;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;

public class CheckFileValidator implements ConstraintValidator<CheckFile, MultipartFile> {

    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {
        return !(file.isEmpty() || Objects.isNull(file.getOriginalFilename()));
    }
}

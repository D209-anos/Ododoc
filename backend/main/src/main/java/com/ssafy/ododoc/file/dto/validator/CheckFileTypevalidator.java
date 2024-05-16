package com.ssafy.ododoc.file.dto.validator;

import com.ssafy.ododoc.file.dto.annotation.CheckFileType;
import com.ssafy.ododoc.file.type.AddType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CheckFileTypevalidator implements ConstraintValidator<CheckFileType, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        String type = value.toUpperCase();

        try {
            AddType.valueOf(type);
        } catch (IllegalArgumentException e) {
            return false;
        }

        return true;
    }
}

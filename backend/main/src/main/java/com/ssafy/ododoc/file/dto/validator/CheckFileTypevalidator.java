package com.ssafy.ododoc.file.dto.validator;

import com.ssafy.ododoc.file.dto.annotation.CheckFileType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CheckFileTypevalidator implements ConstraintValidator<CheckFileType, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        String type = value.toUpperCase();

        if(!type.equals("SUCCESS") && !type.equals("FAIL") && !type.equals("SEARCH")) {
            return false;
        }

        return true;
    }
}

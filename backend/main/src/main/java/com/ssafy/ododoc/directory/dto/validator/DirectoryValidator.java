package com.ssafy.ododoc.directory.dto.validator;

import com.ssafy.ododoc.directory.dto.annotation.CheckDirectory;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class DirectoryValidator implements ConstraintValidator<CheckDirectory, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        try {
            String upperValue = value.toUpperCase();
            com.ssafy.ododoc.directory.type.DirectoryType.valueOf(upperValue);
        } catch (IllegalArgumentException e) {
            return false;
        }

        return true;
    }
}
